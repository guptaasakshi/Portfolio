"""
Analyzer route — registered as /api/analyze (prefix set in main.py)
"""
from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest
from services.ai_service import analyze_portfolio

router = APIRouter()


@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    try:
        data   = req.model_dump()
        result = await analyze_portfolio(data)
        if not isinstance(result, dict):
            raise ValueError("Invalid AI response")
        return {"success": True, "data": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")