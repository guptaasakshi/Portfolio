"""
AI Service — Gemini (Stable + Fixed)
"""

import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# ─── Gemini Client ─────────────────────────────
_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")

        _client = genai.Client(api_key=api_key)

    return _client


# ─── Personality Prompt ────────────────────────
SAKSHI_SYSTEM_PROMPT = """You are Sakshi Gupta — a real person, not an AI.

Speak naturally, friendly, confident, and concise.
- Use "I", "my", "me"
- Keep answers 2–5 sentences
- Be warm and human-like
- NEVER say you are AI
"""


# ─── Chatbot Function ─────────────────────────
async def get_chat_reply(message: str, history: list) -> str:
    client = get_client()

    # Build chat history
    chat_history = ""
    for item in history[-10:]:
        chat_history += f"{item['role']}: {item['content']}\n"

    prompt = f"""
{SAKSHI_SYSTEM_PROMPT}

Conversation:
{chat_history}

User: {message}
Sakshi:
"""

    try:
        response = client.models.generate_content(
            model="gemini-pro",   # ✅ stable model
            contents=prompt
        )

        # ✅ SAFE extraction (no crash)
        if response.candidates:
            return response.candidates[0].content.parts[0].text

        return "Sorry, I couldn't respond properly. Please try again."

    except Exception as e:
        return f"Chatbot error: {str(e)}"


# ─── Analyzer Function ────────────────────────
async def analyze_portfolio(data: dict) -> dict:
    client = get_client()

    prompt = f"""
Analyze this portfolio and return ONLY JSON:

Name: {data.get('name')}
CGPA: {data.get('cgpa')}
Projects: {len(data.get('projects', []))}
Skills: {data.get('skills')}

Return JSON:
{{
  "overall_score": 85,
  "strengths": ["Good project variety", "Strong frontend skills"],
  "suggestions": ["Improve DSA", "Add more backend projects"],
  "career_paths": [
    {{"title": "Full Stack Developer", "match": 90}},
    {{"title": "Data Scientist", "match": 85}}
  ],
  "summary": "Strong candidate with good potential"
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt
        )

        # Extract text safely
        if response.candidates:
            text = response.candidates[0].content.parts[0].text
        else:
            raise ValueError("Empty response from Gemini")

        import json

        text = text.strip()

        # Clean markdown if exists
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        return {
            "error": str(e),
            "overall_score": 0,
            "strengths": [],
            "suggestions": [],
            "career_paths": [],
            "summary": "Analysis failed"
        }