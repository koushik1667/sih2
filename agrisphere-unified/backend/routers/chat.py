from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from ml.rag_engine import generate_rag_response

router = APIRouter(prefix="/api/chat", tags=["AI Agronomist (Krishi Mitra)"])

class ChatRequest(BaseModel):
    query: str = Field(..., example="Why are my wheat leaves turning yellow and what should I spray?")
    language: Optional[str] = Field("en", example="en")
    farm_context: Optional[Dict[str, Any]] = None

@router.post("")
def chat_with_agronomist(req: ChatRequest):
    """
    RAG-powered conversational agronomist providing ICAR guidelines and dosage.
    """
    return generate_rag_response(
        query=req.query,
        language=req.language or "en",
        farm_context=req.farm_context
    )

@router.get("/prompts")
def get_sample_prompts():
    """Returns quick prompt chips for common farmer inquiries."""
    return {
        "prompts": [
            {"id": 1, "title": "Wheat Leaf Yellowing", "query": "Why are wheat leaves turning pale yellow and what is the urea dosage?", "category": "Fertilizer / NPK"},
            {"id": 2, "title": "Pink Bollworm Control", "query": "How to prevent pink bollworm attack in cotton crop?", "category": "Pest Management"},
            {"id": 3, "title": "Soil Acidity Correction", "query": "How much lime should I apply for acidic soil with pH 5.2?", "category": "Soil Health"},
            {"id": 4, "title": "PM-KISAN & Crop Insurance", "query": "What are the latest eligibility rules for PMFBY crop insurance and PM-KISAN?", "category": "Govt Schemes"},
            {"id": 5, "title": "Legume Rotation Benefits", "query": "Which pulse crop is best after paddy to restore soil nitrogen?", "category": "Crop Rotation"}
        ]
    }
