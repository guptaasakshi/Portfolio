// ===== GSAP PLUGINS =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('sg-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sg-theme', next);

    // Animate bg change
    gsap.to('.animated-bg', { duration: 1, ease: 'power2.inOut', opacity: 0.8, yoyo: true, repeat: 1 });
    ScrollTrigger.refresh();
});

// ===== SPARKLE CURSOR =====
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let particles = [];

function resizeCanvas() {
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#7c6af7', '#f7926a', '#6af7c4', '#ffffff', '#a78bfa', '#fbbf24'];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
    if (Math.random() > 0.55) spawnParticle(mouseX, mouseY);
});

function spawnParticle(x, y) {
    particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 2.8,
        vy: (Math.random() - 0.5) * 2.8 - 1.2,
        life: 1,
        decay: Math.random() * 0.045 + 0.02,
        size: Math.random() * 3.5 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isStar: Math.random() > 0.55
    });
}

function drawStar(cx, cy, r, c, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c;
    ctx.translate(cx, cy); ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const ang = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
}

function animateCursor() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }

    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            p.vy += 0.06; p.life -= p.decay;
            if (p.isStar) drawStar(p.x, p.y, p.size, p.color, p.life);
            else {
                ctx.save(); ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 6; ctx.shadowColor = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }
        }
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== MOBILE NAV =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('nav-links');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
}
menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    navOverlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
navOverlay.addEventListener('click', closeMenu);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('.nav-link, a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault(); closeMenu();
            const target = document.querySelector(href);
            if (target) gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 72 }, ease: 'power3.inOut' });
        }
    });
});

// ===== TYPING ANIMATION =====
const typingEl = document.querySelector('.typing-text');
const texts = ['Aspiring Web Developer', 'Data Science Intern', 'React & Python Enthusiast', 'ML Explorer', 'UI/UX Enthusiast'];
let tIdx = 0, cIdx = 0, deleting = false;
function typeNext() {
    const cur = texts[tIdx];
    if (!deleting) {
        typingEl.textContent = cur.slice(0, ++cIdx);
        if (cIdx === cur.length) { setTimeout(() => { deleting = true; }, 1800); setTimeout(typeNext, 2200); return; }
    } else {
        typingEl.textContent = cur.slice(0, --cIdx);
        if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; }
    }
    setTimeout(typeNext, deleting ? 48 : 78);
}
typeNext();

