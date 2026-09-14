from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

DEFAULT_INSECURE_SECRET = "agent65-super-secret-production-key-change-in-prod-12345"

class Settings(BaseSettings):
    APP_NAME: str = "Agent 65: Student Helpdesk API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", DEFAULT_INSECURE_SECRET)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: Default to false (persistent SQLite database at database/student_helpdesk.db)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student_helpdesk")
    USE_IN_MEMORY_DB: bool = os.getenv("USE_IN_MEMORY_DB", "false").lower() in ("true", "1", "yes")
    
    # LLM Provider: 'local' (default, Ollama), 'mock' (deterministic templates), 'cloud' (OpenAI/Gemini)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "local")
    LOCAL_MODEL_URL: str = os.getenv("LOCAL_MODEL_URL", "http://localhost:11434")
    LOCAL_MODEL_NAME: str = os.getenv("LOCAL_MODEL_NAME", "agent65-8b:latest")
    LOCAL_FAST_MODEL_NAME: str = os.getenv("LOCAL_FAST_MODEL_NAME", "agent65:latest")
    CLOUD_API_KEY: str = os.getenv("LLM_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    FRONTEND_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    def validate_production_security(self):
        if self.ENVIRONMENT.lower() == "production" and (not self.SECRET_KEY or self.SECRET_KEY == DEFAULT_INSECURE_SECRET):
            raise RuntimeError("CRITICAL SECURITY ERROR: Insecure or default SECRET_KEY cannot be used in production environment.")

settings = Settings()
settings.validate_production_security()
