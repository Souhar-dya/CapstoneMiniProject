from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict
class Settings(BaseSettings):
    MONGO_URI: str
    DATABASE_NAME: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    REDIS_URL: str

    ENV: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()