"""
Konfigurasi aplikasi AI Engine menggunakan Pydantic Settings.
Load dari environment variables / .env file.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "ningki-ai-enggine"
    app_port: int = 8000

    api_base_url: str = "http://localhost:3000"
    api_internal_token: str = "change_me"

    gemini_api_key: str = "change_me"
    gemini_model: str = "gemini-1.5-flash"
    gemini_embedding_model: str = "text-embedding-004"

    faiss_index_dir: str = "./app/storage/faiss"
    upload_tmp_dir: str = "./app/storage/tmp"

    redis_url: str = "redis://localhost:6379"
    rabbitmq_url: str = "amqp://localhost:5672"
    event_exchange: str = "nongki.events"
    event_exchange_type: str = "topic"
    event_producer_ai: str = "services/ai-engine"
    log_level: str = "info"

    class Config:
        env_file = ".env"


settings = Settings()
