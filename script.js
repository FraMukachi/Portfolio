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
   AI CHAT WIDGET — Powered by Claude via
   Anthropic API (calls go through artifact proxy)
   ════════════════════════════════════════════ */

const aiToggle   = document.getElementById('ai-toggle');
const aiChat     = document.getElementById('ai-chat');
const aiClose    = document.getElementById('ai-close');
const aiMessages = document.getElementById('ai-messages');
const aiInput    = document.getElementById('ai-input');
const aiSend     = document.getElementById('ai-send');

// System prompt — all facts about Francis
const SYSTEM_PROMPT = `You are a friendly, concise AI assistant embedded on Francis Mujakachi's personal portfolio website.
Your ONLY job is to answer questions about Francis Mujakachi based on the following facts:

NAME: Francis Mujakachi
EMAIL: fmujakachi@gmail.com
PHONE: +27 64 858 4297
SOCIAL:
  - GitHub: https://github.com/FraMukachi/
  - Facebook: https://facebook.com/fmujakachi/
  - LinkedIn: https://linkedin.com/

EDUCATION:
  - 2008: High School — Mid-Manhattan Education Center
  - 2015: University — Katolicki Uniwersytet Lubelski
  - 2025: FullStack Software Development — Power Learn Project
  - 2025: Cybersecurity Certificate — Coursera & Nemisa

SKILLS & SERVICES:
  - UI/UX Design (Figma, prototyping, user-centered design)
  - Frontend Development (HTML, CSS, JavaScript, React, SPAs, responsive design)
  - Backend Development (Node.js, Python, REST APIs, AWS, Azure, Google Cloud)
  - Software Testing (unit, integration, end-to-end, Jest, Cypress, automated pipelines)

PROJECTS:
  1. E-Commerce Store — Urban wear single-vendor shop using HTML/CSS/JavaScript. Final project for Web Development class at PLP.
     URL: https://plp-webtechnologies.github.io/feb-2025-final-project-and-deployment-FraMukachi/index.html
  2. Portfolio V1 — His first personal portfolio.
     URL: https://francismujakachi.github.io/portfolio/
  3. Career AI — An intelligent AI-powered career guidance platform helping users with career decisions, resume building, and job matching.

HOW TO HIRE / WORK WITH FRANCIS:
  - Fill in the contact form on the portfolio page
  - Email him at fmujakachi@gmail.com
  - Call/WhatsApp +27 64 858 4297

PERSONALITY & APPROACH:
  - Human-centered design philosophy
  - Clean, maintainable, modular code
  - Strong focus on performance and user experience
  - Available for freelance projects, collaborations, and full-time opportunities

RULES:
  - Only answer questions about Francis. Politely decline anything unrelated.
  - Keep answers concise (2–4 sentences max unless a list is needed).
  - Be warm, professional, and conversational.
  - Never invent facts not listed above.
  - If unsure, say "I'm not sure about that — you can reach Francis directly at fmujakachi@gmail.com".`;

let conversationHistory = [];

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `ai-msg ai-msg--${role === 'user' ? 'user' : 'bot'}`;
  const p = document.createElement('p');
  p.textContent = text;
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

async function sendMessage(text) {
  if (!text.trim()) return;

  // Hide suggestions on first real message
  const suggestions = aiMessages.querySelector('.ai-suggestions');
  if (suggestions) suggestions.remove();

  appendMessage('user', text);
  aiInput.value = '';
  aiInput.disabled = true;
  aiSend.disabled = true;

  conversationHistory.push({ role: 'user', content: text });

  const typingEl = appendTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, I couldn\'t get a response.';

    typingEl.remove();
    appendMessage('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    appendMessage('bot', 'Hmm, something went wrong. Please try again or contact Francis directly at fmujakachi@gmail.com.');
    console.error('AI chat error:', err);
  }

  aiInput.disabled = false;
  aiSend.disabled = false;
  aiInput.focus();
}

// Toggle chat open/close
aiToggle.addEventListener('click', () => {
  aiChat.classList.toggle('open');
  if (aiChat.classList.contains('open')) {
    setTimeout(() => aiInput.focus(), 300);
  }
});
aiClose.addEventListener('click', () => aiChat.classList.remove('open'));

// Send on button click
aiSend.addEventListener('click', () => sendMessage(aiInput.value));

// Send on Enter
aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(aiInput.value);
  }
});

// Quick suggestion buttons
document.addEventListener('click', e => {
  if (e.target.classList.contains('ai-suggest')) {
    sendMessage(e.target.dataset.q);
  }
});
