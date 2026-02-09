
// DOM Elements
const themeToggle = document.getElementById('themeToggle');
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
});
