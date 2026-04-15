"""
diagnosis.py — Run: python diagnosis.py
Finds which models work with your API key
"""
import os, asyncio
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY", "")

# All possible model names across API versions
MODELS_TO_TEST = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemma-3-27b-it",
    "gemma-3-12b-it",
]

async def test():
    print("\n" + "="*60)
    print("  SAKSHI BACKEND — DIAGNOSIS v2")
    print("="*60)

    if not API_KEY:
        print("❌ GEMINI_API_KEY not found in .env!")
        return

    print(f"✅ Key: {API_KEY[:12]}...{API_KEY[-4:]} ({len(API_KEY)} chars)\n")

    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=API_KEY)
        print("✅ SDK imported\n")
    except ImportError:
        print("❌ Run: pip install google-genai")
        return

    # First list available models
    print("📋 Listing available models for your key...")
    try:
        available = []
        for m in client.models.list():
            name = m.name.replace("models/", "")
            if "generate" in str(m).lower() or "flash" in name or "pro" in name:
                available.append(name)
                print(f"   ✓ {name}")
        print(f"\n   Total: {len(available)} models\n")
    except Exception as e:
        print(f"   Could not list models: {e}\n")
        available = []

    # Test each model
    print("🧪 Testing models (sending 'Say: OK')...")
    print("-"*50)
    working = []

    test_list = available[:8] if available else MODELS_TO_TEST

    for model in test_list:
        try:
            resp = client.models.generate_content(
                model=model,
                config=types.GenerateContentConfig(max_output_tokens=20),
                contents=[types.Content(role="user", parts=[types.Part(text="Say: OK")])],
            )
            if resp.text:
                print(f"✅ {model:<40} → WORKS!")
                working.append(model)
            else:
                print(f"⚠️  {model:<40} → Empty response")
        except Exception as e:
            err = str(e)
            if "429" in err or "QUOTA" in err or "quota" in err.lower() or "EXHAUSTED" in err:
                print(f"🔴 {model:<40} → QUOTA EXCEEDED")
            elif "404" in err or "NOT_FOUND" in err:
                print(f"⚠️  {model:<40} → Not available for your key")
            elif "403" in err or "PERMISSION" in err or "invalid" in err.lower():
                print(f"🔴 {model:<40} → Invalid key / No permission")
            else:
                print(f"❌ {model:<40} → {err[:50]}")

    print("-"*50)
    if working:
        print(f"\n🎉 Working models: {working}")
        print(f"\n👉 Copy this to ai_service.py CHAT_MODELS list:")
        print(f'   CHAT_MODELS = {working}')
    else:
        print("\n❌ No models working!")
        print("\n🔑 SOLUTION: Get a new FREE API key:")
        print("   1. Go to: https://aistudio.google.com/app/apikey")
        print("   2. Click 'Create API Key'")
        print("   3. Copy the key")
        print("   4. Replace in backend/.env:")
        print("      GEMINI_API_KEY=paste_new_key_here")
        print("   5. Run: python diagnosis.py  (again)")

    print("="*60 + "\n")

asyncio.run(test())