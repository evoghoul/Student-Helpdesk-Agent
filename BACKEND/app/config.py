from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from pydantic import field_validator
from typing import Annotated, List, Any
import os
import json

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
    
    # Database: Default to persistent SQLite database at database/student_helpdesk.db
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///database/student_helpdesk.db")
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
    FRONTEND_ORIGINS: Annotated[List[str], NoDecode] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]
    
    @field_validator("FRONTEND_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if not v_str:
                return []
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    parsed = json.loads(v_str)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        if isinstance(v, (list, tuple, set)):
            return [str(i).strip() for i in v if str(i).strip()]
        return [str(v)]

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    def validate_production_security(self):
        if self.ENVIRONMENT.lower() == "production" and (not self.SECRET_KEY or self.SECRET_KEY == DEFAULT_INSECURE_SECRET):
            raise RuntimeError("CRITICAL SECURITY ERROR: Insecure or default SECRET_KEY cannot be used in production environment.")

settings = Settings()
settings.validate_production_security()
