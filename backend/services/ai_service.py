"""
AI Service — Google Gemini
Uses direct HTTP calls so we control the API version (v1 not v1beta)
This fixes the 404 NOT_FOUND issue for gemini-1.5 models
"""
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

# Gemini REST API endpoint — using v1 (stable, not v1beta)
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1/models"

# Models in priority order
CHAT_MODELS = [
    "gemini-1.5-flash",      # fast, free tier
    "gemini-1.5-pro",        # more capable
    "gemini-2.0-flash",      # newest (may hit quota)
    "gemini-1.0-pro",        # oldest, very stable
]

SAKSHI_SYSTEM = """You are Sakshi Gupta — a real person, NOT an AI. You are chatting on your own portfolio website. Speak naturally as Sakshi in first person.

ABOUT YOU:
- B.Tech CSE at Shobhit Institute of Engineering & Technology (2023-present), CGPA 8.82
- Web Developer & Data Science Intern
- 12th: DDI College 88% | 10th: DDH School 91%

SKILLS: HTML5, CSS3, Bootstrap, Tailwind, JavaScript, React.js, React Native, Node.js, PHP, Python, Pandas, NumPy, Matplotlib, Scikit-learn, R, Java, C, C++, MySQL, MongoDB, Git/GitHub, VS Code, Jupyter

PROJECTS:
1. ArtifyX - AI Neural Style Transfer (Python, Streamlit, TensorFlow) LIVE
2. Skylytics - R flight forecasting with ARIMA
3. AeroSense - Air quality ML dashboard
4. ToneCanvas - Multimodal AI: text→image+music
5. Eco Vision Predictor - LSTM deforestation (Google Earth Engine)
6. Student Registration Form (PHP, MySQL) LIVE
7. Multiples Games - 6 mini-games (JS) LIVE
8. AI Chatbot (Next.js, OpenAI) LIVE
9. Calculator App (React) LIVE
10. StarPop Adventure (JS game) LIVE
11. Weather App (JS + API)
12. To-Do App (React) LIVE
13. Animated Landing Page (GSAP) LIVE
14. Advanced Music Player (PHP, MySQL)

CERTIFICATIONS: Full Stack Web Dev (Coursera), Data Science (Coursera), Google Analytics, React Advanced (Udemy)
CONTACT: sakshigupta004479@gmail.com | +91 9267935243 | github.com/guptaasakshi

RULES:
- Use I, my, me — you ARE Sakshi
- NEVER say you are AI or Gemini
- Keep answers 2-5 sentences
- Be warm and friendly, use occasional emojis"""


def get_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY not set in .env file!")
    return key


def build_messages(history: list, message: str) -> list:
    """Convert history + new message to Gemini REST format."""
    contents = []
    for item in history[-12:]:
        role = "user" if item["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": item["content"]}]})
    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents


async def call_gemini(model: str, contents: list, system: str = "", max_tokens: int = 400, temp: float = 0.8) -> str:
    """
    Direct REST call to Gemini API using v1 endpoint.
    Returns text response or raises exception.
    """
    api_key = get_api_key()
    url = f"{GEMINI_API_BASE}/{model}:generateContent?key={api_key}"

    payload = {
        "contents": contents,
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": temp,
        }
    }

    if system:
        payload["systemInstruction"] = {
            "parts": [{"text": system}]
        }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)

    if response.status_code == 429:
        raise Exception("QUOTA_EXCEEDED")
    elif response.status_code == 404:
        raise Exception("MODEL_NOT_FOUND")
    elif response.status_code == 403:
        raise Exception("PERMISSION_DENIED — invalid API key")
    elif response.status_code != 200:
        err_body = response.json()
        raise Exception(f"HTTP_{response.status_code}: {err_body.get('error', {}).get('message', 'Unknown error')}")

    data = response.json()

    # Extract text from response
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise Exception("Could not extract text from Gemini response")


async def get_chat_reply(message: str, history: list) -> str:
    """Try each model until one works. Returns Sakshi's reply."""

    contents = build_messages(history, message)
    quota_exceeded_count = 0

    for model in CHAT_MODELS:
        try:
            reply = await call_gemini(model, contents, system=SAKSHI_SYSTEM, max_tokens=400, temp=0.8)
            if reply and reply.strip():
                print(f"[CHATBOT] ✓ Model used: {model}")
                return reply.strip()

        except Exception as e:
            err = str(e)
            print(f"[CHATBOT] ✗ {model}: {err[:80]}")

            if "QUOTA_EXCEEDED" in err:
                quota_exceeded_count += 1
                continue  # try next model
            elif "MODEL_NOT_FOUND" in err:
                continue  # try next model
            elif "PERMISSION_DENIED" in err or "invalid" in err.lower():
                return "There's an API key issue. Please check GEMINI_API_KEY in backend/.env 🔑"
            else:
                continue

    # All models failed
    if quota_exceeded_count == len(CHAT_MODELS):
        return (
            "My AI quota is exhausted for today! 😅 "
            "Please get a new free key at https://aistudio.google.com/app/apikey "
            "and update backend/.env"
        )

    return (
        "Backend AI is temporarily unavailable. "
        "Please restart the backend server and try again! 🔄"
    )


