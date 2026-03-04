/* ════════════════════════════════════════════
   FRANCIS MUJAKACHI — PORTFOLIO
   script.js
   ════════════════════════════════════════════ */

'use strict';

/* ── Custom Cursor ─────────────────────────── */
const cursor       = document.querySelector('.cursor');
const cursorFollow = document.querySelector('.cursor-follower');

if (cursor && cursorFollow) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    cursorFollow.style.left = fx + 'px';
    cursorFollow.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();
}

/* ── Header scroll ─────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile nav ────────────────────────────── */
const menuIcon = document.getElementById('menu-icon');
const navbar   = document.querySelector('.navbar');

// Inject mobile overlay
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.appendChild(overlay);

function toggleNav(open) {
  navbar.classList.toggle('active', open);
  overlay.classList.toggle('active', open);
  menuIcon.className = open ? 'bx bx-x' : 'bx bx-menu';
  document.body.style.overflow = open ? 'hidden' : '';
}

menuIcon.addEventListener('click', () => toggleNav(!navbar.classList.contains('active')));
overlay.addEventListener('click', () => toggleNav(false));
navbar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleNav(false)));

/* ── Active nav on scroll ──────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('header nav a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`header nav a[href="#${sec.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ── Parallax on home section ──────────────── */
const parallaxBg = document.querySelector('.parallax-bg');
if (parallaxBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
}

/* ── AOS-like scroll reveal ────────────────── */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const delays = { '0': 0, '100': 100, '200': 200, '300': 300 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = delays[el.dataset.aosDelay] || 0;
        setTimeout(() => el.classList.add('aos-active'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* ── Footer year ───────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Contact form ──────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate submission delay (replace with real fetch/EmailJS/Formspree)
    await new Promise(r => setTimeout(r, 1500));

    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formStatus.style.color = 'var(--accent)';
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = 'Send Message <i class="bx bx-send"></i>';

    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  });
}

/* ════════════════════════════════════════════
   AI CHAT WIDGET
   Primary:  Pollinations AI GET endpoint (no key, no CORS)
   Fallback: Local keyword-based answers
   ════════════════════════════════════════════ */

const aiToggle   = document.getElementById('ai-toggle');
const aiChat     = document.getElementById('ai-chat');
const aiClose    = document.getElementById('ai-close');
const aiMessages = document.getElementById('ai-messages');
const aiInput    = document.getElementById('ai-input');
const aiSend     = document.getElementById('ai-send');

/* ── Francis knowledge base (used by local fallback) ── */
const FRANCIS = {
  name:    'Francis Mujakachi',
  email:   'fmujakachi@gmail.com',
  phone:   '+27 64 858 4297',
  github:  'https://github.com/FraMukachi/',
  fb:      'https://facebook.com/fmujakachi/',
  li:      'https://linkedin.com/',
  skills:  'UI/UX Design, Frontend Development (HTML, CSS, JS, React), Backend Development (Node.js, Python, REST APIs, AWS, Azure, Google Cloud), and Software Testing (Jest, Cypress).',
  edu: [
    '2008 — High School at Mid-Manhattan Education Center',
    '2015 — University at Katolicki Uniwersytet Lubelski',
    '2025 — FullStack Software Development at Power Learn Project',
    '2025 — Cybersecurity Certificate via Coursera & Nemisa'
  ],
  projects: [
    'E-Commerce Store — urban wear shop built with HTML/CSS/JS (PLP final project)',
    'Portfolio V1 — his first personal portfolio site',
    'Career AI — AI-powered career guidance platform for job matching and resume building'
  ]
};

/* ── System context string sent to AI ── */
const CONTEXT = `You are a helpful assistant on Francis Mujakachi's portfolio website. Answer ONLY questions about Francis using these facts:
Name: ${FRANCIS.name} | Email: ${FRANCIS.email} | Phone: ${FRANCIS.phone}
GitHub: ${FRANCIS.github} | LinkedIn: ${FRANCIS.li}
Skills: ${FRANCIS.skills}
Education: ${FRANCIS.edu.join('; ')}
Projects: ${FRANCIS.projects.join('; ')}
Hire/contact: use the contact form, email ${FRANCIS.email}, or call ${FRANCIS.phone}.
Rules: Be concise (2-4 sentences), friendly, professional. Never invent facts. For unrelated questions say you can only discuss Francis.`;

