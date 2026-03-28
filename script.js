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
        text: 'We begin at the Home section. Here you can find Thrinadh\'s quick introduction as a CSE student and cybersecurity enthusiast, along with his social links and resume.'
      },
      { 
        selector: '#about', 
        action: () => { smoothScrollTo('#about'); highlightSection('#about'); },
        text: 'Next, the About section. Thrinadh combines secure coding with ethical hacking. He maintains a high CGPA of 9.4 at GMR Institute of Technology and is passionate about solving real-world security challenges.'
      },
      { 
        selector: '#skills', 
        action: () => { smoothScrollTo('#skills'); highlightSection('#skills'); },
        text: 'Moving to Skills. He is proficient in Python, Java, and C, with a strong foundation in data structures, algorithms, and cybersecurity fundamentals.'
      },
      { 
        selector: '#portfolio', 
        action: () => { smoothScrollTo('#portfolio'); highlightSection('#portfolio'); },
        text: 'The Portfolio section highlights his key projects: the Farmer Marketplace, an automated Results System, the SecurePass security toolkit, and a feature-rich Dictionary app.'
      },
      { 
        selector: '#education', 
        action: () => { smoothScrollTo('#education'); highlightSection('#education'); },
        text: 'His Education background shows consistent excellence from secondary school through his current B.Tech studies.'
      },
      { 
        selector: '#achievements', 
        action: () => { smoothScrollTo('#achievements'); highlightSection('#achievements'); },
        text: 'In Achievements, you\'ll see his leadership as an Event Coordinator, his community service as an NSS volunteer, and his success in hackathons and competitive programming.'
      },
      { 
        selector: '#certifications', 
        action: () => { smoothScrollTo('#certifications'); highlightSection('#certifications'); },
        text: 'Finally, his Certifications from Infosys, L&T, and NPTEL demonstrate his commitment to continuous learning in cybersecurity and web development.'
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
    
    // AI-Powered Commands
    if (c.includes('ask ai') || c.includes('ai help') || c.includes('artificial intelligence')) {
      handleAICommand(cmd);
      return;
    }
    
    // Enhanced portfolio explanation commands
    if (c.includes('tell me about thrinadh') || c.includes('who is thrinadh') || c.includes('about thrinadh')) {
      explainThrinadhAI();
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
      explainProjectsAI();
      return;
    }
    if (c.includes('show skills') || c.includes('tell me about skills') || c.includes('explain skills')) {
      explainSkillsAI();
      return;
    }
    if (c.includes('show education') || c.includes('tell me about education') || c.includes('explain education')) {
      explainEducationAI();
      return;
    }
    if (c.includes('show achievements') || c.includes('tell me about achievements') || c.includes('explain achievements')) {
      explainAchievementsAI();
      return;
    }
    if (c.includes('show certifications') || c.includes('tell me about certifications') || c.includes('explain certifications')) {
      explainCertificationsAI();
      return;
    }
    
    // Smart project commands
    if (c.includes('open project') || c.includes('show project') || c.includes('view project')) {
      const projectName = c.replace(/(open|show|view) project/i, '').trim();
      if (projectName) {
        openProjectAI(projectName);
        return;
      }
    }
    
    // Navigation commands
    const secMatch = c.match(/(go to|navigate to|open|show) (home|about|skills|education|certifications|projects|portfolio|experience|achievements|contact)/);
    if (secMatch) {
      const map = { home: '#home', about: '#about', skills: '#skills', education: '#education', certifications: '#certifications', projects: '#portfolio', portfolio: '#portfolio', experience: '#achievements', achievements: '#achievements', contact: '#contact' };
      smoothScrollTo(map[secMatch[2]]);
      speak('Opening ' + secMatch[2]);
      return;
    }
    
    // Scroll commands
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
    
    // Theme commands
    if (c.includes('toggle theme') || c.includes('switch theme') || c.includes('change theme')) {
      themeToggle.click();
      speak('Toggled theme');
      return;
    }
    if (c.includes('light theme') || c.includes('light mode')) {
      setTheme('light');
      speak('Switched to light theme');
      return;
    }
    if (c.includes('dark theme') || c.includes('dark mode')) {
      setTheme('dark');
      speak('Switched to dark theme');
      return;
    }
    
    // Contact commands
    if (c.includes('show resume') || c.includes('open cv') || c.includes('download resume')) {
      const link = document.querySelector('a[href*="RESUME"]');
      if (link) {
        link.click();
        speak('Opening resume for download');
      } else {
        speak('Resume not found');
      }
      return;
    }
    if (c.includes('contact thrinadh') || c.includes('send message') || c.includes('email thrinadh')) {
      smoothScrollTo('#contact');
      speak('Opening contact section. You can send a message to thrinadh at thrinadh2005@gmail.com');
      return;
    }
    
    // Social commands
    if (c.includes('instagram') || c.includes('social media')) {
      openSocial('Instagram');
      speak('Opening Instagram profile');
      return;
    }
    if (c.includes('github') || c.includes('code')) {
      openSocial('GitHub');
      speak('Opening GitHub profile');
      return;
    }
    if (c.includes('linkedin') || c.includes('professional')) {
      openSocial('LinkedIn');
      speak('Opening LinkedIn profile');
      return;
    }
    
    // Help commands
    if (c.includes('help') || c.includes('commands') || c.includes('what can you do')) {
      speak('I can help you navigate the portfolio, explain sections, open projects, change themes, and provide AI-powered insights. Say "ask ai" followed by your question, or try commands like "show projects", "tell me about skills", or "start tour".');
      return;
    }
    
    // Default response
    speak('I didn\'t understand that command. Try saying "help" for available commands, or "ask ai" for intelligent assistance.');
  }

  // AI-Powered Functions
  async function handleAICommand(command) {
    showVoiceFeedback('AI Processing...');
    
    // Remove "ask ai" prefix and get the actual question
    const question = command.replace(/(ask ai|ai help|artificial intelligence)/i, '').trim();
    
    if (!question) {
      speak('What would you like to know? You can ask about Thrinadh\'s skills, projects, or any portfolio-related questions.');
      hideVoiceFeedback();
      return;
    }
    
    try {
      // Simulate AI processing (in real implementation, this would call an AI API)
      const response = await generateAIResponse(question);
      speak(response);
    } catch (error) {
      speak('Sorry, I encountered an error processing your question. Please try again.');
    }
    
    hideVoiceFeedback();
  }

  async function generateAIResponse(question) {
    // Simulated AI responses - in production, replace with actual AI API call
    const responses = {
      'skills': 'Thrinadh has expertise in Python, Java, and C programming, with strong foundations in data structures, algorithms, and cybersecurity. He\'s particularly skilled in web development, problem solving, and ethical hacking methodologies.',
      'projects': 'Thrinadh has developed several impressive projects including a Farmer Marketplace platform, an automated Results System, a SecurePass security toolkit, and a full-stack Dictionary application. Each project demonstrates his technical versatility and problem-solving abilities.',
      'education': 'Thrinadh is currently pursuing B.Tech in Computer Science at GMR Institute of Technology with an outstanding CGPA of 9.4. He has consistently maintained excellent academic performance throughout his education.',
      'experience': 'Thrinadh has practical experience as an Event Coordinator for STEPCONE tech fest, NSS volunteer work, and participation in hackathons. He\'s also a competitive programmer with strong problem-solving skills.',
      'certifications': 'Thrinadh has completed 14 certifications from Infosys Springboard covering AI, machine learning, deep learning, and data science. He also has certifications from L&T LearnConnect and NPTEL in various technical domains.',
      'contact': 'You can contact Thrinadh through the contact form on this portfolio, or email him directly at thrinadh2005@gmail.com. He\'s also active on Instagram and other social platforms.',
      'career': 'Thrinadh is a Computer Science student passionate about cybersecurity and software development. He\'s building a strong foundation in both theoretical concepts and practical applications, with a focus on secure coding practices.',
      'future': 'Thrinadh aims to specialize in cybersecurity while continuing to develop his software development skills. He\'s particularly interested in AI, machine learning, and their applications in security.',
      'default': 'That\'s an interesting question! Based on what I know about Thrinadh, he\'s a dedicated Computer Science student with strong technical skills and a passion for cybersecurity. You can explore specific sections of this portfolio to learn more about his skills, projects, and achievements.'
    };
    
    // Simple keyword matching for demo purposes
    for (const [key, response] of Object.entries(responses)) {
      if (key === 'default') continue;
      if (question.toLowerCase().includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  }

  function explainThrinadhAI() {
    speak('Adabala Venkata Thrinadh is a Computer Science student at GMR Institute of Technology with a CGPA of 9.4. He specializes in secure coding practices and ethical hacking methodologies. Thrinadh is passionate about building robust applications while understanding their vulnerabilities from both defensive and offensive perspectives. He has completed 14 AI and machine learning certifications from Infosys Springboard and actively participates in hackathons and competitive programming.');
  }

  function explainProjectsAI() {
    speak('Thrinadh has developed five major projects showcasing his technical versatility. The Farmer Marketplace connects local farmers with buyers using React and Node.js. The Results System automates academic management with Python and MySQL. SecurePass is a security toolkit with password analysis and encryption features. The Dictionary app is a full-stack application with user authentication. Finally, this portfolio itself demonstrates his frontend development skills with 3D effects and responsive design.');
  }

  function explainSkillsAI() {
    speak('Thrinadh possesses strong programming skills in Python, Java, and C. He has excellent command over data structures, algorithms, and database management. His technical expertise includes web development, Git version control, and cybersecurity fundamentals. Thrinadh excels in problem solving and has completed advanced certifications in artificial intelligence, machine learning, and deep learning from Infosys Springboard.');
  }

  function explainEducationAI() {
    speak('Thrinadh is currently pursuing B.Tech in Computer Science and Engineering at GMR Institute of Technology, maintaining an impressive CGPA of 9.4. He completed his intermediate education with a GPA of 9.76 and secondary school with 92.3%. His consistent academic excellence demonstrates his strong foundation in computer science concepts and dedication to learning.');
  }

  function explainAchievementsAI() {
    speak('Thrinadh has diverse achievements including serving as Event Coordinator for STEPCONE national tech fest, where he managed logistics and ensured smooth execution. As an NSS volunteer, he contributes to community service and social welfare. He regularly participates in hackathons, demonstrating his ability to build innovative solutions under pressure. Additionally, he ranks highly on competitive programming platforms like HackerRank and CodeChef, showcasing his problem-solving expertise.');
  }

  function explainCertificationsAI() {
    speak('Thrinadh has completed an impressive 14 certifications from Infosys Springboard, covering cutting-edge technologies including Natural Language Processing, Artificial Intelligence, Deep Learning, Computer Vision, and OpenAI GPT models. He also has certifications in Generative AI, Prompt Engineering, and Data Science. Additionally, he has completed courses from L&T LearnConnect in Python and web development, and NPTEL certifications in operating systems and problem solving.');
  }

  function openProjectAI(projectName) {
    const projects = {
      'farmer marketplace': 'https://farmer-plant-marketplace.vercel.app',
      'results system': '#',
      'securepass': 'https://secure-pass-coral.vercel.app/',
      'dictionary': 'https://dictionary-f4nc.onrender.com/',
      'portfolio': 'https://thrinadh.vercel.app/'
    };
    
    const projectKey = projectName.toLowerCase();
    const projectUrl = projects[projectKey];
    
    if (projectUrl) {
      if (projectUrl !== '#') {
        window.open(projectUrl, '_blank', 'noopener,noreferrer');
        speak(`Opening ${projectName} project in a new tab`);
      } else {
        speak(`The ${projectName} project is available for demonstration but not publicly deployed. Would you like to see other projects?`);
      }
    } else {
      speak(`I couldn't find a project named "${projectName}". Available projects are: Farmer Marketplace, Results System, SecurePass, Dictionary, and Portfolio.`);
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
  const text = `Adabala Venkata Thrinadh is a Computer Science student at GMR Institute of Technology. He's passionate about cybersecurity and ethical hacking, combining secure coding practices with understanding vulnerabilities. Thrinadh maintains an excellent academic record with a 9.4 CGPA and is actively involved in hackathons, competitive programming, and community service through NSS. He's skilled in Python, Java, C programming, web technologies, and cybersecurity fundamentals.`;
  
  smoothScrollTo('#about');
  highlightSection('#about');
  speak(text);
}

function explainPortfolioOverview() {
  const text = `This portfolio showcases Thrinadh's journey as a Computer Science student and cybersecurity enthusiast. It includes his educational background, technical skills, academic projects, certifications from platforms like Infosys Springboard and L&T LearnConnect, and achievements in competitive programming and hackathons. The portfolio demonstrates his expertise in web development, security tools, and problem-solving abilities.`;
  
  speak(text);
}

function explainProjects() {
  smoothScrollTo('#portfolio');
  highlightSection('#portfolio');
  
  const projects = [
    'Farmer Marketplace - A full-stack platform connecting local farmers and plant buyers, built with React, Node.js, and MongoDB.',
    'Results System - An automated academic management system for calculating CGPA and generating reports using Python and MySQL.',
    'SecurePass - A security tool featuring password strength checking and text encryption using Python and cryptography.',
    'Dictionary - A full-stack dictionary app with word definitions and user authentication built with React.',
    'Personal Portfolio - This high-performance portfolio website with glassmorphism design using HTML5, CSS3, and JavaScript.'
  ];
  
  const text = `Thrinadh has worked on five main projects: ${projects.join('. ')}. These projects demonstrate his skills in full-stack development, security tools, and modern web technologies.`;
  speak(text);
}

function explainSkills() {
  smoothScrollTo('#skills');
  highlightSection('#skills');
  
  const text = `Thrinadh has a diverse skill set including programming languages like Python, Java, and C. He's strong in computer science fundamentals including data structures, algorithms, database management, and object-oriented programming. His technical skills include Git and GitHub, web technologies, problem-solving, and cybersecurity. He bridges the gap between theoretical computer science and modern development practices.`;
  speak(text);
}

function explainEducation() {
  smoothScrollTo('#education');
  highlightSection('#education');
  
  const text = `Thrinadh is currently pursuing his B.Tech in Computer Science and Engineering at GMR Institute of Technology with an impressive 9.4 CGPA. He completed his intermediate education with a 9.76 GPA and scored 92.3% in his secondary school. His excellent academic performance reflects his dedication to learning and excellence in computer science.`;
  speak(text);
}

function explainAchievements() {
  smoothScrollTo('#achievements');
  highlightSection('#achievements');
  
  const text = `Thrinadh has several notable achievements including serving as Event Coordinator for STEPCONE, a national-level tech fest. He's an active NSS volunteer dedicated to community service. He competes in overnight hackathons, demonstrating his ability to build innovative solutions under pressure. He's also a problem-solving expert with consistent rankings on competitive programming platforms like HackerRank and CodeChef.`;
  speak(text);
}

function explainCertifications() {
  smoothScrollTo('#certifications');
  highlightSection('#certifications');
  
  const text = `Thrinadh has earned certifications from multiple platforms. From Infosys Springboard, he completed courses in Introduction to Cyber Security, Cybersecurity Fundamentals, and Basics of Python. From L&T LearnConnect, he earned certifications in Python Challenge Series, Web Development Fundamentals, and Ethical Hacking Gateway. He also has NPTEL certifications in Operating System Fundamentals and various programming certifications from HackerRank.`;
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
    
    // Navigation items
    navLinks.forEach(a => {
      const t = a.textContent.trim();
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        arr.push({ 
          label: `Go to ${t}`, 
          group: 'Navigation', 
          run: () => { 
            const el = document.querySelector(href); 
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              highlightSection(href);
            }
          } 
        });
      }
    });
    
    // Project items - Updated for 3D carousel
    const projects = [
      { name: 'Farmer Marketplace', url: 'https://farmer-plant-marketplace.vercel.app' },
      { name: 'Results System', url: '#' },
      { name: 'SecurePass', url: 'https://secure-pass-coral.vercel.app/' },
      { name: 'Dictionary', url: 'https://dictionary-f4nc.onrender.com/' },
      { name: 'Portfolio', url: 'https://thrinadh.vercel.app/' }
    ];
    
    projects.forEach(project => {
      arr.push({ 
        label: `Open ${project.name}`, 
        group: 'Projects', 
        run: () => { 
          if (project.url !== '#') {
            window.open(project.url, '_blank', 'noopener,noreferrer');
          } else {
            alert(`${project.name} is available for demonstration but not publicly deployed.`);
          }
        } 
      });
    });
    
    // Social media items
    const socialLinks = [
      ['GitHub', 'https://github.com/thrinadh'],
      ['LinkedIn', 'https://linkedin.com/in/thrinadh'],
      ['Instagram', 'https://instagram.com/thrinadh_adabala'],
      ['CodeChef', 'https://codechef.com/users/thrinadh'],
      ['HackerRank', 'https://hackerrank.com/thrinadh']
    ];
    
    socialLinks.forEach(([name, url]) => {
      arr.push({ 
        label: `Open ${name}`, 
        group: 'Social', 
        run: () => { 
          window.open(url, '_blank', 'noopener,noreferrer');
        } 
      });
    });
    
    // Action items
    const actions = [
      ['Toggle theme', () => themeToggle.click()],
      ['Start Portfolio Tour', () => startPortfolioTour()],
      ['Dark mode', () => { if (body.classList.contains('light')) themeToggle.click(); }],
      ['Light mode', () => { if (!body.classList.contains('light')) themeToggle.click(); }],
      ['View Resume', () => { 
        const link = document.querySelector('a[href*="RESUME"]'); 
        if (link) link.click(); 
      }],
      ['Filter All Projects', () => { 
        const btn = document.querySelector('.filter-btn[data-filter="all"]'); 
        if (btn) btn.click(); 
      }],
      ['Filter Web Projects', () => { 
        const btn = document.querySelector('.filter-btn[data-filter="web"]'); 
        if (btn) btn.click(); 
      }],
      ['Filter Security Projects', () => { 
        const btn = document.querySelector('.filter-btn[data-filter="security"]'); 
        if (btn) btn.click(); 
      }],
      ['Filter Research Projects', () => { 
        const btn = document.querySelector('.filter-btn[data-filter="research"]'); 
        if (btn) btn.click(); 
      }],
      ['Go to Contact', () => { 
        smoothScrollTo('#contact');
        highlightSection('#contact');
      }],
      ['Go to Top', () => { 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }]
    ];
    
    actions.forEach(([label, run]) => {
      arr.push({ label, group: 'Actions', run });
    });
    
    items = arr;
  }
  
  function show() {
    build();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    filter('');
    setTimeout(() => input.focus(), 100);
  }
  
  function hide() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }
  
  function filter(q) {
    const s = q.trim().toLowerCase();
    filtered = !s ? items : items.filter(i => 
      i.label.toLowerCase().includes(s) || 
      i.group.toLowerCase().includes(s)
    );
    render();
  }
  
  function render() {
    index = 0;
    list.innerHTML = '';
    
    if (filtered.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'cmdk-item disabled';
      noResults.textContent = 'No results found';
      list.appendChild(noResults);
      return;
    }
    
    // Group items
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    
    Object.keys(groups).forEach(groupName => {
      // Add group header
      const header = document.createElement('div');
      header.className = 'cmdk-group-header';
      header.textContent = groupName;
      list.appendChild(header);
      
      // Add group items
      groups[groupName].forEach((it, i) => {
        const d = document.createElement('div');
        d.className = 'cmdk-item' + (i === index ? ' active' : '');
        d.setAttribute('data-idx', String(index));
        d.innerHTML = `<span class="cmdk-item-label">${it.label}</span>`;
        d.addEventListener('mouseenter', () => { setActive(index); });
        d.addEventListener('click', () => { run(index); });
        list.appendChild(d);
        index++;
      });
    });
    
    index = 0; // Reset to first item
  }
  
  function setActive(i) {
    const items = list.querySelectorAll('.cmdk-item:not(.disabled)');
    if (items.length === 0) return;
    
    index = Math.max(0, Math.min(i, items.length - 1));
    items.forEach((el, idx) => {
      if (idx === index) {
        el.classList.add('active');
        // Scroll into view if needed
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('active');
      }
    });
  }
  
  function run(i) {
    const items = list.querySelectorAll('.cmdk-item:not(.disabled)');
    const item = filtered.find(it => it.label === items[i]?.textContent?.trim());
    if (item && item.run) {
      item.run();
      hide();
    }
  }
  
  // Input event
  input.addEventListener('input', e => filter(input.value));
  
  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    
    // Toggle command palette
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('show')) {
        hide();
      } else {
        show();
      }
      return;
    }
    
    // Handle command palette navigation
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
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActive(e.shiftKey ? index - 1 : index + 1);
      }
    }
  });
  
  // Global functions
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