# ─────────────────────────────────────────
# AI-Engine — Python/LangChain/FAISS
# ─────────────────────────────────────────
# ─────────────────────────────────────────
# Dev stage (used by docker-compose.dev.yml)
# ─────────────────────────────────────────
FROM python:3.12-slim AS dev
RUN apt-get update && apt-get install -y libgomp1 curl && rm -rf /var/lib/apt/lists/*
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
COPY . .
RUN mkdir -p /app/vector_store /app/db
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ─────────────────────────────────────────
# Production stage
# ─────────────────────────────────────────
FROM python:3.12-slim AS production

RUN apt-get update && apt-get install -y \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:/root/.local/bin:$PATH"

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY main.py ./
COPY src/ src/

RUN mkdir -p /app/vector_store /app/db

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# libgomp1 is required by FAISS for OpenMP support.
# uv run respects the virtual environment defined in pyproject.toml.
