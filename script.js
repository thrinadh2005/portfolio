
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
  function handleVoiceCommand(cmd) {
    const c = cmd.toLowerCase();
    const secMatch = c.match(/(go to|navigate to|open|show) (home|about|skills|education|certifications|projects|portfolio|experience|achievements|contact)/);
    if (secMatch) {
      const map = { home: '#home', about: '#about', skills: '#skills', education: '#education', certifications: '#certifications', projects: '#portfolio', portfolio: '#portfolio', experience: '#achievements', achievements: '#achievements', contact: '#contact' };
      smoothScrollTo(map[secMatch[2]]);
      return;
    }
    if (c.includes('scroll down')) {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      return;
    }
    if (c.includes('scroll up')) {
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
      return;
    }
    if (c.includes('top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (c.includes('bottom')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    if (c.includes('toggle theme') || c.includes('switch theme') || c.includes('change theme')) {
      themeToggle.click();
      return;
    }
    if (c.includes('dark mode')) {
      setTheme('dark');
      return;
    }
    if (c.includes('light mode')) {
      setTheme('light');
      return;
    }
    if (c.includes('open github')) {
      openSocial('GitHub');
      return;
    }
    if (c.includes('open linkedin')) {
      openSocial('LinkedIn');
      return;
    }
    if (c.includes('open codechef')) {
      openSocial('CodeChef');
      return;
    }
    if (c.includes('open hackerrank')) {
      openSocial('HackerRank');
      return;
    }
    if (c.includes('open instagram')) {
      openSocial('Instagram');
      return;
    }
    if (c.includes('open whatsapp')) {
      openSocial('WhatsApp');
      return;
    }
    if (c.includes('open resume') || c.includes('download resume')) {
      const link = document.querySelector('a[href="RESUME.docx"]');
      if (link) link.click();
      return;
    }
    if (c.includes('open image') || c.includes('open photo') || c.includes('show photo') || c.includes('show image')) {
      openModal && openModal('mypic.jpg');
      return;
    }
    if (c.includes('close image') || c.includes('close photo') || c.includes('close')) {
      closeModal && closeModal();
      return;
    }
    const projMatch = c.match(/(filter|show) (all|web|security|research)/);
    if (projMatch) {
      const kind = projMatch[2] === 'all' ? 'all' : projMatch[2];
      filterProjects(kind);
      return;
    }
  }
  btn.addEventListener('click', () => {
    if (!active) {
      try {
        recognition.start();
        setActive(true);
      } catch (e) {}
    } else {
      try {
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
});
