"""
Analyzer route — /analyze
Receives full portfolio data, returns AI-powered analysis
"""

from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest
from services.ai_service import analyze_portfolio
import json

router = APIRouter(tags=["Analyzer"])


@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    """
    Full portfolio analysis endpoint.
    Sends portfolio data to Gemini, returns structured analysis.
    """
    try:
        # Convert request to dict
        data = req.model_dump()

        # Call AI service
        result = await analyze_portfolio(data)

        # Ensure valid JSON response
        if not isinstance(result, dict):
            raise ValueError("Invalid response from AI service")

        return {
            "success": True,
            "data": result
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input or AI response: {str(e)}"
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON format"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis error: {str(e)}"
        )