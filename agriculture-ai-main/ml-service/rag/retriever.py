"""
RAG Retriever
─────────────
Embeds query → searches FAISS index → returns top-k relevant chunks.

Two embedding modes (auto-detected based on available credentials):
  1. OpenAI text-embedding-3-small  (best quality, requires API key)
  2. SentenceTransformers all-MiniLM-L6-v2  (local, no API key needed)

The FAISS index is built once at startup from KNOWLEDGE_CHUNKS and held in memory.
Production upgrade: persist index to disk / swap FAISS for Pinecone/Weaviate.
"""

import os
import numpy as np
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)

# Lazy-loaded globals
_index = None
_chunks: List[Dict] = []
_embed_model = None
_embed_mode: str = "none"     # "openai" | "sentence_transformers" | "tfidf"


# ── TF-IDF fallback (zero dependencies beyond sklearn) ────────────
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_tfidf_vectorizer = None
_tfidf_matrix = None


def _init_tfidf(texts: List[str]):
    global _tfidf_vectorizer, _tfidf_matrix
    _tfidf_vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    _tfidf_matrix = _tfidf_vectorizer.fit_transform(texts)
    logger.info("TF-IDF index built (%d chunks)", len(texts))


def _search_tfidf(query: str, top_k: int) -> List[Tuple[int, float]]:
    q_vec = _tfidf_vectorizer.transform([query])
    sims = cosine_similarity(q_vec, _tfidf_matrix).flatten()
    top_idx = np.argsort(sims)[::-1][:top_k]
    return [(int(i), float(sims[i])) for i in top_idx if sims[i] > 0.01]


# ── SentenceTransformers (local) ───────────────────────────────────
def _init_sentence_transformers():
    global _embed_model, _embed_mode
    try:
        from sentence_transformers import SentenceTransformer
        _embed_model = SentenceTransformer("all-MiniLM-L6-v2")
        _embed_mode = "sentence_transformers"
        logger.info("Embedding mode: SentenceTransformers (local)")
    except Exception as e:
        logger.warning("SentenceTransformers unavailable: %s — falling back to TF-IDF", e)
        _embed_mode = "tfidf"


# ── OpenAI embeddings ──────────────────────────────────────────────
def _embed_openai(texts: List[str]) -> np.ndarray:
    import openai
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.embeddings.create(input=texts, model="text-embedding-3-small")
    return np.array([e.embedding for e in response.data], dtype="float32")


def _embed_sentence_transformers(texts: List[str]) -> np.ndarray:
    return np.array(_embed_model.encode(texts, normalize_embeddings=True), dtype="float32")


def _embed(texts: List[str]) -> np.ndarray:
    if _embed_mode == "openai":
        return _embed_openai(texts)
    elif _embed_mode == "sentence_transformers":
        return _embed_sentence_transformers(texts)
    raise RuntimeError("No embedding mode available")


# ── FAISS index ─────────────────────────────────────────────────────
def _build_faiss_index(embeddings: np.ndarray):
    import faiss
    dim = embeddings.shape[1]
    idx = faiss.IndexFlatIP(dim)   # Inner-product (cosine after L2 norm)
    idx.add(embeddings)
    return idx


# ── Public API ──────────────────────────────────────────────────────

def initialize(chunks: List[Dict]):
    """
    Build the retrieval index from knowledge chunks.
    Called once at application startup.
    """
    global _index, _chunks, _embed_mode

    _chunks = chunks
    texts   = [c["text"] for c in chunks]

    # Choose embedding strategy
    if os.getenv("OPENAI_API_KEY"):
        _embed_mode = "openai"
        logger.info("Embedding mode: OpenAI text-embedding-3-small")
    else:
        _init_sentence_transformers()

    if _embed_mode in ("openai", "sentence_transformers"):
        try:
            import faiss  # noqa
            embeddings = _embed(texts)
            _index = _build_faiss_index(embeddings)
            logger.info("FAISS index built (%d vectors, dim=%d)", len(texts), embeddings.shape[1])
        except ImportError:
            logger.warning("faiss-cpu not installed — falling back to TF-IDF")
            _embed_mode = "tfidf"

    if _embed_mode == "tfidf":
        _init_tfidf(texts)


def retrieve(query: str, top_k: int = 4) -> List[Dict]:
    """
    Search the index and return top_k relevant chunks.

    Returns list of:
    {
      "id":      str,
      "source":  str,
      "text":    str,
      "score":   float,
      "snippet": str,   # first 200 chars
    }
    """
    if not _chunks:
        return []

    if _embed_mode in ("openai", "sentence_transformers") and _index is not None:
        try:
            q_emb = _embed([query])
            scores, indices = _index.search(q_emb, min(top_k, len(_chunks)))
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx < 0 or score < 0.1:
                    continue
                chunk = _chunks[idx]
                results.append({
                    "id":      chunk["id"],
                    "source":  chunk["source"],
                    "text":    chunk["text"],
                    "score":   float(score),
                    "snippet": chunk["text"][:200],
                })
            return results
        except Exception as e:
            logger.error("FAISS search failed: %s — falling back to TF-IDF", e)

    # TF-IDF fallback
    if _tfidf_vectorizer is not None:
        hits = _search_tfidf(query, top_k)
        results = []
        for idx, score in hits:
            chunk = _chunks[idx]
            results.append({
                "id":      chunk["id"],
                "source":  chunk["source"],
                "text":    chunk["text"],
                "score":   score,
                "snippet": chunk["text"][:200],
            })
        return results

    return []