// ===== "HELLO" LETTER-BY-LETTER ANIMATION =====
window.addEventListener('load', () => {
    const helloEl = document.getElementById('helloText');
    if (!helloEl) return;
    const word = 'Hello,';
    helloEl.textContent = '';

    const tl = gsap.timeline({ delay: 0.3 });
    tl.from('.logo', { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' });
    tl.from('.nav-links li', { y: -20, opacity: 0, stagger: 0.05, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    tl.from('.home-tag', { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');

    // Hello letter-by-letter
    let idx = 0;
    function addLetter() {
        if (idx < word.length) {
            helloEl.textContent += word[idx];
            // Bounce each letter in
            const spans = helloEl.parentElement;
            gsap.from(helloEl, { y: 20, opacity: 0, duration: 0.08 + Math.random() * 0.04, ease: 'back.out(3)', overwrite: 'auto' });
            idx++;
            setTimeout(addLetter, 90);
        }
    }
    tl.call(() => addLetter(), null, '+=0');

    tl.from('.home-title .reveal-text', { y: '100%', opacity: 0, duration: 0.8, ease: 'power4.out' }, '+=0.5');
    tl.from('.home-sub', { y: 18, opacity: 0, duration: 0.5 }, '-=0.3');
    tl.from('.home-desc', { y: 18, opacity: 0, duration: 0.5 }, '-=0.3');
    tl.from('.home-cta .btn', { y: 16, opacity: 0, stagger: 0.1, duration: 0.45, ease: 'back.out(2)' }, '-=0.3');
    tl.from('.home-scroll-hint', { opacity: 0, duration: 0.4 }, '-=0.2');
    tl.from('.deco-circle', { scale: 0, opacity: 0, stagger: 0.2, duration: 1.2, ease: 'power2.out' }, '-=1.2');
    tl.from('.floating-code span', { x: 30, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.6');
});

// ===== BG COLOR CHANGE ON SCROLL =====
const bgDark = {
    home: 'radial-gradient(ellipse at 15% 20%, rgba(124,106,247,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(247,146,106,0.13) 0%, transparent 55%), linear-gradient(135deg, #050810, #0d0f1a)',
    about: 'radial-gradient(ellipse at 30% 65%, rgba(106,247,196,0.1) 0%, transparent 55%), radial-gradient(ellipse at 70% 25%, rgba(124,106,247,0.09) 0%, transparent 55%), linear-gradient(135deg, #060b12, #0a1020)',
    skills: 'radial-gradient(ellipse at 70% 20%, rgba(247,146,106,0.13) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(124,106,247,0.09) 0%, transparent 55%), linear-gradient(135deg, #0a0810, #140a1a)',
    education: 'radial-gradient(ellipse at 50% 30%, rgba(106,247,196,0.09) 0%, transparent 55%), linear-gradient(135deg, #060810, #0a1218)',
    projects: 'radial-gradient(ellipse at 30% 40%, rgba(124,106,247,0.14) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(247,146,106,0.09) 0%, transparent 55%), linear-gradient(135deg, #08060f, #0d0a1a)',
    certifications: 'radial-gradient(ellipse at 60% 35%, rgba(106,247,196,0.1) 0%, transparent 55%), linear-gradient(135deg, #080b0a, #0a1410)',
    contact: 'radial-gradient(ellipse at 40% 50%, rgba(124,106,247,0.11) 0%, transparent 55%), linear-gradient(135deg, #06080f, #0a0c1a)',
};
const bgLight = {
    home: 'radial-gradient(ellipse at 15% 20%, rgba(91,71,232,0.1) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(232,96,42,0.06) 0%, transparent 55%), linear-gradient(135deg, #f0eeff, #ede8ff)',
    about: 'radial-gradient(ellipse at 30% 60%, rgba(26,184,127,0.08) 0%, transparent 55%), linear-gradient(135deg, #f0f4ff, #eef6ff)',
    skills: 'radial-gradient(ellipse at 70% 20%, rgba(232,96,42,0.06) 0%, transparent 55%), linear-gradient(135deg, #f5eeff, #f0e8ff)',
    education: 'radial-gradient(ellipse at 50% 30%, rgba(26,184,127,0.07) 0%, transparent 55%), linear-gradient(135deg, #eef4ff, #e8f0ff)',
    projects: 'radial-gradient(ellipse at 30% 40%, rgba(91,71,232,0.08) 0%, transparent 55%), linear-gradient(135deg, #f2eeff, #ece6ff)',
    certifications: 'radial-gradient(ellipse at 60% 35%, rgba(26,184,127,0.07) 0%, transparent 55%), linear-gradient(135deg, #eef8f4, #e8f5ee)',
    contact: 'radial-gradient(ellipse at 40% 50%, rgba(91,71,232,0.08) 0%, transparent 55%), linear-gradient(135deg, #f0eeff, #eae6ff)',
};

document.querySelectorAll('section[data-bg]').forEach(sec => {
    ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%', end: 'bottom 40%',
        onEnter: () => changeBg(sec.dataset.bg),
        onEnterBack: () => changeBg(sec.dataset.bg),
    });
});
function changeBg(key) {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const bg = (isDark ? bgDark : bgLight)[key] || (isDark ? bgDark.home : bgLight.home);
    gsap.to('.animated-bg', { duration: 2.2, background: bg, ease: 'power2.inOut' });
}

// ===== SCROLL ANIMATIONS =====
// Helper for simple scroll reveal
function reveal(selector, from, trigger, stagger = 0) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(selector, { ...from, opacity: 0 }, {
        ...Object.fromEntries(Object.keys(from).map(k => [k, k === 'x' || k === 'y' || k === 'scale' ? (k === 'scale' ? 1 : 0) : from[k]])),
        opacity: 1,
        stagger,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: trigger || selector, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
}

// Section titles
gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
});
gsap.utils.toArray('.sec-accent-line').forEach(el => {
    gsap.fromTo(el, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'top', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
});

// About
ScrollTrigger.create({
    trigger: '#about', start: 'top 78%',
    onEnter: () => {
        gsap.fromTo('.about-avatar', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)' });
        gsap.fromTo('.stat-item', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.55, delay: 0.3, ease: 'back.out(2)' });
        gsap.fromTo('.resume-download-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.6, ease: 'back.out(2)' });
        gsap.fromTo('.about-para', { x: 50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.14, duration: 0.65, delay: 0.15, ease: 'power3.out' });
        gsap.fromTo('.about-tags span', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.07, duration: 0.38, delay: 0.55, ease: 'back.out(2)' });
    }
});

// Skills
ScrollTrigger.create({
    trigger: '#skills', start: 'top 78%',
    onEnter: () => {
        gsap.fromTo('.skill-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out' });
    }
});

// Education timeline
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }, delay: i * 0.1 });
});

