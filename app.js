/**
 * Saksham Kannojia — Portfolio Application Logic
 * Interactive Features • Ambient Canvas • Terminal CLI • Project Modals & Simulations
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initCursorGlow();
  initTypewriter();
  initNavbarScroll();
  initMobileNav();
  initProjectFilters();
  initCopyEmail();
  initTerminal();
});

/* ==========================================================================
   1. Ambient Interactive Canvas (Neural Constellation Effect)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.color = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(203, 213, 225, 0.22)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = 1 - dist / 110;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
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
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Cursor Glow Follower
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function update() {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(update);
  }
  update();
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const words = [
    'Prompt Engineering & LLM Pipelines',
    'B.Tech CSE Student & Software Builder',
    'Few-Shot & In-Context Learning',
    'Next.js 16 & TypeScript Architectures',
    'Cinematic Visual Media @skeditz.fx'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      speed = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      speed = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      speed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400; // Pause before typing next word
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   4. Navbar Scroll & Active Link Tracking
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   5. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = card.classList.contains('featured-project') ? 'grid' : 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Toast Notifications & Email Copy
   ========================================================================== */
function showToast(message, duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#34d399" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard!`);
  }).catch(() => {
    showToast(`Could not copy: ${text}`);
  });
}

function initCopyEmail() {
  const copyBtn = document.getElementById('hero-copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'skeditz1607@gmail.com';
      copyToClipboard(email);
    });
  }
}

/* ==========================================================================
   7. Project Detailed Data & Modal Renderer
   ========================================================================== */
