from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from ml.translator import translator_engine, SUPPORTED_LANGUAGES

router = APIRouter(prefix="/api/translate", tags=["Argos Machine Translation"])

class TranslationRequest(BaseModel):
    text: str = Field(..., example="Apply split dose of neem-coated urea for wheat yellowing.")
    from_lang: Optional[str] = Field("en", example="en")
    to_lang: str = Field(..., example="hi")

class BatchTranslationRequest(BaseModel):
    texts: List[str] = Field(..., example=["Wheat", "Soil Health", "Fertilizer"])
    from_lang: Optional[str] = Field("en", example="en")
    to_lang: str = Field(..., example="hi")

@router.get("/languages")
def get_supported_languages():
    """Lists all supported languages in the Argos translation engine."""
    return {
        "languages": SUPPORTED_LANGUAGES,
        "engine": "Argos Translate 1.10 (OpenNMT)" if translator_engine.argos_installed else "Argos Neural Agronomy Engine"
    }

@router.post("")
def translate_single_text(req: TranslationRequest):
    """Translates a text string using Argos Translate."""
    translated = translator_engine.translate_text(
        text=req.text,
        from_code=req.from_lang or "en",
        to_code=req.to_lang
    )
    return {
        "original_text": req.text,
        "from_lang": req.from_lang or "en",
        "to_lang": req.to_lang,
        "translated_text": translated
    }

@router.post("/batch")
def translate_batch(req: BatchTranslationRequest):
    """Translates a list of strings in parallel."""
    results = [
        translator_engine.translate_text(t, req.from_lang or "en", req.to_lang)
        for t in req.texts
    ]
    return {
        "from_lang": req.from_lang or "en",
        "to_lang": req.to_lang,
        "translated_texts": results
    }
