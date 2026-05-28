# Ningki AI Engine

AI Engine untuk Ningki WhatsApp AI CRM.

## Responsibilities

- Onboarding agent
- WhatsApp customer agent
- Knowledge agent
- CRM assistant agent
- RAG retrieval
- Tool orchestration
- Guardrail
- Agent run logging
- Tool execution logging

## Tech Stack

- FastAPI
- LangChain
- LangGraph
- Gemini
- FAISS
- Pydantic
- uv

## Setup

```bash
uv sync
```

## Run Development

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Test

```bash
uv run pytest
```

## Lint

```bash
uv run ruff check .
```

## Project Structure

- `app/api`: FastAPI endpoints.
- `app/agents`: LangGraph agents logic.
- `app/rag`: RAG pipeline components.
- `app/tools`: Agent tools.
- `app/schemas`: Pydantic models.
- `app/services`: Internal business logic services.
- `app/core`: Configuration and core utilities.