const PROJECTS_DATA = {
  creatorflow: {
    title: 'CreatorFlow AI — Social Content Workspace & Script Studio',
    tagline: 'AI-Powered SaaS Platform for Generating, Personalizing, and Managing Social Media',
    category: 'Full-Stack SaaS / AI Systems',
    status: 'Production Architecture',
    image: 'assets/creatorflow.jpg',
    github: 'https://github.com/SakshamKannojia/creatorflow-ai',
    description: `CreatorFlow AI is an enterprise-grade content workspace tailored for high-volume creators and modern media brands. By eliminating generic AI phrasing, CreatorFlow leverages a proprietary linguistic analyzer ("Content DNA") that learns the cadence, emoji frequencies, idioms, and hook formulas of individual creators.`,
    architecture: `creatorflow-ai/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx       # 9-section marketing funnel
│   │   ├── api/
│   │   │   ├── generate/route.ts      # Gemini JSON schema generation handler
│   │   │   ├── rewrite/route.ts       # 10 stylistic adapter pipelines
│   │   │   └── content-dna/route.ts   # Linguistic trait extraction
│   │   ├── dashboard/page.tsx         # Analytical hub & quick actions
│   │   ├── generate/page.tsx          # Real-time script & hook creator
│   │   ├── library/page.tsx           # Search, filter, batch actions
│   │   └── calendar/page.tsx          # Interactive monthly schedule
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── generator.ts           # Gemini 1.5 Flash client + Zod parser
│   │   │   └── prompts.ts             # Dynamic DNA compiler
│   │   └── supabase/                  # Server & Client RLS handlers
└── supabase/
    └── schema.sql                     # Postgres tables & RLS security`,
    features: [
      {
        title: 'Content DNA Linguistic Profiler',
        desc: 'Analyzes 3-10 creator samples using Google Gemini to capture sentence rhythm, hook structures, and vocabulary preferences, injecting traits seamlessly into every generation.'
      },
      {
        title: 'Production-Ready Reel Script Generator',
        desc: 'Outputs shooting blueprints for 15s, 30s, and 60s formats with 3-second hook formulas, scene-by-scene camera directions, voiceover teleprompter cues, and B-roll suggestions.'
      },
      {
        title: '1-Click Multi-Adapter Rewriter',
        desc: 'Transforms text with 10 distinct stylistic presets: "Make Shorter", "Improve Hook", "Cinematic", "Gen-Z", "Convert to Hinglish", and "LinkedIn Authority" with side-by-side diff previews.'
      },
      {
        title: 'Supabase PostgreSQL Security & RLS',
        desc: 'Comprehensive database security architecture where creators strictly select, insert, and modify their isolated records with Row Level Security policies.'
      }
    ],
    tech: ['Next.js 16', 'TypeScript', 'Google Gemini 1.5', 'Supabase (PostgreSQL)', 'Tailwind CSS', 'Zod', 'Lucide React']
  },

  intellinses: {
    title: 'Intellinses — Neural AI Platform & Interactive Parallax Showcase',
    tagline: 'Futuristic Cybernetic Landing Page with Immersive Multi-Layer Motion',
    category: 'Frontend Engineering & Creative Tech',
    status: 'Interactive Web Experience',
    image: 'assets/intellinses.jpg',
    github: 'https://github.com/SakshamKannojia/Intellinses',
    description: `Intellinses is a visually arresting, dark-themed AI web showcase designed around futuristic neural interfaces. Built with React 18, Vite, and react-just-parallax, it features frictionless scroll-locking transitions, dynamic holographic cards, and responsive glassmorphic viewports.`,
    architecture: `Intellinses/
├── src/
│   ├── components/
│   │   ├── Hero.jsx           # Parallax neural brain visual & CTA
│   │   ├── Features.jsx       # Glassmorphism cybernetic feature grid
│   │   ├── Collaboration.jsx  # Interactive rotating orbital tech ring
│   │   └── Services.jsx       # Live AI media transformation showcase
│   ├── assets/                # Futuristic SVG graphics & neural assets
│   ├── App.jsx                # Layout & smooth scroll controller
│   └── index.css              # Custom cyber dark design system
├── vite.config.js             # High performance ESM bundling
└── tailwind.config.js         # Custom neon color scales & tokens`,
    features: [
      {
        title: 'Multi-Layer Parallax Physics',
        desc: 'Custom motion curves that react dynamically to user scrolling and cursor movements without degrading frame rates.'
      },
      {
        title: 'Dark Cyber Glassmorphism',
        desc: 'Layered backdrop filters, neon border gradients, and holographic lighting effects inspired by high-end design awards.'
      },
      {
        title: 'Optimized Vite Pipeline',
        desc: 'Sub-second Hot Module Replacement (HMR) and optimized static asset chunking for lightning-fast delivery.'
      },
      {
        title: 'Responsive Fluid Grid',
        desc: 'Pixel-perfect responsiveness across mobile devices, high-DPI displays, and ultra-wide desktop monitors.'
      }
    ],
    tech: ['React 18', 'Vite', 'React-Just-Parallax', 'Tailwind CSS', 'Scroll-Lock', 'ES6+']
  },

  realestate: {
    title: 'Oakwood Residences — Architectural Property Showcase',
    tagline: 'Luxury Real Estate Discovery Portal & Architectural Web Interface',
    category: 'Frontend Architecture & UI Design',
    status: 'Curated Showcase',
    image: 'assets/realestate.jpg',
    github: 'https://github.com/SakshamKannojia/Real-Estate',
    description: `A bespoke real estate web application built to showcase modern architectural estates. Incorporates refined typography (Montserrat), editorial-quality imagery layouts, custom CSS grid systems, and intuitive property inspection controls.`,
    architecture: `Real-Estate/
├── index.html        # Semantic HTML5 document & property listings
├── style.css         # Custom layout architecture, flexbox & grid
└── assets/           # High-resolution architectural photography`,
    features: [
      {
        title: 'Curated Luxury Listings',
        desc: 'Showcases luxury estates with detail specs (Beds, Baths, Square Footage, and Site Acreage) in modern visual cards.'
      },
      {
        title: 'Pure Vanilla CSS Engineering',
        desc: 'Zero external CSS bloat—crafted with native CSS variables, responsive fluid typography, and clean flexbox alignment.'
      },
      {
        title: 'Editorial Visual Layout',
        desc: 'Features full-bleed hero banners, floating luxury specification cards, and interactive gallery views.'
      }
    ],
    tech: ['HTML5', 'CSS3 Layout Systems', 'Responsive Design', 'Montserrat Typography']
  },

  calorie: {
    title: 'Daily Calorie Tracker — Nutrition CLI Utility',
    tagline: 'Automated Caloric Summation & Dietary Threshold CLI Engine in Python',
    category: 'Python & Systems Tooling',
    status: 'CLI Tool',
    image: null,
    github: 'https://github.com/SakshamKannojia/Calorie_tracker',
    description: `A fast, lightweight Python CLI tool engineered to log meals, calculate nutritional totals, track averages per meal, and evaluate dietary thresholds against healthy daily benchmarks with automated alerts.`,
    architecture: `Calorie_tracker/
└── Calorie_tracker.py    # Core interactive CLI loop, data collection & analytics`,
    features: [
      {
        title: 'Dynamic Meal Intake Logging',
        desc: 'Interactive command-line prompts allowing users to log arbitrary numbers of meals with corresponding caloric values.'
      },
      {
        title: 'Nutritional Computation Engine',
        desc: 'Calculates total caloric intake, daily average per meal, and percentage deviations from recommended dietary limits.'
      },
      {
        title: 'Automated Health Alerts',
        desc: 'Evaluates intake against healthy caloric boundaries and outputs intelligent warnings when thresholds are exceeded.'
      }
    ],
    tech: ['Python 3', 'Data Structures', 'CLI UX', 'Algorithmic Calculation']
  },

  quiz: {
    title: 'Dynamic Quiz Engine — Real-Time Assessment App',
    tagline: 'Interactive Knowledge Testing Engine with Real-Time State Evaluation',
    category: 'Vanilla JavaScript Web App',
    status: 'Interactive Web App',
    image: null,
    github: 'https://github.com/SakshamKannojia/Quiz-Game',
    description: `A pure JavaScript web application designed for fast, gamified knowledge testing. Featuring an event-driven DOM state engine, instantaneous answer validation, animated transitions between questions, and final score breakdowns.`,
    architecture: `Quiz-Game/
├── new.html           # Document structure & viewport setup
├── assignment 4.js    # Questions array, DOM rendering & scoring loops
└── README.md          # Documentation & usage`,
    features: [
      {
        title: 'Event-Driven DOM Rendering',
        desc: 'Dynamically updates questions and answer choices in the DOM without requiring page reloads.'
      },
      {
        title: 'Real-Time Score Computation',
        desc: 'Instantly tracks correct answers, calculates percentages, and generates performance feedback.'
      },
      {
        title: 'Custom CSS Transitions',
        desc: 'Interactive hover states and feedback animations on selecting correct or incorrect answers.'
      }
    ],
    tech: ['JavaScript (ES6+)', 'DOM API', 'State Management', 'Vanilla CSS']
  }
};

