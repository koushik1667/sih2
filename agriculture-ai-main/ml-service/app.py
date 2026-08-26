"""
AgriTech ML Service — FastAPI
─────────────────────────────
Upgraded from Flask to FastAPI for:
  - Async support for I/O-bound LLM calls
  - Automatic OpenAPI docs at /docs
  - Pydantic request/response validation
  - Proper lifespan management (startup/shutdown events)

Endpoints:
  GET  /health                      → service health + RAG status
  POST /predict/nutrient-depletion  → nutrient depletion projection
  POST /predict/rotation            → crop rotation recommendation
  POST /predict/soil-score          → soil health score 0-100
  POST /soil/score                  → alias (used by soilController.js)
  POST /rag/chat                    → RAG + LLM conversational AI
  POST /rag/summarize               → session memory compression
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")
logger = logging.getLogger(__name__)


# ── Startup / Shutdown ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing RAG knowledge base...")
    try:
        from rag.knowledge_base import get_all_chunks
        from rag import retriever
        retriever.initialize(get_all_chunks())
        logger.info("RAG ready — %d chunks, mode: %s", len(retriever._chunks), retriever._embed_mode)
    except Exception as e:
        logger.error("RAG initialization failed: %s — service will use fallback responses", e)
    yield
    logger.info("ML Service shutting down.")


# ── App instance ───────────────────────────────────
app = FastAPI(
    title       = "AgriTech ML Service",
    description = "AI-powered predictions and RAG chat for agriculture",
    version     = "2.0.0",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["*"],
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)


# ── Register routers ───────────────────────────────
from routers.predictions import router as pred_router
from routers.chat        import router as chat_router

app.include_router(pred_router)
app.include_router(chat_router)

# /soil/score alias (soilController.js calls this)
from routers.predictions import compute_soil_score, SoilScoreRequest
@app.post("/soil/score", tags=["Soil Alias"])
def soil_score_alias(req: SoilScoreRequest):
    return compute_soil_score(req)


# ── Health check ───────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    try:
        from rag import retriever
        rag_status = {"chunks": len(retriever._chunks), "mode": retriever._embed_mode}
    except Exception:
        rag_status = {"chunks": 0, "mode": "unavailable"}

    return {
        "status":     "ok",
        "service":    "agritech-ml",
        "rag":        rag_status,
        "openai_key": bool(os.getenv("OPENAI_API_KEY")),
        "version":    "2.0.0",
    }


# ── Dev entry point ────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host    = "0.0.0.0",
        port    = int(os.getenv("PORT", 5001)),
        reload  = os.getenv("ENV", "development") == "development",
        log_level = "info",
    )