// Certifications
ScrollTrigger.create({
    trigger: '#certifications', start: 'top 80%',
    onEnter: () => {
        gsap.fromTo('.cert-card', { y: 44, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out' });
    }
});

// Contact
ScrollTrigger.create({
    trigger: '#contact', start: 'top 80%',
    onEnter: () => {
        gsap.fromTo('.form-group', { y: 36, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.55, ease: 'power3.out' });
        gsap.fromTo('.send-btn', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.4, ease: 'back.out(2)' });
        gsap.fromTo('.contact-card', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out' });
        gsap.fromTo('.contact-resume-card', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, delay: 0.15, ease: 'power3.out' });
        gsap.fromTo('.social-btn', { x: 50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.09, duration: 0.5, delay: 0.25, ease: 'power3.out' });
    }
});

// ===== PROJECT CARDS ANIMATION =====
function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card:not(.hidden)');
    if (window.innerWidth <= 768) return; // mobile slider handles it
    cards.forEach((card, i) => {
        const col = i % 3;
        gsap.fromTo(card,
            { y: col === 1 ? 70 : 40, x: col === 0 ? -40 : col === 2 ? 40 : 0, opacity: 0, scale: 0.94 },
            {
                y: 0, x: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
                delay: (i % 3) * 0.08
            }
        );
    });
}
animateProjectCards();

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const allCards = document.querySelectorAll('.project-card');
        const toShow = [], toHide = [];
        allCards.forEach(c => (currentFilter === 'all' || c.dataset.category === currentFilter ? toShow : toHide).push(c));

        if (window.innerWidth <= 768) {
            allCards.forEach(c => c.classList.remove('slide-active'));
            toHide.forEach(c => { c.style.display = 'none'; c.classList.remove('slide-active'); });
            toShow.forEach(c => { c.style.display = ''; });
            currentSlide = 0;
            updateMobileSlider();
        } else {
            gsap.to(toHide, { opacity: 0, scale: 0.9, duration: 0.28, ease: 'power2.in', onComplete: () => toHide.forEach(c => c.classList.add('hidden')) });
            toShow.forEach(c => c.classList.remove('hidden'));
            gsap.fromTo(toShow, { opacity: 0, y: 24, scale: 0.93 }, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out', delay: 0.15 });
        }

        setTimeout(() => ScrollTrigger.refresh(), 350);
    });
});

// ===== MOBILE PROJECT SLIDER =====
let currentSlide = 0;
let visibleCards = [];

function getVisibleCards() {
    return Array.from(document.querySelectorAll('.project-card')).filter(c => {
        return currentFilter === 'all' || c.dataset.category === currentFilter;
    });
}

function updateMobileSlider() {
    if (window.innerWidth > 768) return;
    visibleCards = getVisibleCards();
    const dotsEl = document.getElementById('sliderDots');
    const total = visibleCards.length;

    // Reset all
    visibleCards.forEach((c, i) => {
        c.style.display = 'none';
        c.classList.remove('slide-active');
    });

    if (total === 0) return;
    currentSlide = Math.max(0, Math.min(currentSlide, total - 1));

    visibleCards[currentSlide].style.display = '';
    visibleCards[currentSlide].classList.add('slide-active');

    // Dots
    dotsEl.innerHTML = '';
    const maxDots = Math.min(total, 7);
    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => { currentSlide = i; updateMobileSlider(); });
        dotsEl.appendChild(dot);
    }
    if (total > 7) {
        const more = document.createElement('div');
        more.style.cssText = 'font-size:0.6rem;color:var(--text-muted);font-family:var(--font-mono);padding:0 4px;';
        more.textContent = `+${total - 7}`;
        dotsEl.appendChild(more);
    }
}