function openProjectModal(projectId) {
  const data = PROJECTS_DATA[projectId];
  if (!data) return;

  const container = document.getElementById('modal-content-container');
  const modal = document.getElementById('project-modal');

  const techBadges = data.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('');
  const featuresHtml = data.features
    .map(
      (f) => `
    <div class="modal-feature-card">
      <strong>${f.title}</strong>
      <p>${f.desc}</p>
    </div>
  `
    )
    .join('');

  const imageHtml = data.image
    ? `<div class="modal-image-showcase"><img src="${data.image}" alt="${data.title}"></div>`
    : '';

  const demoButton = (projectId === 'creatorflow' || projectId === 'calorie' || projectId === 'quiz')
    ? `<button class="btn-card-demo" onclick="closeProjectModal(); openInteractiveDemo('${projectId}')">Try Live Simulator ⚡</button>`
    : '';

  container.innerHTML = `
    <div class="modal-header-hero">
      <div class="modal-badge-row">
        <span class="badge-tag">${data.category}</span>
        <span class="badge-flagship">${data.status}</span>
      </div>
      <h2 class="modal-title" id="modal-project-title">${data.title}</h2>
      <p class="modal-tagline">${data.tagline}</p>
    </div>

    ${imageHtml}

    <div class="modal-section-block">
      <h3 class="modal-section-title">Overview & Philosophy</h3>
      <p class="about-text">${data.description}</p>
    </div>

    <div class="modal-section-block">
      <h3 class="modal-section-title">Architectural Structure & File Hierarchy</h3>
      <pre class="architecture-box"><code>${data.architecture}</code></pre>
    </div>

    <div class="modal-section-block">
      <h3 class="modal-section-title">Key Engineering Capabilities</h3>
      <div class="modal-features-list">
        ${featuresHtml}
      </div>
    </div>

    <div class="modal-section-block">
      <h3 class="modal-section-title">Technologies Used</h3>
      <div class="tech-tags">${techBadges}</div>
    </div>

    <div class="modal-actions-row">
      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary">
        <span>View Code on GitHub</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      ${demoButton}
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'project-modal') {
    closeProjectModal();
  }
}

/* ==========================================================================
   8. In-Browser Interactive Project Demonstrations
   ========================================================================== */
function openInteractiveDemo(projectId) {
  const container = document.getElementById('demo-content-container');
  const modal = document.getElementById('demo-modal');

  if (projectId === 'creatorflow') {
    container.innerHTML = `
      <div class="demo-header">
        <span class="badge-flagship">⚡ CREATORFLOW AI SIMULATION</span>
        <h3 class="demo-title">AI Reel Script & Teleprompter Generator</h3>
        <p class="demo-subtitle">Simulate CreatorFlow's prompt compilation and structured script generation engine.</p>
      </div>

      <div class="demo-body">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.35rem;">Content Topic / Hook Concept</label>
          <input type="text" id="sim-topic" class="form-input" value="Top 3 Habits of 10x Full-Stack Engineers" placeholder="e.g. 5 AI tools that feel illegal to know">
        </div>

        <div class="form-row" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.35rem;">Creator Tone</label>
            <select id="sim-tone" class="form-input select-input">
              <option value="Cinematic & Authoritative">Cinematic & Authoritative</option>
              <option value="Casual & High Energy">Casual & High Energy</option>
              <option value="Storytelling & Deep">Storytelling & Deep</option>
              <option value="Punchy Gen-Z">Punchy Gen-Z</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.35rem;">Format Length</label>
            <select id="sim-length" class="form-input select-input">
              <option value="30s Reel">30s Short-Form Reel</option>
              <option value="15s Viral Hook">15s Fast Viral Hook</option>
              <option value="60s Deep Dive">60s Tutorial Breakdown</option>
            </select>
          </div>
        </div>

        <button class="btn-primary w-full" id="sim-generate-btn" onclick="runCreatorFlowSimulation()">
          <span>Generate Script Blueprint</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </button>

        <div id="sim-output" style="margin-top: 1.25rem; display: none;">
          <!-- Generated output here -->
        </div>
      </div>
    `;
  } else if (projectId === 'calorie') {
    container.innerHTML = `
      <div class="demo-header">
        <span class="badge-tag">PYTHON CLI RUNNER</span>
        <h3 class="demo-title">Daily Calorie Nutrition Calculator</h3>
        <p class="demo-subtitle">Simulate the Python Calorie_tracker.py logic directly in your browser.</p>
      </div>

      <div class="demo-body">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <input type="text" id="meal-name" class="form-input" placeholder="Meal Name (e.g. Protein Oatmeal)" style="flex: 2;">
          <input type="number" id="meal-cal" class="form-input" placeholder="Calories (e.g. 450)" style="flex: 1;">
          <button class="btn-primary" onclick="addCalorieMeal()" style="padding: 0.75rem 1.2rem;">Add</button>
        </div>

        <div id="meal-list" style="background: rgba(0,0,0,0.4); padding: 0.85rem; border-radius: 8px; margin-bottom: 1rem; min-height: 80px; font-family: var(--font-mono); font-size: 0.85rem;">
          <div style="color: #64748b;">No meals added yet. Add your meals above to compute daily totals!</div>
        </div>

        <div id="calorie-results" style="display: none; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: #34d399;">
        </div>
      </div>
    `;
  } else if (projectId === 'quiz') {
    container.innerHTML = `
      <div class="demo-header">
        <span class="badge-tag">INTERACTIVE JS ENGINE</span>
        <h3 class="demo-title">Dynamic Web Engineering Quiz</h3>
        <p class="demo-subtitle">Test your knowledge with this interactive vanilla JS quiz engine.</p>
      </div>

      <div class="demo-body" id="quiz-runner-body">
        <div id="quiz-question-box">
          <div style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.85rem; margin-bottom: 0.5rem;">Question 1 of 3</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 1rem; color: #fff;">In Next.js App Router, which directory file handles server-side API requests?</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="quiz-options">
            <button class="btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="answerQuiz(0, false)">A) api.js in pages root</button>
            <button class="btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="answerQuiz(0, true)">B) route.ts (Route Handler) ✓</button>
            <button class="btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="answerQuiz(0, false)">C) server.config.mjs</button>
          </div>
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function handleDemoBackdropClick(e) {
  if (e.target.id === 'demo-modal') {
    closeDemoModal();
  }
}

// CreatorFlow Interactive Simulation
function runCreatorFlowSimulation() {
  const topic = document.getElementById('sim-topic').value || '10x Software Engineering Habits';
  const tone = document.getElementById('sim-tone').value;
  const length = document.getElementById('sim-length').value;
  const output = document.getElementById('sim-output');
  const btn = document.getElementById('sim-generate-btn');

  btn.innerHTML = `<span>Compiling Content DNA & Generating...</span>`;
  btn.disabled = true;

  setTimeout(() => {
    output.style.display = 'block';
    output.innerHTML = `
      <div style="background: #090b14; border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 12px; padding: 1.25rem; font-family: var(--font-mono); font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem;">
          <span style="color: #c084fc; font-weight: 700;">PROMPT COMPILED: ${tone.toUpperCase()}</span>
          <span style="color: #38bdf8;">${length}</span>
        </div>
        
        <div style="margin-bottom: 0.85rem;">
          <div style="color: #f43f5e; font-weight: 700;">[0:00 - 0:03] 3-SECOND SCROLL STOPPING HOOK:</div>
          <div style="color: #f8fafc; margin-top: 0.2rem;">"Most developers spend 80% of their time on things AI does in 3 seconds. Stop doing this:"</div>
        </div>

        <div style="margin-bottom: 0.85rem;">
          <div style="color: #38bdf8; font-weight: 700;">[0:04 - 0:18] SCENE 1: TELEPROMPTER & CAMERA CUES:</div>
          <div style="color: #cbd5e1; font-style: italic;">[Shot: Direct to camera, quick snap zoom. B-Roll overlay: Split-screen code editor & neural pipeline]</div>
          <div style="color: #f8fafc; margin-top: 0.2rem;">"Instead of writing repetitive boilerplate, we define strict TypeScript schemas and let generative routes output verified JSON models."</div>
        </div>

        <div style="margin-bottom: 0.85rem;">
          <div style="color: #34d399; font-weight: 700;">[0:19 - 0:28] SCENE 2: CTA & VALUE PAYOFF:</div>
          <div style="color: #f8fafc; margin-top: 0.2rem;">"Drop 'CODE' in the comments to get the complete repository architecture and Supabase RLS schema."</div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem; color: #a78bfa; font-size: 0.78rem;">
          #SoftwareEngineering #Nextjs #FullStack #AIEngineering #DeveloperLife
        </div>
      </div>
    `;
    btn.innerHTML = `<span>Generate Another Blueprint</span>`;
    btn.disabled = false;
  }, 750);
}

// Calorie Tracker simulation variables
let loggedMeals = [];
function addCalorieMeal() {
  const nameInput = document.getElementById('meal-name');
  const calInput = document.getElementById('meal-cal');
  const name = nameInput.value.trim();
  const cal = parseFloat(calInput.value);

  if (!name || isNaN(cal) || cal <= 0) {
    showToast('Please enter a valid meal name and calorie count.');
    return;
  }

  loggedMeals.push({ name, cal });
  nameInput.value = '';
  calInput.value = '';

  renderMealList();
}

function renderMealList() {
  const container = document.getElementById('meal-list');
  const results = document.getElementById('calorie-results');

  if (loggedMeals.length === 0) {
    container.innerHTML = `<div style="color: #64748b;">No meals added yet.</div>`;
    results.style.display = 'none';
    return;
  }

  let total = 0;
  let html = '';
  loggedMeals.forEach((m, idx) => {
    total += m.cal;
    html += `<div style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <span>${idx + 1}. ${m.name}</span>
      <span style="color: #38bdf8;">${m.cal} kcal</span>
    </div>`;
  });

  container.innerHTML = html;

  const avg = (total / loggedMeals.length).toFixed(1);
  const status = total > 2500 ? '⚠️ HIGH (Above daily 2500 kcal benchmark)' : '✓ OPTIMAL (Within balanced dietary range)';

  results.style.display = 'block';
  results.innerHTML = `
    <div><strong>TOTAL INTAKE:</strong> ${total} kcal across ${loggedMeals.length} meal(s)</div>
    <div><strong>AVERAGE / MEAL:</strong> ${avg} kcal</div>
    <div style="margin-top: 0.35rem; color: ${total > 2500 ? '#f59e0b' : '#34d399'};"><strong>STATUS:</strong> ${status}</div>
  `;
}

// Dynamic Quiz runner logic
let quizStep = 0;
let quizScore = 0;
const quizQuestions = [
  {
    q: 'In Next.js App Router, which file convention handles server-side API endpoints?',
    options: ['api.js in pages directory', 'route.ts (Route Handler)', 'server.config.mjs'],
    correct: 1
  },
  {
    q: 'What is Supabase RLS (Row Level Security) used for?',
    options: ['Limiting query results by user id directly in PostgreSQL', 'Compressing media files', 'Styling React buttons'],
    correct: 0
  },
  {
    q: 'What does Saksham combine with software engineering on @skeditz.fx?',
    options: ['Video editing, color science & visual storytelling', '3D CAD printing', 'Quantum mechanics'],
    correct: 0
  }
];

function answerQuiz(qIndex, isCorrect) {
  if (isCorrect) quizScore++;
  quizStep++;

  const body = document.getElementById('quiz-runner-body');

  if (quizStep < quizQuestions.length) {
    const nextQ = quizQuestions[quizStep];
    body.innerHTML = `
      <div id="quiz-question-box">
        <div style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.85rem; margin-bottom: 0.5rem;">Question ${quizStep + 1} of ${quizQuestions.length}</div>
        <h4 style="font-size: 1.15rem; margin-bottom: 1rem; color: #fff;">${nextQ.q}</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${nextQ.options
            .map(
              (opt, idx) => `
            <button class="btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="answerQuiz(${quizStep}, ${idx === nextQ.correct})">
              ${opt}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <span style="font-size: 3rem;">🎉</span>
        <h4 style="font-size: 1.5rem; margin: 0.5rem 0; color: #fff;">Quiz Complete!</h4>
        <p style="font-size: 1.1rem; color: #34d399; font-family: var(--font-mono); margin-bottom: 1.5rem;">
          You scored ${quizScore} out of ${quizQuestions.length}!
        </p>
        <button class="btn-primary" onclick="quizStep = 0; quizScore = 0; openInteractiveDemo('quiz')">Retake Quiz</button>
      </div>
    `;
  }
}

/* ==========================================================================
   9. Developer Interactive Terminal (CLI)
   ========================================================================== */
function initTerminal() {
  const terminalBtn = document.getElementById('terminal-toggle-btn');
  const terminalOverlay = document.getElementById('interactive-terminal');
  const termInput = document.getElementById('terminal-input');

  if (terminalBtn) {
    terminalBtn.addEventListener('click', () => {
      terminalOverlay.classList.remove('hidden');
      termInput.focus();
    });
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        if (cmd) {
          executeCommand(cmd);
          termInput.value = '';
        }
      }
    });
  }
}

function closeTerminal() {
  const terminalOverlay = document.getElementById('interactive-terminal');
  if (terminalOverlay) {
    terminalOverlay.classList.add('hidden');
  }
}

function runTermCommand(cmd) {
  executeCommand(cmd);
  const termInput = document.getElementById('terminal-input');
  if (termInput) termInput.focus();
}

function executeCommand(rawCmd) {
  const output = document.getElementById('terminal-output');
  const cmd = rawCmd.trim();

  // Print command line
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line';
  cmdLine.innerHTML = `<span class="term-prompt">saksham.dev ❯</span> <span class="term-cyan">${escapeHtml(cmd)}</span>`;
  output.appendChild(cmdLine);

  const responseLine = document.createElement('div');
  responseLine.className = 'terminal-line';

  switch (cmd) {
    case 'help':
      responseLine.innerHTML = `
        <span class="term-amber">Available Developer Commands:</span><br>
        &nbsp;&nbsp;<span class="term-cyan">projects</span> &nbsp;&nbsp;&nbsp;&nbsp;List all GitHub projects & repositories<br>
        &nbsp;&nbsp;<span class="term-cyan">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print technical stack & arsenal<br>
        &nbsp;&nbsp;<span class="term-cyan">about</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Display Saksham's background & philosophy<br>
        &nbsp;&nbsp;<span class="term-cyan">socials</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Direct links (Email, GitHub, Instagram)<br>
        &nbsp;&nbsp;<span class="term-cyan">creatorflow</span> &nbsp;Inspect flagship CreatorFlow AI architecture<br>
        &nbsp;&nbsp;<span class="term-cyan">whoami</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Curious explorer investigating talent<br>
        &nbsp;&nbsp;<span class="term-cyan">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear terminal buffer
      `;
      break;

    case 'projects':
      responseLine.innerHTML = `
        <span class="term-green">★ Saksham's GitHub Repositories:</span><br>
        1. <span class="term-cyan">creatorflow-ai</span> [TypeScript/Next.js 16/Gemini] - AI Content Workspace & SaaS<br>
        2. <span class="term-cyan">Intellinses</span> [React 18/Vite/Tailwind] - Neural AI Parallax Web Platform<br>
        3. <span class="term-cyan">Calorie_tracker</span> [Python 3] - CLI Nutrition Tracker & Computation<br>
        4. <span class="term-cyan">Real-Estate</span> [HTML5/CSS3] - Architectural Luxury Property Portal<br>
        5. <span class="term-cyan">Quiz-Game</span> [JavaScript] - Dynamic Event-Driven Quiz Engine<br>
        6. <span class="term-cyan">@skeditz.fx</span> [Creative Direction] - Cinematic Video Production
      `;
      break;

    case 'skills':
      responseLine.innerHTML = `
        <span class="term-amber">Technical Arsenal:</span><br>
        • <span class="term-cyan">GenAI & Prompting:</span> Prompt Engineering, Few-Shot Learning, In-Context Calibration, Structured JSON (Zod), Gemini 1.5<br>
        • <span class="term-cyan">CSE Core:</span> Data Structures, Algorithms, OOP, Database Systems<br>
        • <span class="term-purple">Full-Stack:</span> Next.js 16, TypeScript, React 18, Node.js, Supabase (PostgreSQL RLS)<br>
        • <span class="term-amber">Creative Suite:</span> Adobe Premiere Pro, After Effects, Photoshop, Lightroom
      `;
      break;

    case 'about':
      responseLine.innerHTML = `
        <span class="term-purple">Saksham Kannojia:</span> B.Tech Computer Science & Engineering student.<br>
        Currently specializing in <strong>Prompt Engineering</strong> & Generative AI workflows, combined with full-stack web engineering and cinematic visual media (@skeditz.fx).
      `;
      break;

    case 'socials':
    case 'contact':
      responseLine.innerHTML = `
        • Email: <a href="mailto:skeditz1607@gmail.com" class="text-link">skeditz1607@gmail.com</a><br>
        • GitHub: <a href="https://github.com/SakshamKannojia" target="_blank" class="text-link">github.com/SakshamKannojia</a><br>
        • Instagram: <a href="https://instagram.com/skeditz.fx" target="_blank" class="text-link">@skeditz.fx</a>
      `;
      break;

    case 'creatorflow':
      responseLine.innerHTML = `
        <span class="term-green">CreatorFlow AI SaaS Highlights:</span><br>
        - App Router & Server Actions in Next.js 16<br>
        - Google Gemini 1.5 Flash/Pro with JSON mime-type validation<br>
        - Content DNA Linguistic profiler for creators<br>
        - Supabase PostgreSQL with strict Row Level Security (RLS)<br>
        - Interactive Content Calendar & 10 stylistic rewrites
      `;
      break;

    case 'whoami':
      responseLine.innerHTML = `
        <span class="term-cyan">You are an esteemed recruiter, engineering lead, or fellow builder visiting Saksham's portfolio. Glad to have you here!</span>
      `;
      break;

    case 'clear':
      output.innerHTML = '';
      return;

    default:
      responseLine.innerHTML = `<span style="color: #ef4444;">Command not found: "${escapeHtml(cmd)}". Type <span class="term-cyan">'help'</span> for a list of commands.</span>`;
  }

  output.appendChild(responseLine);
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

/* ==========================================================================
   10. Contact Form Submission Handler
   ========================================================================== */
function handleContactSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value.trim();
  const btn = document.getElementById('contact-submit-btn');

  if (!name || !email || !message) {
    showToast('Please fill out all required fields.');
    return;
  }

  btn.innerHTML = `<span>Sending Dispatch...</span>`;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `<span>Message Sent Successfully ✓</span>`;
    showToast(`Thank you, ${name}! Your message regarding "${subject}" has been noted.`);
    
    // Reset form after short delay
    setTimeout(() => {
      document.getElementById('contact-form').reset();
      btn.innerHTML = `
        <span>Send Message</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
      btn.disabled = false;
    }, 2500);
  }, 900);
}
