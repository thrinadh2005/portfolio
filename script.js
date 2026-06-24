// Loader Logic
function hideLoader() {
  const loader = document.getElementById('premium-loader');
  if (loader && !loader.classList.contains('fade-out')) {
    loader.classList.add('fade-out');
  }
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 2500); // Matches the loader animation duration
});

// Fallback: hide loader after 5 seconds if load event hasn't fired
setTimeout(hideLoader, 5000);

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const voiceToggle = document.getElementById('voiceToggle');

// Theme Logic
function updateThemeIcon(isLight) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.className = isLight ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const isLight = savedTheme === 'light' || (!savedTheme && prefersLight);
  
  if (isLight) {
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light');
    updateThemeIcon(false);
  }
}

// Immediate execution to prevent flash
initTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });
}

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.getElementById('navbarNav');

// Close mobile menu on click
if (navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const isMobile = window.innerWidth < 992;
      const isExpanded = navbarCollapse && navbarCollapse.classList.contains('show');
      
      if (isMobile && isExpanded) {
        // Use Bootstrap's native API to close the menu
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
}

const body = document.body;

function openModal(src) {
  if (modal && modalImg) {
    modal.style.display = "block";
    modalImg.src = src;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = '';
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
// ... existing contact form logic ...

// Cyber Matrix Game Logic
const matrixCells = document.querySelectorAll('.matrix-cell');
const levelDisplay = document.getElementById('game-level');
const highScoreDisplay = document.getElementById('game-highscore');
const gameMessage = document.getElementById('game-message');
const startBtn = document.getElementById('start-game');

let sequence = [];
let userSequence = [];
let level = 1;
let highScore = 0;
let isPlaying = false;
let canClick = false;

function getRandomCell() {
  return Math.floor(Math.random() * 16);
}

async function playSequence() {
  canClick = false;
  gameMessage.textContent = "Memorizing Sequence...";
  gameMessage.style.color = "var(--accent)";

  for (let cellIndex of sequence) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const cell = matrixCells[cellIndex];
    if (cell) {
      cell.classList.add('active');
      setTimeout(() => cell.classList.remove('active'), 400);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  canClick = true;
  gameMessage.textContent = "Your Turn - Replicate!";
  gameMessage.style.color = "var(--accent3)";
}

function handleCellClick(e) {
  if (!canClick || !isPlaying) return;

  const index = parseInt(e.target.getAttribute('data-index'));
  userSequence.push(index);
  
  // Visual feedback
  e.target.classList.add('active');
  setTimeout(() => e.target.classList.remove('active'), 200);

  // Check if correct
  if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
    gameOver();
    return;
  }

  if (userSequence.length === sequence.length) {
    nextLevel();
  }
}

function nextLevel() {
  canClick = false;
  level++;
  if (levelDisplay) levelDisplay.textContent = level;
  userSequence = [];
  sequence.push(getRandomCell());
  
  gameMessage.textContent = "Level Clear! Secure...";
  setTimeout(playSequence, 1000);
}

function gameOver() {
  canClick = false;
  isPlaying = false;
  
  if (level > highScore) {
    highScore = level - 1;
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
  }

  gameMessage.textContent = "Breach Failed! Sequence Terminated.";
  gameMessage.style.color = "#ff4d4d";
  
  // Flash error
  matrixCells.forEach(cell => cell.classList.add('error'));
  setTimeout(() => {
    matrixCells.forEach(cell => cell.classList.remove('error'));
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Restart Breach';
    }
  }, 1000);
}

function startGame() {
  level = 1;
  if (levelDisplay) levelDisplay.textContent = level;
  sequence = [getRandomCell(), getRandomCell()]; // Start with 2
  userSequence = [];
  isPlaying = true;
  if (startBtn) startBtn.style.display = 'none';
  playSequence();
}

if (matrixCells.length > 0) {
  matrixCells.forEach(cell => cell.addEventListener('click', handleCellClick));
}
if (startBtn) {
  startBtn.addEventListener('click', startGame);
}

function initVoiceControl() {
  const btn = document.getElementById('voiceToggle');
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Enhanced browser compatibility check
  if (!Recognition) {
    console.warn('Speech Recognition not supported in this browser');
    if (btn) {
      btn.style.display = 'none';
      btn.title = 'Voice control not supported in this browser';
    }
    return;
  }
  
  if (!btn) {
    console.error('Voice toggle button not found');
    return;
  }
  
  const recognition = new Recognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  
  let active = false;
  let isListening = false;
  const synth = window.speechSynthesis;
  let tts = true;
  
  // Load TTS preference
  try {
    const saved = localStorage.getItem('voice_tts');
    if (saved !== null) tts = JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load TTS preference:', e);
  }
  
  // Enhanced speak function with visual feedback
  function speak(text, onEnd) {
    if (!tts || !synth || !text) {
      if (onEnd) onEnd();
      return;
    }
    
    try {
      synth.cancel();
      showVoiceFeedback('Speaking...');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        showVoiceFeedback('Speaking...');
      };
      
      utterance.onend = () => {
        hideVoiceFeedback();
        if (onEnd) onEnd();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        hideVoiceFeedback();
        if (onEnd) onEnd();
      };
      
      synth.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      hideVoiceFeedback();
      if (onEnd) onEnd();
    }
  }

  function speakPromise(text) {
    return new Promise(resolve => speak(text, resolve));
  }

  async function startPortfolioTour() {
    speak('Starting your personal tour of Thrinadh\'s portfolio. Sit back and enjoy!');
    
    const steps = [
      { 
        selector: '#home', 
        action: () => { smoothScrollTo('#home'); highlightSection('#home'); },
        text: 'We begin at the Home section. Here you can find Thrinadh\'s quick introduction as a CSE student, Google Student Ambassador, and cybersecurity enthusiast, along with his social links and resume.'
      },
      { 
        selector: '#about', 
        action: () => { smoothScrollTo('#about'); highlightSection('#about'); },
        text: 'Next, the About section. Thrinadh combines secure coding with ethical hacking. He maintains a high CGPA of 9.33 at GMR Institute of Technology and is passionate about solving real-world security challenges.'
      },
      { 
        selector: '#skills', 
        action: () => { smoothScrollTo('#skills'); highlightSection('#skills'); },
        text: 'Moving to Skills. He is proficient in Python, Java, C, and JavaScript, with a strong foundation in modern web tech like React and Node.js, along with robust database and cybersecurity fundamentals.'
      },
      { 
        selector: '#portfolio', 
        action: () => { smoothScrollTo('#portfolio'); highlightSection('#portfolio'); },
        text: 'The Portfolio section highlights his key projects: the Farmer Marketplace, Sri Lalitamba Nursery, the SecurePass security toolkit, the Marks Calculator, the sttp pentesting toolkit, and a feature-rich Dictionary app.'
      },
      { 
        selector: '#education', 
        action: () => { smoothScrollTo('#education'); highlightSection('#education'); },
        text: 'His Education background shows consistent excellence from secondary school through his current B.Tech studies.'
      },
      { 
        selector: '#achievements', 
        action: () => { smoothScrollTo('#achievements'); highlightSection('#achievements'); },
        text: 'In Experience and Achievements, you\'ll see his role as a Google Student Ambassador, his internship at Infosys, his leadership as an Event Coordinator, and his community service as an NSS volunteer.'
      },
      { 
        selector: '#certifications', 
        action: () => { smoothScrollTo('#certifications'); highlightSection('#certifications'); },
        text: 'Finally, his Certifications are grouped into four key areas: AI and Machine Learning, Software Dev and Databases, Cybersecurity and Tech, and Professional Skills, showcasing credentials from Google, MongoDB, and Infosys.'
      },
      { 
        selector: '#contact', 
        action: () => { smoothScrollTo('#contact'); highlightSection('#contact'); },
        text: 'That concludes our tour. You can reach out to Thrinadh through the contact form or social links. Thank you for visiting!'
      }
    ];

    for (const step of steps) {
      step.action();
      await speakPromise(step.text);
      await new Promise(r => setTimeout(r, 1000)); // Pause between sections
    }
  }
  
  // Visual feedback functions
  function showVoiceFeedback(message) {
    let feedback = document.querySelector('.voice-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'voice-feedback';
      document.body.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.classList.add('show');
  }
  
  function hideVoiceFeedback() {
    const feedback = document.querySelector('.voice-feedback');
    if (feedback) {
      setTimeout(() => {
        feedback.classList.remove('show');
      }, 500);
    }
  }
  
  // Enhanced UI feedback
  function setActive(on) {
    active = on;
    isListening = on;
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = on ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill';
    }
    btn.classList.toggle('active', on);
    btn.style.background = on ? 'var(--gradient-main)' : '';
    btn.title = on ? 'Voice control active - Click to stop' : 'Click to start voice control';
  }
  
  // Enhanced smooth scroll with better error handling
  function smoothScrollTo(selector) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Scroll error:', e);
      return false;
    }
  }
  
  function openSocial(label) {
    try {
      const link = document.querySelector(`.social-links a[aria-label="${label}"]`);
      if (link) {
        link.click();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Social link error:', e);
      return false;
    }
  }
  
  function setTheme(mode) {
    try {
      const isLight = mode === 'light';
      if (isLight && !body.classList.contains('light')) {
        themeToggle.click();
      } else if (!isLight && body.classList.contains('light')) {
        themeToggle.click();
      }
      return true;
    } catch (e) {
      console.error('Theme error:', e);
      return false;
    }
  }
  
  function filterProjects(kind) {
    try {
      const button = document.querySelector(`.filter-btn[data-filter="${kind}"]`);
      if (button) {
        button.click();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Filter error:', e);
      return false;
    }
  }
  function norm(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[^a-z0-9]/g, '');
  }
  function getProjectMap() {
    const map = {};
    document.querySelectorAll('#portfolio .project-card').forEach(card => {
      const titleElement = card.querySelector('h3');
      const linkElement = card.querySelector('.ext-link');
      
      if (titleElement && linkElement) {
        const title = titleElement.textContent.trim();
        const href = linkElement.getAttribute('href');
        if (title && href) {
          map[norm(title)] = href;
        }
      }
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
    
    // Try fuzzy matching
    const keys = Object.keys(projects);
    const match = keys.find(k => k.includes(key) || key.includes(k));
    
    if (match) {
      window.open(projects[match], '_blank', 'noopener,noreferrer');
      speak('Opening ' + name);
      return true;
    }
    
    speak('Could not find project ' + name);
    return false;
  }
  
  function readSection(id) {
    try {
      const element = document.querySelector(id);
      if (!element) {
        speak('Section not found');
        return;
      }
      
      const text = element.innerText || '';
      if (text.length > 0) {
        speak(text.slice(0, 400));
      } else {
        speak('No content to read in this section');
      }
    } catch (e) {
      console.error('Read section error:', e);
      speak('Error reading section');
    }
  }
  function handleVoiceCommand(cmd) {
    const c = cmd.toLowerCase();
    
    // Portfolio explanation commands
    if (c.includes('tell me about thrinadh') || c.includes('who is thrinadh') || c.includes('about thrinadh')) {
      explainThrinadh();
      return;
    }
    if (c.includes('start tour') || c.includes('show me around') || c.includes('tell about me') || c.includes('tour portfolio') || c.includes('introduce yourself')) {
      startPortfolioTour();
      return;
    }
    if (c.includes('tell me about portfolio') || c.includes('explain portfolio') || c.includes('portfolio overview')) {
      explainPortfolioOverview();
      return;
    }
    if (c.includes('show projects') || c.includes('tell me about projects') || c.includes('explain projects')) {
      explainProjects();
      return;
    }
    if (c.includes('show skills') || c.includes('tell me about skills') || c.includes('explain skills')) {
      explainSkills();
      return;
    }
    if (c.includes('show education') || c.includes('tell me about education') || c.includes('explain education')) {
      explainEducation();
      return;
    }
    if (c.includes('show achievements') || c.includes('tell me about achievements') || c.includes('explain achievements')) {
      explainAchievements();
      return;
    }
    if (c.includes('show certifications') || c.includes('tell me about certifications') || c.includes('explain certifications')) {
      explainCertifications();
      return;
    }
    
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
    if (c.includes('open resume') || c.includes('view resume')) {
      const link = document.querySelector('a[href="RESUME.pdf"]');
      if (link) link.click();
      speak('Opening resume');
      return;
    }
    if (c.includes('open image') || c.includes('open photo') || c.includes('show photo') || c.includes('show image')) {
      openModal && openModal('mypic.png');
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
    if (c.includes('tell me more') || c.includes('more details') || c.includes('explain more')) {
      const current = [...sections].find(s => {
        const rect = s.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight / 2;
      });
      if (current) {
        switch(current.id) {
          case 'about': explainThrinadh(); break;
          case 'skills': explainSkills(); break;
          case 'education': explainEducation(); break;
          case 'certifications': explainCertifications(); break;
          case 'portfolio': explainProjects(); break;
          case 'achievements': explainAchievements(); break;
          default: readSection('#' + current.id);
        }
      }
      return;
    }
    if (c.includes('what are your skills') || c.includes('list your skills')) {
      explainSkills();
      return;
    }
    if (c.includes('what projects have you done') || c.includes('your projects')) {
      explainProjects();
      return;
    }
    if (c.includes('your education') || c.includes('where did you study')) {
      explainEducation();
      return;
    }
    if (c.includes('your achievements') || c.includes('what have you achieved')) {
      explainAchievements();
      return;
    }
    if (c.includes('your certifications') || c.includes('what certifications do you have')) {
      explainCertifications();
      return;
    }
    if (c.includes('contact information') || c.includes('how to contact') || c.includes('contact details')) {
      smoothScrollTo('#contact');
      highlightSection('#contact');
      speak('You can contact Thrinadh via email at thrinadh2005@gmail.com. He is located in Rajahmundry, Andhra Pradesh. You can also reach out through social media links like GitHub, LinkedIn, or WhatsApp.');
      return;
    }
    if (c.includes('resume') || c.includes('view resume')) {
      const link = document.querySelector('a[href="RESUME.pdf"]');
      if (link) link.click();
      speak('Opening resume');
      return;
    }
    if (c.includes('social media') || c.includes('social links') || c.includes('social profiles')) {
      smoothScrollTo('#home');
      speak('Thrinadh is active on GitHub, LinkedIn, CodeChef, HackerRank, Instagram, and WhatsApp. You can find these links in the home section.');
      return;
    }
    if (c.includes('stop highlighting') || c.includes('remove highlight')) {
      document.querySelectorAll('section').forEach(section => {
        section.style.boxShadow = '';
        section.style.transform = '';
      });
      speak('Highlights removed');
      return;
    }
    if (c.includes('help') || c.includes('what can you do')) {
      speak('You can navigate sections, scroll, change theme, open social links, open projects by name, filter projects, open resume, read sections, and ask me to explain Thrinadh\'s portfolio. Say, tell me about Thrinadh.');
      return;
    }
    if (c.includes('command palette') || c.includes('open command palette') || c.includes('search')) {
      if (window.openCommandPalette) {
        window.openCommandPalette();
        const query = c.replace(/command palette|open command palette|search( for)?/g, '').trim();
        if (query) {
          const input = document.getElementById('cmdkInput');
          if (input) {
            input.value = query;
            input.dispatchEvent(new Event('input'));
          }
        }
      }
      return;
    }
    if (c.includes('stop listening') || c.includes('deactivate voice') || c.includes('turn off voice')) {
      btn.click();
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
  // Enhanced button click handler with better error handling
  btn.addEventListener('click', () => {
    try {
      if (!active) {
        // Check for microphone permissions first
        if (navigator.permissions) {
          navigator.permissions.query({ name: 'microphone' }).then((result) => {
            if (result.state === 'denied') {
              speak('Microphone permission denied. Please allow microphone access in your browser settings.');
              return;
            }
            startVoiceRecognition();
          }).catch(() => {
            // Permissions API not supported, proceed anyway
            startVoiceRecognition();
          });
        } else {
          // Permissions API not supported, proceed anyway
          startVoiceRecognition();
        }
      } else {
        // Stop listening
        speak('Voice control deactivated');
        recognition.stop();
        setActive(false);
        console.log('Voice recognition stopped');
      }
    } catch (e) {
      console.error('Voice control toggle error:', e);
      speak('Voice control error. Please try again.');
      setActive(false);
    }
  });
  
  function startVoiceRecognition() {
    try {
      recognition.start();
      setActive(true);
      showVoiceFeedback('Listening...');
      speak('Voice control activated. I\'m listening for your commands.');
      console.log('Voice recognition started');
    } catch (e) {
      console.error('Failed to start recognition:', e);
      if (e.name === 'NotAllowedError') {
        speak('Microphone access denied. Please allow microphone access and try again.');
      } else {
        speak('Failed to start voice recognition. Please try again.');
      }
      setActive(false);
    }
  }
  
  // Enhanced recognition event handlers
  recognition.addEventListener('result', (event) => {
    try {
      const result = event.results[event.results.length - 1];
      if (result && result[0]) {
        const transcript = result[0].transcript.trim();
        const confidence = result[0].confidence || 0;
        
        console.log('Voice recognized:', transcript, 'Confidence:', confidence);
        showVoiceFeedback(`"${transcript}"`);
        
        // Only process if confidence is reasonable
        if (confidence > 0.5) {
          setTimeout(() => {
            handleVoiceCommand(transcript);
          }, 500);
        } else {
          console.log('Low confidence, ignoring:', transcript);
          showVoiceFeedback('Didn\'t catch that. Please speak clearly.');
          setTimeout(hideVoiceFeedback, 2000);
        }
      }
    } catch (e) {
      console.error('Recognition result error:', e);
    }
  });
  
  recognition.addEventListener('error', (event) => {
    console.error('Recognition error:', event.error);
    
    switch (event.error) {
      case 'no-speech':
        console.log('No speech detected');
        showVoiceFeedback('No speech detected');
        setTimeout(hideVoiceFeedback, 2000);
        break;
      case 'audio-capture':
        console.error('Microphone not available');
        showVoiceFeedback('Microphone not available');
        speak('Microphone not available. Please check your permissions.');
        setActive(false);
        break;
      case 'not-allowed':
        console.error('Microphone permission denied');
        showVoiceFeedback('Microphone permission denied');
        speak('Microphone permission denied. Please allow microphone access.');
        setActive(false);
        break;
      case 'network':
        console.error('Network error');
        showVoiceFeedback('Network error');
        speak('Network error. Please check your internet connection.');
        setActive(false);
        break;
      case 'service-not-allowed':
        console.error('Service not allowed');
        showVoiceFeedback('Voice service not allowed');
        speak('Voice recognition service not allowed. Please check browser settings.');
        setActive(false);
        break;
      default:
        console.error('Unknown recognition error:', event.error);
        showVoiceFeedback('Voice recognition error');
        speak('Voice recognition error. Please try again.');
        setActive(false);
    }
  });
  
  recognition.addEventListener('start', () => {
    console.log('Recognition started');
    isListening = true;
    showVoiceFeedback('Listening...');
  });
  
  recognition.addEventListener('end', () => {
    console.log('Recognition ended');
    isListening = false;
    
    // Restart if still active
    if (active) {
      try {
        setTimeout(() => {
          if (active && !isListening) {
            recognition.start();
          }
        }, 100);
      } catch (e) {
        console.error('Restart recognition error:', e);
        setActive(false);
      }
    }
  });
  
  // Check for HTTPS requirement
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('Voice recognition requires HTTPS in most browsers');
    btn.title = 'Voice control requires HTTPS - Some features may not work';
    btn.style.opacity = '0.7';
  }
  
  console.log('Voice control initialized successfully');
}

// Portfolio explanation functions
function explainThrinadh() {
  const text = `Adabala Venkata Thrinadh is a Computer Science student at GMR Institute of Technology, a Google Student Ambassador, and an Intern at Infosys. He's passionate about cybersecurity and ethical hacking, combining secure coding practices with understanding vulnerabilities. Thrinadh maintains an excellent academic record with a 9.33 CGPA. He's skilled in Python, Java, C, web technologies like React and Node, databases like MongoDB, and cybersecurity fundamentals.`;
  
  smoothScrollTo('#about');
  highlightSection('#about');
  speak(text);
}

function explainPortfolioOverview() {
  const text = `This portfolio showcases Thrinadh's journey as a Computer Science student, Google Student Ambassador, and cybersecurity enthusiast. It includes his educational background, diverse technical skills, numerous full-stack projects, categorized certifications from platforms like Google, MongoDB, and Infosys, and achievements in leadership and community service.`;
  
  speak(text);
}

function explainProjects() {
  smoothScrollTo('#portfolio');
  highlightSection('#portfolio');
  
  const projects = [
    'Farmer Marketplace - A full-stack platform connecting local farmers and plant buyers, built with React, Node.js, and MongoDB.',
    'Sri Lalitamba Nursery - A production-ready POS and digital storefront.',
    'Marks Calculator - An academic toolkit for predicting and calculating marks.',
    'sttp - An educational secure penetration testing toolkit.',
    'SecurePass - A security tool featuring password strength checking and text encryption.',
    'Dictionary - A full-stack dictionary app with word definitions and translator.',
    'Personal Portfolio - This high-performance portfolio website.'
  ];
  
  const text = `Thrinadh has worked on several prominent projects: ${projects.join(' ')}. These projects demonstrate his skills in full-stack development, database management, security tools, and modern web technologies.`;
  speak(text);
}

function explainSkills() {
  smoothScrollTo('#skills');
  highlightSection('#skills');
  
  const text = `Thrinadh has a diverse skill set including programming languages like Python, Java, JavaScript, and C. He's strong in computer science fundamentals and modern web technologies such as React, Node.js, HTML5, and CSS3. He is also proficient with databases like MongoDB and SQL. His technical skills perfectly complement his expertise in problem-solving and cybersecurity.`;
  speak(text);
}

function explainEducation() {
  smoothScrollTo('#education');
  highlightSection('#education');
  
  const text = `Thrinadh is currently pursuing his B.Tech in Computer Science and Engineering at GMR Institute of Technology with an impressive 9.33 CGPA. He completed his intermediate education with a 9.76 GPA and scored 92.3% in his secondary school. His excellent academic performance reflects his dedication to learning.`;
  speak(text);
}

function explainAchievements() {
  smoothScrollTo('#achievements');
  highlightSection('#achievements');
  
  const text = `Thrinadh serves as a Google Student Ambassador, fostering the campus developer community, and is an Intern at Infosys. He has also been an Event Coordinator for STEPCONE, a national-level tech fest, and is an active NSS volunteer dedicated to community service.`;
  speak(text);
}

function explainCertifications() {
  smoothScrollTo('#certifications');
  highlightSection('#certifications');
  
  const text = `Thrinadh has earned numerous certifications categorized into four key areas: AI and Machine Learning, Software Development and Databases, Cybersecurity and Advanced Tech, and Professional Skills. Notable certifications include Foundations of Cybersecurity from Google, MongoDB CRUD Operations, and various Generative AI and Deep Learning courses from Infosys Springboard.`;
  speak(text);
}

function highlightSection(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  element.style.transition = 'all 0.3s ease';
  element.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
  element.style.transform = 'scale(1.02)';
  
  setTimeout(() => {
    element.style.boxShadow = '';
    element.style.transform = '';
  }, 3000);
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
    [['Toggle theme', () => themeToggle.click()], ['Start Portfolio Tour', () => startPortfolioTour()], ['Dark mode', () => { if (body.classList.contains('light')) themeToggle.click(); }], ['Light mode', () => { if (!body.classList.contains('light')) themeToggle.click(); }], ['View Resume', () => { const l = document.querySelector('a[href="RESUME.pdf"]'); if (l) l.click(); }], ['Filter All', () => { const b = document.querySelector(`.filter-btn[data-filter="all"]`); if (b) b.click(); }], ['Filter Web', () => { const b = document.querySelector(`.filter-btn[data-filter="web"]`); if (b) b.click(); }], ['Filter Security', () => { const b = document.querySelector(`.filter-btn[data-filter="security"]`); if (b) b.click(); }], ['Filter Research', () => { const b = document.querySelector(`.filter-btn[data-filter="research"]`); if (b) b.click(); }]].forEach(p => arr.push({ label: p[0], group: 'Actions', run: p[1] }));
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
  
  // Minimalist Visitor Count (Dynamic)
  async function updateVisitorCount() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;
    
    try {
      // CounterAPI.dev - Simple JSON counter that supports CORS
      // This will increment the count and return the new value
      const response = await fetch('https://api.counterapi.dev/v1/thrinadh_portfolio/visits/up');
      const data = await response.json();
      
      if (data && data.count) {
        // Format number with commas for readability (e.g., 1,234)
        counterEl.textContent = data.count.toLocaleString();
      } else {
        counterEl.textContent = 'Active';
      }
    } catch (err) {
      console.error('Visitor count error:', err);
      // Fallback if the API is down
      counterEl.textContent = 'Live';
    }
  }
  updateVisitorCount();
});