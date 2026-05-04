import asyncio
import urllib.request
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from routes.auth import router as auth_router
from routes.gallery import router as gallery_router
from routes.events import router as events_router

def ping_render_health():
    try:
        # Pings the basic health route every 10 mins to keep the Render server from sleeping
        urllib.request.urlopen("https://prmsu-ccit-castillejos-campus.onrender.com/api/health")
    except Exception as e:
        pass

def ping_supabase_db():
    try:
        # Pings the database refresh route to stop Supabase pausing
        urllib.request.urlopen("https://prmsu-ccit-castillejos-campus.onrender.com/api/refresh-db")
        print("Keep-alive DB refresh ping successful")
    except Exception as e:
        print(f"Keep-alive DB refresh ping failed: {e}")

async def render_keep_alive_task():
    while True:
        await asyncio.sleep(600) # 10 minutes (600 seconds)
        await asyncio.to_thread(ping_render_health)

async def supabase_keep_alive_task():
    # Run once 1 minute after server boots
    await asyncio.sleep(60)
    await asyncio.to_thread(ping_supabase_db)
    while True:
        # Wait 6 days before running again
        await asyncio.sleep(6 * 24 * 60 * 60)
        await asyncio.to_thread(ping_supabase_db)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start both keep-alive background tasks
    task1 = asyncio.create_task(render_keep_alive_task())
    task2 = asyncio.create_task(supabase_keep_alive_task())
    yield
    # Cancel background tasks gracefully on shutdown
    task1.cancel()
    task2.cancel()

app = FastAPI(
    title="PRMSU CCIT Castillejos Campus",
    description="President Ramon Magsaysay State University - Official Website for the Department of CCIT",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(gallery_router, prefix="/api/gallery", tags=["gallery"])
app.include_router(events_router, prefix="/api/events", tags=["events"])

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Backend!"}
