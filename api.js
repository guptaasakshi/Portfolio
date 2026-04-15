// ============================================================
// api.js — Sakshi Portfolio · Frontend API Layer
// Backend: FastAPI at localhost:8000
// Routes:  POST /api/chat  |  POST /api/analyze  |  GET /health
// ============================================================

const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://your-backend-url.com',   // ← production URL yahan replace karo
    TIMEOUT_MS: 30000,
};

// ─── Generic fetch with timeout ──────────────────────────────────
async function apiFetch(endpoint, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        });
        clearTimeout(timer);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
            throw new Error(err.detail || `HTTP ${res.status}`);
        }
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') throw new Error('Request timed out. Is backend running?');
        throw err;
    }
}

// ─── CHATBOT API ─────────────────────────────────────────────────
// Backend route: POST /api/chat  (main.py mein /api prefix set hai)
const ChatAPI = {
    async sendMessage(message, history = []) {
        return apiFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message, history }),
        });
    },
};

// ─── ANALYZER API ────────────────────────────────────────────────
// Backend route: POST /api/analyze
const AnalyzerAPI = {
    async analyze() {
        const portfolioData = {
            name: 'Sakshi Gupta',
            cgpa: 8.82,
            degree: 'B.Tech CSE',
            college: 'Shobhit Institute of Engineering & Technology',
            year: 2,
            projects: [
                { name: 'ArtifyX', type: 'AI/ML', tech: ['Python', 'Streamlit', 'TensorFlow'], live: true },
                { name: 'Skylytics', type: 'Data Science', tech: ['R', 'ARIMA', 'Shiny'], live: false },
                { name: 'AeroSense', type: 'ML/Analytics', tech: ['Python', 'ML', 'Dashboard'], live: false },
                { name: 'ToneCanvas', type: 'GenAI', tech: ['Python', 'GenAI', 'API'], live: false },
                { name: 'Eco Vision Predictor', type: 'LSTM/GEE', tech: ['Python', 'LSTM', 'GEE'], live: false },
                { name: 'Student Registration Form', type: 'Web', tech: ['PHP', 'MySQL', 'CSS'], live: true },
                { name: 'Multiples Games', type: 'Web', tech: ['JavaScript', 'HTML', 'CSS'], live: true },
                { name: 'AI Chatbot', type: 'AI/Web', tech: ['Next.js', 'OpenAI', 'React'], live: true },
                { name: 'Calculator App', type: 'React', tech: ['React', 'JavaScript'], live: true },
                { name: 'StarPop Adventure', type: 'Game', tech: ['JavaScript', 'Canvas'], live: true },
                { name: 'Weather App', type: 'API', tech: ['JavaScript', 'API'], live: false },
                { name: 'To-Do App', type: 'React', tech: ['React', 'LocalStorage'], live: true },
                { name: 'Animated Landing Page', type: 'GSAP', tech: ['GSAP', 'HTML', 'JS'], live: true },
                { name: 'Advanced Music Player', type: 'PHP', tech: ['PHP', 'MySQL'], live: false },
            ],
            skills: {
                frontend: ['HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'JavaScript', 'React.js', 'React Native'],
                backend: ['Node.js', 'PHP'],
                datascience: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'R'],
                languages: ['Python', 'R', 'Java', 'C', 'C++', 'JavaScript'],
                databases: ['MySQL', 'MongoDB'],
                tools: ['Git', 'GitHub', 'VS Code', 'Jupyter'],
            },
            certifications: [
                'Full Stack Web Development (Coursera)',
                'Data Science Specialization (Coursera)',
                'Google Analytics Certification (Google)',
                'React JS Advanced (Udemy)',
            ],
            github: 'github.com/guptaasakshi',
            linkedin: 'linkedin.com/in/sakshi-gupta-31a476291',
        };

        const result = await apiFetch('/api/analyze', {
            method: 'POST',
            body: JSON.stringify(portfolioData),
        });

        // Backend returns { success: true, data: {...} }
        return result.data || result;
    },
};

// ─── Health Check ────────────────────────────────────────────────
// Backend route: GET /health  (NO /api prefix — direct route)
const HealthAPI = {
    async ping() {
        try {
            const data = await apiFetch('/health');
            return data.status === 'ok';
        } catch {
            return false;
        }
    }
};

window.ChatAPI = ChatAPI;
window.AnalyzerAPI = AnalyzerAPI;
window.HealthAPI = HealthAPI;
window.API_CONFIG = API_CONFIG;