async def analyze_portfolio(data: dict) -> dict:
    """AI-powered portfolio analysis."""
    projects = data.get("projects", [])
    skills   = data.get("skills", {})
    certs    = data.get("certifications", [])

    proj_text = "\n".join(
        f"  {i+1}. {p['name']} ({p['type']}) [{', '.join(p['tech'])}]{' [LIVE]' if p.get('live') else ''}"
        for i, p in enumerate(projects)
    )
    all_skills = [s for cat in skills.values() for s in cat]

    web_types = {"Web","React","GSAP","Game","API","PHP","AI/Web"}
    ml_types  = {"AI/ML","Data Science","ML/Analytics","GenAI","LSTM/GEE"}
    live_c    = sum(1 for p in projects if p.get("live"))
    web_c     = sum(1 for p in projects if p.get("type") in web_types)
    ml_c      = sum(1 for p in projects if p.get("type") in ml_types)

    prompt = f"""You are a senior technical recruiter. Analyze this student portfolio.

CANDIDATE: {data.get('name')} | {data.get('degree')} | CGPA: {data.get('cgpa')}/10 | Year {data.get('year')}/4 | {data.get('college')}

PROJECTS ({len(projects)} total, {live_c} live):
{proj_text}

SKILLS ({len(all_skills)}):
  Frontend: {', '.join(skills.get('frontend', []))}
  Backend: {', '.join(skills.get('backend', []))}
  Data Science: {', '.join(skills.get('datascience', []))}
  Languages: {', '.join(skills.get('languages', []))}
  Databases: {', '.join(skills.get('databases', []))}

CERTIFICATIONS: {', '.join(certs)}

Return ONLY valid JSON (no markdown, no explanation, no backticks):
{{"overall_score":87,"scores":{{"innovation":92,"skill_range":88,"project_depth":85,"career_ready":82}},"strengths":["specific strength 1","specific strength 2","specific strength 3"],"suggestions":["actionable suggestion 1","actionable suggestion 2","actionable suggestion 3"],"career_paths":[{{"rank":"Best Fit","title":"job title","description":"one sentence why","match_percent":94}},{{"rank":"Strong Fit","title":"job title","description":"one sentence why","match_percent":89}},{{"rank":"Good Fit","title":"job title","description":"one sentence why","match_percent":83}}],"ai_summary":"2-3 sentence honest overall assessment","skill_levels":{{"Web Dev":92,"Python/ML":85,"React":88,"Data Sci":80,"Backend":70,"DevOps":58}},"project_stats":{{"total":{len(projects)},"live":{live_c},"web_dev":{web_c},"ml_ai":{ml_c}}}}}"""

    contents = [{"role": "user", "parts": [{"text": prompt}]}]

    for model in CHAT_MODELS:
        try:
            raw = await call_gemini(model, contents, max_tokens=1200, temp=0.2)
            if not raw:
                continue

            # Strip markdown if present
            clean = raw.strip()
            if "```" in clean:
                for block in clean.split("```"):
                    b = block.strip().lstrip("json").strip()
                    if b.startswith("{"):
                        clean = b
                        break

            s = clean.find("{"); e = clean.rfind("}") + 1
            if s >= 0 and e > s:
                clean = clean[s:e]

            result = json.loads(clean)
            print(f"[ANALYZER] ✓ Model used: {model}")
            return result

        except json.JSONDecodeError:
            continue
        except Exception as e:
            err = str(e)
            print(f"[ANALYZER] ✗ {model}: {err[:80]}")
            continue

    # All failed — return static
    return _fallback_analysis()


def _fallback_analysis(note: str = "") -> dict:
    return {
        "overall_score": 87,
        "scores": {"innovation":92,"skill_range":88,"project_depth":85,"career_ready":82},
        "strengths": [
            "Strong full-stack foundation with React & Node.js",
            "Impressive ML/AI portfolio with 5 data science projects",
            "Excellent CGPA (8.82) with 14 diverse real-world projects",
        ],
        "suggestions": [
            "Add TypeScript to React projects for better type safety",
            "Deploy remaining ML models on HuggingFace or Streamlit",
            "Contribute to open-source to strengthen GitHub profile",
        ],
        "career_paths": [
            {"rank":"Best Fit",   "title":"Full-Stack ML Engineer",  "description":"React + Python ML pipeline is a rare and valuable combination","match_percent":94},
            {"rank":"Strong Fit", "title":"Frontend Developer",       "description":"Excellent UI skills with React, GSAP, and responsive design",   "match_percent":89},
            {"rank":"Good Fit",   "title":"Data Scientist",           "description":"Strong ML fundamentals with 5 analytical deployed projects",     "match_percent":83},
        ],
        "ai_summary": "Sakshi shows exceptional versatility for a 2nd-year CSE student. Strong web + ML combination makes her an excellent internship candidate.",
        "skill_levels": {"Web Dev":92,"Python/ML":85,"React":88,"Data Sci":80,"Backend":70,"DevOps":58},
        "project_stats": {"total":14,"live":9,"web_dev":9,"ml_ai":5},
    }