from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from core.database import get_db

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Quick DB connection test
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        
    return {
        "status": "ok", 
        "message": "API is healthy",
        "database_status": db_status
    }

@router.get("/refresh-db")
def refresh_database(db: Session = Depends(get_db)):
    """Pings database actively by writing and deleting to keep Supabase from pausing"""
    try:
        # Create a dummy table if it doesn't exist to avoid messing with real data
        db.execute(text("CREATE TABLE IF NOT EXISTS supabase_keep_alive (id serial primary key, pinged_at timestamp default now());"))
        
        # Insert a row to trigger database write activity
        db.execute(text("INSERT INTO supabase_keep_alive DEFAULT VALUES;"))
        
        # Delete rows immediately to refresh it and prevent storage bloat
        db.execute(text("DELETE FROM supabase_keep_alive;"))
        
        db.commit()
        return {"status": "success", "message": "Database write-and-delete cycle completed."}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
