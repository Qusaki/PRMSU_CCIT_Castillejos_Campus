from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI Backend"
    debug: bool = True
    database_url: str
    
    # JWT security settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Supabase config
    supabase_url: str
    supabase_key: str
    supabase_bucket: str = "gallery"
    supabase_events_bucket: str = "events"

    class Config:
        env_file = ".env"

settings = Settings()
