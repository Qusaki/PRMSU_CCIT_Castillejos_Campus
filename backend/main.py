import asyncio
import urllib.request
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from routes.auth import router as auth_router
from routes.gallery import router as gallery_router

def ping_server():
    try:
        # Pings the refresh route to keep the server and database awake natively
        urllib.request.urlopen("https://prmsu-ccit-castillejos-campus.onrender.com/api/refresh-db")
        print("Keep-alive ping successful")
    except Exception as e:
        print(f"Keep-alive ping failed: {e}")

async def keep_alive_task():
    while True:
        await asyncio.sleep(600) # 10 minutes (600 seconds)
        await asyncio.to_thread(ping_server)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the keep-alive task in the background
    task = asyncio.create_task(keep_alive_task())
    yield
    # Cancel background task gracefully on shutdown
    task.cancel()

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

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Backend!"}
