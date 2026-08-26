FROM python:3.11-slim AS base
WORKDIR /app

# System deps for faiss-cpu / sentence-transformers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python deps (separate layer for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download sentence-transformers model at build time (offline capability)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" || true

# Copy source
COPY . .

# Non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5001
ENV ENV=production

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5001", "--workers", "2"]
