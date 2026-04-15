"""
Chatbot route — registered as /api/chat (prefix set in main.py)
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
from models.schemas import ChatRequest, ChatResponse
from services.ai_service import get_chat_reply

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        history = [h.model_dump() for h in req.history] if req.history else []
        reply   = await get_chat_reply(req.message.strip(), history)
        if not reply or not reply.strip():
            raise ValueError("Empty AI response")
        return ChatResponse(reply=reply.strip(), timestamp=datetime.utcnow().isoformat())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")