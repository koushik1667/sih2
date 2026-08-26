"""
Chat Router (FastAPI)
──────────────────────
End-to-end RAG chat endpoint:
  POST /rag/chat      → retrieve context → LLM → response
  POST /rag/summarize → summarize session transcript

The retriever and LLM service are initialized at app startup (see app.py).
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging

from rag import retriever, llm_service

router  = APIRouter(prefix="/rag", tags=["RAG Chat"])
logger  = logging.getLogger(__name__)


# ── Schemas ────────────────────────────────────────

class ChatRequest(BaseModel):
    message:         str
    session_id:      Optional[str]  = None
    session_summary: Optional[str]  = ""
    farm_context:    Optional[Dict[str, Any]] = None
    language:        Optional[str]  = "en"

class SummarizeRequest(BaseModel):
    transcript: str


# ── Endpoints ──────────────────────────────────────

@router.post("/chat", summary="RAG-powered conversational AI for farming queries")
def rag_chat(req: ChatRequest):
    """
    Full RAG pipeline:
      1. Retrieve top-k agricultural knowledge chunks for the query
      2. Build enriched prompt with farm context + retrieved knowledge
      3. Call LLM (OpenAI or fallback)
      4. Return structured response with RAG metadata

    Response:
    {
      response:    str,
      rag_context: list[{id, source, score, snippet}],
      model_used:  str,
      tokens_used: int,
      latency_ms:  int,
    }
    """
    # Step 1: Retrieve relevant chunks
    rag_chunks = retriever.retrieve(req.message, top_k=4)
    logger.info(
        "RAG: query='%s...' retrieved=%d chunks (top score=%.2f)",
        req.message[:50],
        len(rag_chunks),
        rag_chunks[0]["score"] if rag_chunks else 0,
    )

    # Step 2: Generate LLM response
    result = llm_service.generate_response(
        user_message    = req.message,
        rag_chunks      = rag_chunks,
        farm_context    = req.farm_context,
        session_summary = req.session_summary or "",
        language        = req.language or "en",
    )

    # Step 3: Return structured response
    return {
        "response":    result["response"],
        "rag_context": [
            {
                "id":      c["id"],
                "source":  c["source"],
                "score":   round(c["score"], 3),
                "snippet": c["snippet"],
            }
            for c in rag_chunks
        ],
        "model_used":  result["model_used"],
        "tokens_used": result["tokens_used"],
        "latency_ms":  result["latency_ms"],
    }


@router.post("/summarize", summary="Summarize a conversation transcript for memory compression")
def summarize(req: SummarizeRequest):
    """
    Generate a concise 2-3 sentence summary of a conversation.
    Used by the Node.js backend to compress session memory every 10 messages.
    """
    summary = llm_service.summarize_session(req.transcript)
    return {"summary": summary}
