/**
 * ADITHYA V - PORTFOLIO JAVASCRIPT
 * Rich Interactivity, Particle Systems, Interactive C Console Simulation, Filter Tabs, and UI Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initTypingEffect();
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initSkillsFilter();
  initGraphicsEditorSim();
  initClipboardAndContact();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Canvas Background
   -------------------------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  let animationFrameId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor((width * height) / 16000), 65);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Typing Effect for Subtitle
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'B.Tech AI & Data Science Student',
    'C & Python Programmer',
    'Aspiring Software Engineer',
    'Practical Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('adithya_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('adithya_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    toggleBtn.innerHTML = theme === 'light' 
      ? '<i class="fa-solid fa-moon"></i>' 
      : '<i class="fa-solid fa-sun"></i>';
    toggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Close when clicking any nav link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Spy & Navbar Blur on Scroll
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Skills Filter Tabs
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive 2D Graphics Editor Console Simulation (Project 2 Demo)
   -------------------------------------------------------------------------- */
function initGraphicsEditorSim() {
  const canvasDisplay = document.getElementById('sim-canvas-display');
  const controlButtons = document.querySelectorAll('.sim-btn');
  if (!canvasDisplay) return;

  const ROWS = 10;
  const COLS = 38;
  let grid = [];

  function clearGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid.push(new Array(COLS).fill(' '));
    }
    // Draw outer boundary
    for (let c = 0; c < COLS; c++) {
      grid[0][c] = '-';
      grid[ROWS - 1][c] = '-';
    }
    for (let r = 0; r < ROWS; r++) {
      grid[r][0] = '|';
      grid[r][COLS - 1] = '|';
    }
    grid[0][0] = '+';
    grid[0][COLS - 1] = '+';
    grid[ROWS - 1][0] = '+';
    grid[ROWS - 1][COLS - 1] = '+';
  }

  function renderGrid() {
    canvasDisplay.textContent = grid.map(row => row.join('')).join('\n');
  }

  function drawRectangle() {
    clearGrid();
    for (let r = 2; r <= 7; r++) {
      for (let c = 8; c <= 28; c++) {
        if (r === 2 || r === 7 || c === 8 || c === 28) {
          grid[r][c] = '#';
        }
      }
    }
    renderGrid();
  }

  function drawCircle() {
    clearGrid();
    const cx = 18, cy = 5, rx = 9, ry = 3.5;
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const val = Math.pow((c - cx) / rx, 2) + Math.pow((r - cy) / ry, 2);
        if (val >= 0.7 && val <= 1.3) {
          grid[r][c] = '*';
        }
      }
    }
    renderGrid();
  }

  function drawLine() {
    clearGrid();
    for (let i = 0; i < 7; i++) {
      grid[2 + i][5 + i * 4] = '/';
      grid[2 + i][6 + i * 4] = '/';
    }
    renderGrid();
  }

  function drawBox() {
    clearGrid();
    // Filled 3D-styled box
    for (let r = 2; r <= 6; r++) {
      for (let c = 12; c <= 24; c++) {
        grid[r][c] = 'X';
      }
    }
    renderGrid();
  }

  function drawGreeting() {
    clearGrid();
    const msg = "C 2D GRAPHICS EDITOR [60x25]";
    const startCol = Math.max(2, Math.floor((COLS - msg.length) / 2));
    for (let i = 0; i < msg.length; i++) {
      grid[3][startCol + i] = msg[i];
    }
    const sub = ">> READY FOR INPUT <<";
    const subCol = Math.max(2, Math.floor((COLS - sub.length) / 2));
    for (let i = 0; i < sub.length; i++) {
      grid[5][subCol + i] = sub[i];
    }
    renderGrid();
  }

  // Initial render
  drawGreeting();

  controlButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controlButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const action = btn.getAttribute('data-sim-action');
      switch (action) {
        case 'rect':
          drawRectangle();
          break;
        case 'circle':
          drawCircle();
          break;
        case 'line':
          drawLine();
          break;
        case 'box':
          drawBox();
          break;
        case 'clear':
          clearGrid();
          renderGrid();
          break;
        case 'save':
          showToast('Canvas state saved to virtual memory (buffer.dat)!');
          break;
        default:
          drawGreeting();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Clipboard & Contact Form Handling
   -------------------------------------------------------------------------- */
function initClipboardAndContact() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailVal = 'Adithyavijaykumar09@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailVal).then(() => {
        showToast('Email copied to clipboard: ' + emailVal);
      }).catch(() => {
        showToast('Email: ' + emailVal);
      });
    });
  }

  // Contact Form Submission Mock / Mailto redirect
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Generate mailto link
      const mailtoUri = `mailto:Adithyavijaykumar09@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      
      showToast('Opening email client to reach Adithya...');
      setTimeout(() => {
        window.location.href = mailtoUri;
      }, 500);

      contactForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   10. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
