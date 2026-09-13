from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    APP_NAME: str = "Agent 65: Student Helpdesk API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agent65-super-secret-production-key-change-in-prod-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student_helpdesk")
    USE_IN_MEMORY_DB: bool = os.getenv("USE_IN_MEMORY_DB", "true").lower() in ("true", "1", "yes")
    
    # LLM Provider: 'mock' (default, 0 API keys), 'local' (Ollama), 'cloud' (OpenAI/Gemini)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    LOCAL_MODEL_URL: str = os.getenv("LOCAL_MODEL_URL", "http://localhost:11434/api/generate")
    LOCAL_MODEL_NAME: str = os.getenv("LOCAL_MODEL_NAME", "llama3")
    CLOUD_API_KEY: str = os.getenv("LLM_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # CORS
    FRONTEND_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
