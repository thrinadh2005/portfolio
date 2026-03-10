
// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const voiceToggle = document.getElementById('voiceToggle');
const body = document.body;
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');

// Theme Logic
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light') {
    body.classList.add('light');
    updateThemeIcon(true);
  } else if (savedTheme === 'dark') {
    body.classList.remove('light');
    updateThemeIcon(false);
  } else {
    // Default to dark mode if no preference
    if (!prefersDark) {
      body.classList.add('light');
      updateThemeIcon(true);
    } else {
      updateThemeIcon(false);
    }
  }
}

function updateThemeIcon(isLight) {
  const icon = themeToggle.querySelector('i');
  if (isLight) {
    icon.className = 'bi bi-sun-fill';
  } else {
    icon.className = 'bi bi-moon-stars-fill';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });
}

// Modal Logic
function openModal(src) {
  if (modal && modalImg) {
    modal.style.display = "block";
    modalImg.src = src;
    body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none";
    body.style.overflow = '';
  }
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Scroll Animation (Intersection Observer)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');

      // If the target has children with .reveal class, stagger them
      const reveals = entry.target.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('show');
        }, i * 150);
      });

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const homeHeader = document.querySelector('header');
if (homeHeader) observer.observe(homeHeader);

sections.forEach(section => {
  observer.observe(section);
});

// Active Link Highlighting
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  // Handle Home independently if at very top
  if (pageYOffset < 100) current = 'home';

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });

  // Navbar shrinkage
  if (window.scrollY > 50) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 400);
      }
    });
  });
});