document.getElementById('sliderPrev')?.addEventListener('click', () => {
    visibleCards = getVisibleCards();
    currentSlide = (currentSlide - 1 + visibleCards.length) % visibleCards.length;
    updateMobileSlider();
});
document.getElementById('sliderNext')?.addEventListener('click', () => {
    visibleCards = getVisibleCards();
    currentSlide = (currentSlide + 1) % visibleCards.length;
    updateMobileSlider();
});

// Touch/swipe support for mobile slider
let touchStartX = 0;
document.getElementById('projectsGrid')?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.getElementById('projectsGrid')?.addEventListener('touchend', e => {
    if (window.innerWidth > 768) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
        visibleCards = getVisibleCards();
        currentSlide = diff > 0
            ? (currentSlide + 1) % visibleCards.length
            : (currentSlide - 1 + visibleCards.length) % visibleCards.length;
        updateMobileSlider();
    }
});

// ===== SKILL ACCORDION (mobile) =====
document.querySelectorAll('.skill-card').forEach(card => {
    const header = card.querySelector('.skill-card-header');
    header.addEventListener('click', () => {
        if (window.innerWidth > 768) return;
        const isOpen = card.classList.toggle('open');
        // Animate pills when opening
        if (isOpen) {
            const pills = card.querySelectorAll('.pill');
            gsap.fromTo(pills, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.04, duration: 0.3, ease: 'back.out(2)', delay: 0.2 });
        }
    });
});

// Desktop: all skill cards open
function initSkillCards() {
    if (window.innerWidth > 768) {
        document.querySelectorAll('.skill-card').forEach(c => c.classList.add('open'));
    } else {
        document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('open'));
    }
}
initSkillCards();

// ===== STAT COUNTER =====
let statsAnimated = false;
ScrollTrigger.create({
    trigger: '.about-stats', start: 'top 85%', once: true,
    onEnter: () => {
        if (statsAnimated) return;
        statsAnimated = true;
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isFloat = el.dataset.float === 'true';
            const suffix = el.dataset.suffix || '';
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target, duration: 1.6, ease: 'power2.out',
                onUpdate() { el.textContent = isFloat ? obj.val.toFixed(2) + suffix : Math.floor(obj.val) + suffix; },
                onComplete() { el.textContent = (isFloat ? target.toFixed(2) : target) + suffix; }
            });
        });
    }
});

// ===== ACTIVE NAV =====
const navItems = document.querySelectorAll('.nav-link');
document.querySelectorAll('section[data-bg]').forEach((sec, i) => {
    ScrollTrigger.create({
        trigger: sec, start: 'top 60%', end: 'bottom 40%',
        onEnter: () => setActiveNav(i),
        onEnterBack: () => setActiveNav(i),
    });
});
function setActiveNav(idx) {
    navItems.forEach(l => l.classList.remove('active'));
    if (navItems[idx]) navItems[idx].classList.add('active');
}

// ===== NAVBAR SCROLL =====
ScrollTrigger.create({
    start: 80,
    onEnter: () => { document.getElementById('navbar').style.background = html.dataset.theme === 'dark' ? 'rgba(5,8,16,0.96)' : 'rgba(245,244,255,0.97)'; },
    onLeaveBack: () => { document.getElementById('navbar').style.background = ''; }
});

// ===== CONTACT FORM =====
document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.send-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
    btn.style.background = 'var(--accent3)';
    btn.style.color = '#000';
    gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; e.target.reset(); }, 3000);
});

// ===== PARALLAX DECO =====
gsap.to('.c1', { y: -90, scrollTrigger: { trigger: '.home', scrub: 1.5 } });
gsap.to('.c2', { y: -55, scrollTrigger: { trigger: '.home', scrub: 1 } });

// ===== MAGNETIC BTN =====
document.querySelectorAll('.btn, .social-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.18;
        gsap.to(el, { x, y, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }));
});

// ===== RESIZE =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initSkillCards();
        if (window.innerWidth <= 768) updateMobileSlider();
        else {
            document.querySelectorAll('.project-card').forEach(c => { c.style.display = ''; c.classList.remove('slide-active', 'hidden'); });
        }
        ScrollTrigger.refresh();
    }, 200);
});

// Init mobile slider on load if needed
if (window.innerWidth <= 768) {
    setTimeout(updateMobileSlider, 300);
}