// =============================================
// api.js — Sakshi Portfolio · Frontend API Layer
// =============================================

const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://your-backend-url.com',
    TIMEOUT_MS: 30000,
};

// ─── Generic fetch wrapper ───────────────────────
async function apiFetch(endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(err.detail || `HTTP ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
        throw err;
    }
}

// ─── CHATBOT API ───────────────────────────────
const ChatAPI = {
    async sendMessage(message, history = []) {
        return apiFetch('/api/chat', {   // ✅ FIXED
            method: 'POST',
            body: JSON.stringify({ message, history }),
        });
    },

    async streamMessage(message, history = [], onChunk) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/chat/stream`, { // ✅ FIXED
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        });

        if (!res.ok || !res.body) throw new Error('Streaming not available');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });

            chunk.split('\n').forEach(line => {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.text) onChunk(data.text);
                    } catch { }
                }
            });
        }
    },
};

// ─── ANALYZER API ──────────────────────────────
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

        return apiFetch('/api/analyze', {   // ✅ FIXED
            method: 'POST',
            body: JSON.stringify(portfolioData),
        });
    },

    async skillGap(targetRole) {
        return apiFetch('/api/analyze/skill-gap', {  // ✅ FIXED
            method: 'POST',
            body: JSON.stringify({ target_role: targetRole }),
        });
    },
};

// ─── Health check ──────────────────────────────
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

// Export
window.ChatAPI = ChatAPI;
window.AnalyzerAPI = AnalyzerAPI;
window.HealthAPI = HealthAPI;
window.API_CONFIG = API_CONFIG;