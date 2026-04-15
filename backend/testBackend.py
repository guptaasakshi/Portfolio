"""
Quick test script — run from backend/ folder:
    python test_backend.py

This checks:
1. Gemini API key is valid
2. Chat reply works
3. Analyzer works
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    print("\n" + "="*50)
    print("  SAKSHI BACKEND — TEST SCRIPT")
    print("="*50)

    # 1. Check env
    key = os.getenv("GEMINI_API_KEY", "")
    if not key:
        print("❌ GEMINI_API_KEY not set in .env!")
        return
    print(f"✅ API Key found: {key[:8]}...{key[-4:]}")

    # 2. Import service
    try:
        from services.ai_service import get_chat_reply, analyze_portfolio
        print("✅ ai_service.py imported OK")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Run: pip install -r requirements.txt")
        return

    # 3. Test chat
    print("\n--- Testing Chatbot ---")
    try:
        reply = await get_chat_reply("Hi Sakshi! Tell me about yourself in one line.", [])
        print(f"✅ Chat works!")
        print(f"   Sakshi says: {reply[:120]}...")
    except Exception as e:
        print(f"❌ Chat failed: {e}")

    # 4. Test analyzer (with minimal data — fast test)
    print("\n--- Testing Analyzer ---")
    try:
        mini_data = {
            "name": "Sakshi Gupta", "cgpa": 8.82, "degree": "B.Tech CSE",
            "college": "SIET", "year": 2,
            "projects": [{"name": "ArtifyX", "type": "AI/ML", "tech": ["Python"], "live": True}],
            "skills": {"frontend": ["React"], "backend": ["Node.js"], "datascience": ["Python"],
                      "languages": ["JavaScript"], "databases": ["MySQL"], "tools": ["Git"]},
            "certifications": ["Full Stack (Coursera)"],
            "github": "github.com/guptaasakshi", "linkedin": "",
        }
        result = await analyze_portfolio(mini_data)
        score = result.get("overall_score", "?")
        print(f"✅ Analyzer works! Overall score: {score}/100")
        print(f"   Summary: {result.get('ai_summary', '')[:100]}...")
    except Exception as e:
        print(f"❌ Analyzer failed: {e}")

    print("\n" + "="*50)
    print("  If all ✅ above — start server:")
    print("  uvicorn main:app --reload --port 8000")
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(main())