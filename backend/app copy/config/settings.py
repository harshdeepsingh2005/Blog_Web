from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    DATABASE_URL: str = "sqlite:///./blogging_platform.db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
