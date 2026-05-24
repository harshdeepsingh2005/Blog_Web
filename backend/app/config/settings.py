from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    # PostgreSQL connection string for deployment
    DATABASE_URL: str
    # Deployment URLs
    BASE_URL: str = "http://localhost:8000"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "https://blogify-objective.vercel.app"]

    # Use 'backend/.env' since we are running the app from the root directory
    model_config = SettingsConfigDict(env_file="backend/.env", extra="ignore")

settings = Settings()