// Tilt Effect for Cards
function initTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card, .profile-img-wrapper img');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const status = document.getElementById('formStatus');

    // Simple mailto trigger
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
    window.location.href = `mailto:thrinadh2005@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = "Opening your email client...";
    status.style.color = "var(--accent)";
    setTimeout(() => {
      status.textContent = "";
      contactForm.reset();
    }, 3000);
  });
}

function initVoiceControl() {
  const btn = document.getElementById('voiceToggle');
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!btn || !Recognition) {
    if (btn) btn.style.display = 'none';
    return;
  }
  const recognition = new Recognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  let active = false;
  const synth = window.speechSynthesis;
  let tts = true;
  try {
    const saved = localStorage.getItem('voice_tts');
    if (saved !== null) tts = JSON.parse(saved);
  } catch (e) {}
  function speak(text) {
    if (!tts || !synth || !text) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      synth.cancel();
      synth.speak(u);
    } catch (e) {}
  }
  function setActive(on) {
    active = on;
    const icon = btn.querySelector('i');
    if (icon) icon.className = on ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill';
    btn.classList.toggle('active', on);
  }
  function smoothScrollTo(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openSocial(label) {
    const link = document.querySelector(`.social-links a[aria-label="${label}"]`);
    if (link) link.click();
  }
  function setTheme(mode) {
    const isLight = mode === 'light';
    if (isLight && !body.classList.contains('light')) themeToggle.click();
    if (!isLight && body.classList.contains('light')) themeToggle.click();
  }
  function filterProjects(kind) {
    const btn = document.querySelector(`.filter-btn[data-filter="${kind}"]`);
    if (btn) btn.click();
  }
  function norm(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[^a-z0-9]/g, '');
  }
  function getProjectMap() {
    const map = {};
    document.querySelectorAll('#portfolio .project-card').forEach(card => {
      const t = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
      const a = card.querySelector('.ext-link');
      const href = a ? a.getAttribute('href') : '';
      if (t && href) map[norm(t)] = href;
    });
    return map;
  }
  function openProjectByName(name) {
    const projects = getProjectMap();
    const key = norm(name);
    if (projects[key]) {
      window.open(projects[key], '_blank', 'noopener,noreferrer');
      speak('Opening ' + name);
      return true;
    }
    const keys = Object.keys(projects);
    const match = keys.find(k => key && k.includes(key));
    if (match) {
      window.open(projects[match], '_blank', 'noopener,noreferrer');
      speak('Opening ' + name);
      return true;
    }
    return false;
  }
  function readSection(id) {
    const el = document.querySelector(id);
    if (!el) return;
    const text = el.innerText || '';
    speak(text.slice(0, 400));
  }
  function handleVoiceCommand(cmd) {
    const c = cmd.toLowerCase();
    const secMatch = c.match(/(go to|navigate to|open|show) (home|about|skills|education|certifications|projects|portfolio|experience|achievements|contact)/);
    if (secMatch) {
      const map = { home: '#home', about: '#about', skills: '#skills', education: '#education', certifications: '#certifications', projects: '#portfolio', portfolio: '#portfolio', experience: '#achievements', achievements: '#achievements', contact: '#contact' };
      smoothScrollTo(map[secMatch[2]]);
      speak('Opening ' + secMatch[2]);
      return;
    }
    if (c.includes('scroll down')) {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      speak('Scrolling down');
      return;
    }
    if (c.includes('scroll up')) {
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
      speak('Scrolling up');
      return;
    }
    if (c.includes('top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      speak('Top of page');
      return;
    }
    if (c.includes('bottom')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      speak('Bottom of page');
      return;
    }
    if (c.includes('toggle theme') || c.includes('switch theme') || c.includes('change theme')) {
      themeToggle.click();
      speak('Toggled theme');
      return;
    }
    if (c.includes('dark mode')) {
      setTheme('dark');
      speak('Dark mode');
      return;
    }
    if (c.includes('light mode')) {
      setTheme('light');
      speak('Light mode');
      return;
    }
    if (c.includes('open github')) {
      openSocial('GitHub');
      speak('Opening GitHub');
      return;
    }
    if (c.includes('open linkedin')) {
      openSocial('LinkedIn');
      speak('Opening LinkedIn');
      return;
    }
    if (c.includes('open codechef')) {
      openSocial('CodeChef');
      speak('Opening CodeChef');
      return;
    }
    if (c.includes('open hackerrank')) {
      openSocial('HackerRank');
      speak('Opening HackerRank');
      return;
    }
    if (c.includes('open instagram')) {
      openSocial('Instagram');
      speak('Opening Instagram');
      return;
    }
    if (c.includes('open whatsapp')) {
      openSocial('WhatsApp');
      speak('Opening WhatsApp');
      return;
    }
    if (c.includes('open resume') || c.includes('download resume')) {
      const link = document.querySelector('a[href="RESUME.docx"]');
      if (link) link.click();
      speak('Opening resume');
      return;
    }
    if (c.includes('open image') || c.includes('open photo') || c.includes('show photo') || c.includes('show image')) {
      openModal && openModal('mypic.jpg');
      speak('Opening image');
      return;
    }
    if (c.includes('close image') || c.includes('close photo') || c.includes('close')) {
      closeModal && closeModal();
      speak('Closed');
      return;
    }
    const projMatch = c.match(/(filter|show) (all|web|security|research)/);
    if (projMatch) {
      const kind = projMatch[2] === 'all' ? 'all' : projMatch[2];
      filterProjects(kind);
      speak('Showing ' + kind + ' projects');
      return;
    }
    const openMatch = c.match(/(open|launch) (project )?(.+)/);
    if (openMatch) {
      const name = openMatch[3].trim();
      const ok = openProjectByName(name);
      if (!ok) speak('Could not find project ' + name);
      return;
    }
    if (c.includes('read section') || c.includes('read this section')) {
      const current = [...sections].find(s => {
        const rect = s.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight / 2;
      });
      if (current) readSection('#' + current.id);
      return;
    }
    if (c.includes('help') || c.includes('what can you do')) {
      speak('You can navigate sections, scroll, change theme, open social links, open projects by name, filter projects, open resume, and read sections. Say, open project Dictionary.');
      return;
    }
    if (c.includes('command palette') || c.includes('search')) {
      if (window.openCommandPalette) window.openCommandPalette();
      return;
    }
    if (c.includes('mute voice') || c.includes('voice off')) {
      tts = false;
      localStorage.setItem('voice_tts', 'false');
      return;
    }
    if (c.includes('unmute voice') || c.includes('voice on')) {
      tts = true;
      localStorage.setItem('voice_tts', 'true');
      speak('Voice enabled');
      return;
    }
  }
  btn.addEventListener('click', () => {
    if (!active) {
      try {
        recognition.start();
        setActive(true);
        speak('Listening');
      } catch (e) {}
    } else {
      try {
        speak('Stopping');
        recognition.stop();
      } finally {
        setActive(false);
      }
    }
  });
  recognition.addEventListener('result', e => {
    const r = e.results[e.results.length - 1][0].transcript.trim();
    handleVoiceCommand(r);
  });
  recognition.addEventListener('end', () => {
    if (active) {
      try {
        recognition.start();
      } catch (e) {}
    }
  });
}

function initCommandPalette() {
  const overlay = document.getElementById('cmdkOverlay');
  const input = document.getElementById('cmdkInput');
  const list = document.getElementById('cmdkList');
  if (!overlay || !input || !list) return;
  let items = [];
  let filtered = [];
  let index = 0;
  function build() {
    const arr = [];
    navLinks.forEach(a => {
      const t = a.textContent.trim();
      const href = a.getAttribute('href');
      arr.push({ label: t, group: 'Go to', run: () => { const id = href; const el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    });
    document.querySelectorAll('#portfolio .project-card').forEach(card => {
      const t = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
      const a = card.querySelector('.ext-link');
      const href = a ? a.getAttribute('href') : '';
      if (t && href) arr.push({ label: 'Open ' + t, group: 'Projects', run: () => { window.open(href, '_blank', 'noopener,noreferrer'); } });
    });
    const soc = [['GitHub', 'GitHub'], ['LinkedIn', 'LinkedIn'], ['CodeChef', 'CodeChef'], ['HackerRank', 'HackerRank'], ['Instagram', 'Instagram'], ['WhatsApp', 'WhatsApp']];
    soc.forEach(s => arr.push({ label: 'Open ' + s[0], group: 'Social', run: () => { const link = document.querySelector(`.social-links a[aria-label="${s[1]}"]`); if (link) link.click(); } }));
    [['Toggle theme', () => themeToggle.click()], ['Dark mode', () => { if (body.classList.contains('light')) themeToggle.click(); }], ['Light mode', () => { if (!body.classList.contains('light')) themeToggle.click(); }], ['Open Resume', () => { const l = document.querySelector('a[href="RESUME.docx"]'); if (l) l.click(); }], ['Filter All', () => { const b = document.querySelector(`.filter-btn[data-filter="all"]`); if (b) b.click(); }], ['Filter Web', () => { const b = document.querySelector(`.filter-btn[data-filter="web"]`); if (b) b.click(); }], ['Filter Security', () => { const b = document.querySelector(`.filter-btn[data-filter="security"]`); if (b) b.click(); }], ['Filter Research', () => { const b = document.querySelector(`.filter-btn[data-filter="research"]`); if (b) b.click(); }]].forEach(p => arr.push({ label: p[0], group: 'Actions', run: p[1] }));
    items = arr;
  }
  function show() {
    build();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    filter('');
    setTimeout(() => input.focus(), 0);
  }
  function hide() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }
  function filter(q) {
    const s = q.trim().toLowerCase();
    filtered = !s ? items : items.filter(i => i.label.toLowerCase().includes(s));
    render();
  }
  function render() {
    index = 0;
    list.innerHTML = '';
    filtered.forEach((it, i) => {
      const d = document.createElement('div');
      d.className = 'cmdk-item' + (i === index ? ' active' : '');
      d.setAttribute('data-idx', String(i));
      d.textContent = it.label;
      d.addEventListener('mouseenter', () => { setActive(i); });
      d.addEventListener('click', () => { run(i); });
      list.appendChild(d);
    });
  }
  function setActive(i) {
    index = Math.max(0, Math.min(i, filtered.length - 1));
    list.querySelectorAll('.cmdk-item').forEach((el, idx) => {
      if (idx === index) el.classList.add('active'); else el.classList.remove('active');
    });
  }
  function run(i) {
    const it = filtered[i];
    if (it && it.run) it.run();
    hide();
  }
  input.addEventListener('input', e => filter(input.value));
  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('show')) hide(); else show();
    }
    if (overlay.classList.contains('show')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        hide();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(index + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(index - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        run(index);
      }
    }
  });
  window.openCommandPalette = show;
  window.closeCommandPalette = hide;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Only init tilt on desktop
  if (window.matchMedia("(min-width: 768px)").matches) {
    initTilt();
  }
  document.getElementById('year').textContent = new Date().getFullYear();

  // Typed.js
  if (document.getElementById('typed')) {
    new Typed('#typed', {
      strings: ['Computer Science Student', 'Cybersecurity Enthusiast', 'Web Developer', 'Problem Solver'],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });
  }
  initVoiceControl();
  initCommandPalette();
});
