"""
Sakshi Portfolio Backend — FastAPI
Run: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chatbot, analyzer
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Sakshi Portfolio API",
    description="Backend API for Sakshi Gupta's Portfolio",
    version="1.0.0"
)

# CORS — allow all origins (frontend can call from anywhere)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes with /api prefix
# Final endpoints:  POST /api/chat  |  POST /api/analyze
app.include_router(chatbot.router,  prefix="/api", tags=["Chatbot"])
app.include_router(analyzer.router, prefix="/api", tags=["Analyzer"])

@app.get("/health")
async def health():
    key_set = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "ok",
        "message": "Sakshi Portfolio API is running!",
        "gemini": "Connected" if key_set else "API Key Missing — add GEMINI_API_KEY to .env",
        "endpoints": {
            "chatbot":  "POST /api/chat",
            "analyzer": "POST /api/analyze",
        }
    }

@app.get("/")
async def root():
    return {"message": "Sakshi Portfolio API v1.0", "docs": "/docs"}