/* ── Local keyword fallback ── */
function localAnswer(q) {
  const t = q.toLowerCase();
  if (/email|mail|gmail/.test(t))           return `Francis's email is **${FRANCIS.email}** — feel free to reach out directly!`;
  if (/phone|call|whatsapp|number/.test(t)) return `You can call or WhatsApp Francis at **${FRANCIS.phone}**.`;
  if (/hire|work|freelance|available/.test(t)) return `Yes! Francis is available for freelance, collaboration, and full-time roles. Fill in the contact form above, email ${FRANCIS.email}, or call ${FRANCIS.phone}.`;
  if (/skill|know|tech|stack|language/.test(t)) return `Francis's skills include: ${FRANCIS.skills}`;
  if (/project|portfolio|built|made/.test(t))   return `Francis has built: ${FRANCIS.projects.join(' | ')}`;
  if (/career.?ai|carerai/.test(t))             return `Career AI is Francis's AI-powered career guidance platform that helps users with job matching, resume building, and career decisions.`;
  if (/educat|school|study|degree|univer/.test(t)) return `Francis's education: ${FRANCIS.edu.join(' · ')}`;
  if (/github|code|repo/.test(t))               return `Francis's GitHub is ${FRANCIS.github}`;
  if (/name|who/.test(t))                       return `His name is Francis Mujakachi — a Web Developer & Software Engineer based in South Africa.`;
  if (/contact|reach|find/.test(t))             return `You can contact Francis via the form on this page, by email at ${FRANCIS.email}, or by phone at ${FRANCIS.phone}.`;
  return null; // No local match — try AI
}

/* ── DOM helpers ── */
function appendMessage(role, html) {
  const wrapper = document.createElement('div');
  wrapper.className = `ai-msg ai-msg--${role === 'user' ? 'user' : 'bot'}`;
  const p = document.createElement('p');
  // Render basic **bold** markdown
  p.innerHTML = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  wrapper.appendChild(p);
  aiMessages.appendChild(wrapper);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return wrapper;
}

function appendTyping() {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-msg ai-msg--bot';
  wrapper.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
  aiMessages.appendChild(wrapper);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return wrapper;
}

/* ── AI fetch via Pollinations GET (no CORS, no key) ── */
async function fetchAI(userQuestion) {
  // Full prompt = context + question, URL-encoded
  const prompt = encodeURIComponent(
    CONTEXT + '\n\nUser question: ' + userQuestion + '\n\nAnswer concisely in 2-3 sentences:'
  );
  const url = `https://text.pollinations.ai/${prompt}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text.trim() || null;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

/* ── Main send handler ── */
async function sendMessage(text) {
  text = text.trim();
  if (!text) return;

  // Remove suggestion buttons on first message
  const suggestions = aiMessages.querySelector('.ai-suggestions');
  if (suggestions) suggestions.remove();

  appendMessage('user', text);
  aiInput.value = '';
  aiInput.disabled = true;
  aiSend.disabled  = true;

  // 1. Try local keyword match first (instant)
  const local = localAnswer(text);
  if (local) {
    // Small delay to feel natural
    const typingEl = appendTyping();
    await new Promise(r => setTimeout(r, 600));
    typingEl.remove();
    appendMessage('bot', local);
    aiInput.disabled = false;
    aiSend.disabled  = false;
    aiInput.focus();
    return;
  }

  // 2. Try Pollinations AI
  const typingEl = appendTyping();
  try {
    const reply = await fetchAI(text);
    typingEl.remove();
    if (reply) {
      appendMessage('bot', reply);
    } else {
      throw new Error('Empty response');
    }
  } catch (err) {
    typingEl.remove();
    console.warn('AI fetch failed, using smart fallback:', err.message);
    // 3. Generic smart fallback
    appendMessage('bot',
      `I couldn't reach the AI right now, but I can tell you: Francis is a Web Developer & Software Engineer. ` +
      `You can contact him at **${FRANCIS.email}** or **${FRANCIS.phone}**. ` +
      `Ask me about his skills, projects, or education and I'll answer instantly!`
    );
  }

  aiInput.disabled = false;
  aiSend.disabled  = false;
  aiInput.focus();
}

/* ── Widget toggle ── */
aiToggle.addEventListener('click', () => {
  const isOpen = aiChat.classList.toggle('open');
  if (isOpen) setTimeout(() => aiInput.focus(), 300);
});
aiClose.addEventListener('click', () => aiChat.classList.remove('open'));

/* ── Send triggers ── */
aiSend.addEventListener('click', () => sendMessage(aiInput.value));
aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(aiInput.value);
  }
});

/* ── Suggestion chips ── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('ai-suggest')) {
    sendMessage(e.target.dataset.q);
  }
});
