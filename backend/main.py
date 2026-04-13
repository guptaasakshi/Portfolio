"""
Sakshi Portfolio Backend — FastAPI
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chatbot, analyzer
import os
from dotenv import load_dotenv

# Load environment variables (.env)
load_dotenv()

app = FastAPI(
    title="Sakshi Portfolio API",
    description="Backend API for Sakshi Gupta's Portfolio (Chatbot + Analyzer)",
    version="1.0.0"
)

# CORS (Frontend connect ke liye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Production me apna domain daalna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes (IMPORTANT: /api prefix use ho raha hai)
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])
app.include_router(analyzer.router, prefix="/api", tags=["Analyzer"])

# Health check
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "message": "Sakshi Portfolio API is running!",
        "ai": "Gemini Connected" if os.getenv("GEMINI_API_KEY") else "API Key Missing"
    }

# Root route
@app.get("/")
async def root():
    return {
        "message": "Welcome to Sakshi Gupta's Portfolio API 🚀",
        "features": ["AI Chatbot", "Portfolio Analyzer"],
        "version": "1.0.0"
    }