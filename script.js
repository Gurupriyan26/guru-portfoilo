/**
 * GURUPRIYAN K — PORTFOLIO SCRIPT ENGINE
 * Handles Canvas Particles, Typing Effect, Interactivity, Modals & TN Sandbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initScrollAnimations();
  initSkillsFilter();
  initModals();
  initNavigation();
  initCopyButtons();
  initFooterYear();
});

function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   1. PARTICLE CANVAS ANIMATION
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
  const connectionDistance = 140;

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.baseColor + '0.8)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPING ANIMATION EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Full-Stack Developer',
    'AI & ML Engineer',
    'Data Dashboard Architect',
    'YOLOv8 Vision Specialist',
    'Embedded IoT Builder'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. SCROLL ANIMATIONS & STAT COUNTERS
   ========================================================================== */
function initScrollAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            animateCounter(stat, target, 1600);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats-grid');
  if (heroStats) statsObserver.observe(heroStats);

  function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }
}

/* ==========================================================================
   4. SKILLS FILTERING MATRIX
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillItems = document.querySelectorAll('.skill-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT MODALS & DEEP DIVES
   ========================================================================== */
function initModals() {
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeBtns = [
    document.getElementById('resume-btn'),
    document.getElementById('hero-resume-btn'),
    document.getElementById('mobile-resume-btn')
  ];
  const printResumeBtn = document.getElementById('print-resume-btn');

  const projectDetailsData = {
    vedasakthi: {
      title: 'State Education & Spatial Analytics Dashboard (Freelance Project)',
      image: 'assets/images/vedasakthi.jpg',
      category: 'Freelance Client Project & Spatial Analytics (2026)',
      stack: ['Freelance Contract', 'Next.js', 'Supabase (PostgreSQL)', 'Leaflet.js', 'Vercel', 'GitHub'],
      githubUrl: 'https://github.com/Gurupriyan26',
      liveUrl: 'https://github.com/Gurupriyan26',
      description: `
        A production-grade executive command view analytics dashboard engineered end-to-end under private freelance client contract to deliver comprehensive visibility into education and infrastructure performance across all 38 districts of Tamil Nadu.
      `,
      highlights: [
        '<strong>Full Geographic Coverage:</strong> Rebuilt a static client prototype into a live, highly responsive Next.js application spanning 38 districts, 413 blocks, and regional school data.',
        '<strong>Dynamic Choropleth Heatmap:</strong> Visualizes 8 key performance indicators (Green/Yellow/Red status thresholds) with custom Leaflet GeoJSON layer integration.',
        '<strong>3-Tier Drilldown Navigation:</strong> Intuitive exploration flow: State Level &rarr; District &rarr; Block &rarr; School data.',
        '<strong>Dataset Switcher:</strong> Live toggle between School Infrastructure metrics and TNTET candidate datasets.',
        '<strong>Milestone Delivery:</strong> Completed all 3 client milestones on schedule within a strict 20-day freelance build cycle.'
      ],
      architecture: `
        Normalized Supabase schema with PostgreSQL Row Level Security (RLS) &rarr; Next.js App Router for dynamic API rendering &rarr; Leaflet.js client visualization &rarr; Automated Vercel CI/CD.
      `
    },
    journey_guard: {
      title: 'JourneyGuard: AI Travel Safety & Telemetry Platform',
      image: 'assets/images/journey_guard.svg',
      category: 'AI / Computer Vision & IoT Safety Architecture (2025–2026)',
      stack: ['Python', 'Computer Vision (OpenCV)', 'YOLOv8', 'IoT & GPS Telemetry', 'Next.js', 'Supabase', 'Twilio / SOS API'],
      githubUrl: 'https://github.com/Gurupriyan26',
      liveUrl: 'https://github.com/Gurupriyan26',
      description: `
        A comprehensive travel safety and accident prevention platform engineered to protect drivers and passengers. By continuously monitoring driver alertness through computer vision and analyzing real-time vehicle telemetry, JourneyGuard proactively mitigates road hazards and accelerates emergency response times during critical incidents.
      `,
      highlights: [
        '<strong>Real-Time Facial Landmark Analysis:</strong> Implemented Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) algorithms alongside custom YOLOv8 detection to identify micro-sleeps, fatigue, and mobile phone distractions.',
        '<strong>Low-Latency Edge Inference:</strong> Optimized vision models for edge execution ensuring sub-50ms alert latency directly inside the vehicle cabin.',
        '<strong>Geospatial Safety Fence & Live Tracking:</strong> Real-time GPS coordinate telemetry streaming to cloud database with geofencing and route deviation monitoring.',
        '<strong>Automated SOS Dispatch Protocol:</strong> In the event of critical impact or unresponsiveness, automatically broadcasts real-time GPS coordinates and driver status to emergency contacts and authorities.',
        '<strong>Fleet & Trip Analytics HUD:</strong> Centralized dashboard for historical driving performance scores, incident logs, and route hazard heatmaps.'
      ],
      architecture: `
        Camera Video Feed &rarr; OpenCV / YOLOv8 Landmark Pipeline &rarr; Edge Anomaly Alert Engine &rarr; GPS Telemetry &rarr; Supabase Real-Time Backend &rarr; Emergency SOS Webhook &rarr; Next.js Command Dashboard.
      `
    },
    robot: {
      title: 'Obstacle Avoiding Robot using Inverted Pendulum Method (IPM)',
      image: 'assets/images/robot.jpg',
      category: 'Embedded Systems & Robotics (Dec 2025 – Jan 2026)',
      stack: ['Arduino Nano', 'Embedded C', 'ML Algorithms (IPM)', 'Ultrasonic Sensors', 'Actuators'],
      githubUrl: 'https://github.com/Gurupriyan26',
      description: `
        An autonomous robotic navigation prototype powered by machine learning algorithms that implement the Inverted Pendulum Method (IPM) to compute obstacle avoidance paths in real time.
      `,
      highlights: [
        '<strong>Inverted Pendulum Method (IPM):</strong> Implemented mathematical deflection equations to forecast collision trajectories and adjust motor speeds instantly.',
        '<strong>Real-Time Hardware Interfacing:</strong> Integrated high-precision ultrasonic and infrared distance sensors with Arduino Nano.',
        '<strong>Embedded C Firmware:</strong> Engineered low-latency interrupt-driven sensor routines for sub-millisecond reaction times.',
        '<strong>Autonomous Decision Engine:</strong> Allows the robot to navigate dynamic, unfamiliar terrains without external intervention.'
      ],
      architecture: `
        Sensor Fusion Layer (Ultrasonic/IR) &rarr; Arduino Nano Microcontroller &rarr; IPM Trajectory Algorithm &rarr; L298N Dual Motor Driver &rarr; Real-Time Actuation.
      `
    },
    animal_detection: {
      title: 'Animal Detection System Using Computer Vision & YOLOv8',
      image: 'assets/images/animal_detection.jpg',
      category: 'Computer Vision & Deep Learning (Aug 2025 – Sep 2025)',
      stack: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'Model Evaluation', 'Surveillance'],
      githubUrl: 'https://github.com/Gurupriyan26',
      description: `
        An intelligent computer vision system trained to identify, classify, and track wild and domestic animals in high-resolution multi-camera surveillance feeds for safety and farm protection.
      `,
      highlights: [
        '<strong>YOLOv8 Deep Learning:</strong> Fine-tuned state-of-the-art YOLOv8 architecture on custom annotated image and video datasets.',
        '<strong>End-to-End Vision Pipeline:</strong> Built preprocessing scripts for frame extraction, normalization, augmentation, and bounding box validation.',
        '<strong>Real-Time Inference:</strong> Achieved high frames-per-second (FPS) detection with over 97% confidence accuracy.',
        '<strong>Safety Alerts:</strong> Designed detection triggers for perimeter breaches and agricultural wildlife encroachment.'
      ],
      architecture: `
        Video Stream Ingestion &rarr; OpenCV Frame Preprocessor &rarr; YOLOv8 PyTorch Inference &rarr; Bounding Box & Confidence Overlay &rarr; Alert Logging Engine.
      `
    }
  };

  // Open Project Modal
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projKey];
      if (!data) return;

      modalContent.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="modal-project-img" />
        <div class="project-category mb-2">${data.category}</div>
        <h2 class="section-title" style="font-size: 1.6rem; margin-bottom: 12px;">${data.title}</h2>
        
        <div class="modal-badge-row">
          ${data.stack.map((s) => `<span class="tech-tag">${s}</span>`).join('')}
        </div>

        <p class="res-text mb-4" style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">${data.description}</p>

        <h3 class="modal-section-title"><i class="fa-solid fa-list-check text-cyan"></i> Key Engineering Highlights</h3>
        <ul class="res-bullet-list" style="color: #cbd5e1; margin-bottom: 20px;">
          ${data.highlights.map((h) => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
        </ul>

        <h3 class="modal-section-title"><i class="fa-solid fa-network-wired text-indigo"></i> Architecture &amp; Data Pipeline</h3>
        <div style="background: rgba(0,0,0,0.4); padding: 14px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8; margin-bottom: 24px;">
          ${data.architecture}
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.08);">
          ${data.githubUrl ? `
            <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg" style="flex: 1; min-width: 200px; justify-content: center;">
              <i class="fa-brands fa-github"></i>
              <span>Review GitHub Repository</span>
            </a>
          ` : ''}
          ${data.liveUrl ? `
            <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="flex: 1; min-width: 200px; justify-content: center;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Live Project Demo / Vercel</span>
            </a>
          ` : ''}
        </div>
      `;

      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Project Modal
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Open Resume Modal
  resumeBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  // Close Resume Modal
  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close on Backdrop Click
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (e.target === resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModal.classList.remove('open');
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Print Resume
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}


/* ==========================================================================
   8. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-nav-close');
  const backToTop = document.getElementById('back-to-top');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Back to top smooth scroll
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Nav Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. COPY TO CLIPBOARD
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'info');
      });
    });
  });
}

/* ==========================================================================
   10. TOAST SYSTEM
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald' : 'fa-circle-info text-cyan'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
