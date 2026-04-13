"""
Chatbot route — /chat
Receives user message + history, returns Sakshi's AI reply
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from models.schemas import ChatRequest, ChatResponse
from services.ai_service import get_chat_reply

router = APIRouter(tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Main chatbot endpoint.
    - message: user's text
    - history: list of previous {role, content} turns
    Returns Sakshi's reply.
    """
    try:
        # Validate input
        if not req.message or not req.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Convert history safely
        history = []
        if req.history:
            history = [h.model_dump() for h in req.history]

        # Call AI service (Gemini)
        reply = await get_chat_reply(req.message.strip(), history)

        # Validate reply
        if not reply or not reply.strip():
            raise ValueError("Empty response from AI")

        return ChatResponse(
            reply=reply.strip(),
            timestamp=datetime.utcnow().isoformat()
        )

    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI processing error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot error: {str(e)}"
        )