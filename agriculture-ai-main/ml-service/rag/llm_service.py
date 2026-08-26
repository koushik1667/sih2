"""
LLM Service
────────────
Constructs prompts from:
  - User message
  - Retrieved RAG context
  - Farm snapshot (soil, crop, weather)
  - Session memory summary

Calls OpenAI GPT (with automatic fallback to rule-based response).
"""

import os
import logging
import time
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are AgriAI, an intelligent farming assistant for Indian farmers.
You have access to the farmer's real-time farm data (soil health, crops, weather) and a curated agricultural knowledge base.

Your role:
- Give practical, actionable advice in simple language
- Be specific: mention doses, timings, product names where relevant
- Consider the farmer's actual soil and crop data when answering
- Prioritize low-cost, sustainable solutions
- Mention government schemes and subsidies when relevant (PM-KISAN, PMKSY, Soil Health Card)
- Use regional context (state, district) for local variety/market recommendations

Response style:
- Keep responses under 200 words unless detailed explanation is required
- Use bullet points for multi-step instructions
- Be empathetic — farming is weather-dependent and stressful
- If unsure, say so clearly rather than guessing

Language: Respond in {language}. If language is 'hi' use Hindi, 'kn' Kannada, 'ta' Tamil, 'te' Telugu. Default: English.
"""

def _build_user_prompt(
    user_message: str,
    rag_chunks: List[Dict],
    farm_context: Optional[Dict],
    session_summary: str,
) -> str:
    parts = []

    # Session memory
    if session_summary:
        parts.append(f"[Conversation context: {session_summary}]\n")

    # Farm data snapshot
    if farm_context:
        soil = farm_context.get("soil") or {}
        parts.append(
            f"[Farmer's current farm data:\n"
            f"  Location: {farm_context.get('location', {}).get('district', 'unknown')}, "
            f"{farm_context.get('location', {}).get('state', '')}\n"
            f"  Current crop: {farm_context.get('currentCrop', 'not specified')}\n"
            f"  Soil pH: {soil.get('pH', 'unknown')} | "
            f"N: {soil.get('N', '?')} kg/ha | P: {soil.get('P', '?')} | K: {soil.get('K', '?')}\n"
            f"  Organic carbon: {soil.get('organicCarbon', '?')}% | "
            f"Soil moisture: {soil.get('moisture', '?')}%\n"
            f"  Soil health score: {soil.get('healthScore', '?')}/100\n"
            f"  Farm size: {farm_context.get('landSize', '?')} ha | "
            f"Irrigation: {farm_context.get('irrigationType', 'unknown')}]\n"
        )

    # RAG context
    if rag_chunks:
        context_text = "\n\n".join(
            f"[Knowledge {i+1} — {c['source']}]:\n{c['text']}"
            for i, c in enumerate(rag_chunks[:3])
        )
        parts.append(f"[Relevant agricultural knowledge:\n{context_text}]\n")

    parts.append(f"Farmer's question: {user_message}")
    return "\n".join(parts)


def generate_response(
    user_message: str,
    rag_chunks: List[Dict],
    farm_context: Optional[Dict],
    session_summary: str = "",
    language: str = "en",
) -> Dict:
    """
    Call OpenAI GPT with enriched context.
    Falls back to rule-based response if OpenAI is unavailable.

    Returns: { response, model_used, tokens_used, latency_ms }
    """
    t0 = time.time()
    user_prompt = _build_user_prompt(user_message, rag_chunks, farm_context, session_summary)

    # ── Try OpenAI ─────────────────────────────────────────
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            import openai
            client = openai.OpenAI(api_key=api_key)
            completion = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT.format(language=language)},
                    {"role": "user",   "content": user_prompt},
                ],
                temperature=0.4,
                max_tokens=400,
            )
            response_text = completion.choices[0].message.content.strip()
            return {
                "response":    response_text,
                "model_used":  completion.model,
                "tokens_used": completion.usage.total_tokens,
                "latency_ms":  int((time.time() - t0) * 1000),
            }
        except Exception as e:
            logger.error("OpenAI call failed: %s", e)

    # ── Fallback: template-based response using RAG context ────
    response_text = _template_response(user_message, rag_chunks, farm_context)
    return {
        "response":    response_text,
        "model_used":  "template_fallback",
        "tokens_used": 0,
        "latency_ms":  int((time.time() - t0) * 1000),
    }


def _template_response(user_message: str, chunks: List[Dict], farm: Optional[Dict]) -> str:
    """
    Rule-based response when LLM is unavailable.
    Uses the top RAG chunk as the core answer.
    """
    if chunks:
        top = chunks[0]
        answer = top["text"][:400]
        # Personalize with farm data if available
        if farm and farm.get("currentCrop"):
            answer = f"For your {farm['currentCrop']} crop:\n\n" + answer
        return answer + "\n\n_Source: AgriTech Knowledge Base_"

    return (
        "I don't have specific information for that query right now. "
        "For immediate help, contact your local KVK (Krishi Vigyan Kendra) "
        "or the Kisan Call Center at 1800-180-1551 (free, available in regional languages)."
    )


def summarize_session(transcript: str) -> str:
    """Generate a rolling summary of the conversation for memory compression."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return ""
    try:
        import openai
        client = openai.OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": (
                    f"Summarize this farmer–AI conversation in 2-3 sentences, "
                    f"capturing key topics, decisions, and pending issues:\n\n{transcript}"
                ),
            }],
            temperature=0.3,
            max_tokens=150,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error("Summary generation failed: %s", e)
        return ""
