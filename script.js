/**
 * GURUPRIYAN K — PORTFOLIO SCRIPT ENGINE
 * Handles Canvas Particles, Typing Effect, Interactivity, Modals & TN Sandbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initScrollAnimations();
  initSkillsFilter();
  initVedasakthiSandbox();
  initModals();
  initContactForm();
  initNavigation();
  initCopyButtons();
});

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
   5. VEDASAKTHI TAMIL NADU DATA SANDBOX SIMULATION
   ========================================================================== */
function initVedasakthiSandbox() {
  const districtData = {
    chennai: {
      name: 'Chennai District',
      score: '94.2%',
      status: 'Optimal Performance',
      statusClass: 'badge-status-good',
      barWidth: '94%',
      barGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      blocks: '16 Blocks',
      institutions: '842 Schools',
      kpis: ['94.2%', '91.8%', '88.5%', '1:24', '96.0%', '89.4%', '98.1%', '4,120']
    },
    coimbatore: {
      name: 'Coimbatore District',
      score: '93.5%',
      status: 'High Performance',
      statusClass: 'badge-status-good',
      barWidth: '93.5%',
      barGradient: 'linear-gradient(90deg, #10b981, #3b82f6)',
      blocks: '14 Blocks',
      institutions: '780 Schools',
      kpis: ['93.5%', '92.4%', '90.1%', '1:22', '94.5%', '91.2%', '96.8%', '3,890']
    },
    madurai: {
      name: 'Madurai District',
      score: '88.1%',
      status: 'High Performance',
      statusClass: 'badge-status-good',
      barWidth: '88.1%',
      barGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      blocks: '13 Blocks',
      institutions: '690 Schools',
      kpis: ['88.1%', '89.2%', '86.4%', '1:26', '91.0%', '87.5%', '95.0%', '3,420']
    },
    salem: {
      name: 'Salem District',
      score: '86.4%',
      status: 'Good Performance',
      statusClass: 'badge-status-good',
      barWidth: '86.4%',
      barGradient: 'linear-gradient(90deg, #10b981, #f59e0b)',
      blocks: '12 Blocks',
      institutions: '710 Schools',
      kpis: ['86.4%', '88.7%', '84.0%', '1:25', '89.2%', '86.1%', '93.4%', '3,110']
    },
    cuddalore: {
      name: 'Cuddalore District (Home)',
      score: '84.8%',
      status: 'Steady Progress',
      statusClass: 'badge-status-good',
      barWidth: '84.8%',
      barGradient: 'linear-gradient(90deg, #06b6d4, #10b981)',
      blocks: '11 Blocks',
      institutions: '580 Schools',
      kpis: ['84.8%', '87.5%', '83.2%', '1:27', '88.0%', '84.8%', '94.2%', '2,890']
    },
    tiruchirappalli: {
      name: 'Tiruchirappalli District',
      score: '89.0%',
      status: 'High Performance',
      statusClass: 'badge-status-good',
      barWidth: '89.0%',
      barGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      blocks: '12 Blocks',
      institutions: '640 Schools',
      kpis: ['89.0%', '90.1%', '87.9%', '1:23', '92.4%', '88.6%', '97.2%', '3,250']
    },
    thanjavur: {
      name: 'Thanjavur District',
      score: '83.2%',
      status: 'Moderate Progress',
      statusClass: 'badge-status-good',
      barWidth: '83.2%',
      barGradient: 'linear-gradient(90deg, #f59e0b, #10b981)',
      blocks: '10 Blocks',
      institutions: '520 Schools',
      kpis: ['83.2%', '86.4%', '81.5%', '1:28', '85.5%', '83.0%', '91.8%', '2,460']
    },
    tirunelveli: {
      name: 'Tirunelveli District',
      score: '85.7%',
      status: 'Good Performance',
      statusClass: 'badge-status-good',
      barWidth: '85.7%',
      barGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      blocks: '11 Blocks',
      institutions: '560 Schools',
      kpis: ['85.7%', '88.0%', '84.6%', '1:25', '88.9%', '86.0%', '93.5%', '2,680']
    },
    vellore: {
      name: 'Vellore District',
      score: '82.9%',
      status: 'Moderate Progress',
      statusClass: 'badge-status-good',
      barWidth: '82.9%',
      barGradient: 'linear-gradient(90deg, #f59e0b, #06b6d4)',
      blocks: '10 Blocks',
      institutions: '510 Schools',
      kpis: ['82.9%', '85.2%', '80.8%', '1:29', '84.0%', '82.4%', '90.5%', '2,390']
    },
    dharmapuri: {
      name: 'Dharmapuri District',
      score: '78.4%',
      status: 'Focus Area (Priority)',
      statusClass: 'badge-status-good',
      barWidth: '78.4%',
      barGradient: 'linear-gradient(90deg, #f59e0b, #ef4444)',
      blocks: '8 Blocks',
      institutions: '480 Schools',
      kpis: ['78.4%', '82.1%', '76.4%', '1:31', '79.2%', '78.0%', '88.4%', '2,140']
    },
    kanchipuram: {
      name: 'Kanchipuram District',
      score: '87.6%',
      status: 'High Performance',
      statusClass: 'badge-status-good',
      barWidth: '87.6%',
      barGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
      blocks: '11 Blocks',
      institutions: '620 Schools',
      kpis: ['87.6%', '89.8%', '86.1%', '1:24', '90.5%', '87.2%', '95.6%', '3,050']
    },
    tiruppur: {
      name: 'Tiruppur District',
      score: '91.0%',
      status: 'Optimal Performance',
      statusClass: 'badge-status-good',
      barWidth: '91.0%',
      barGradient: 'linear-gradient(90deg, #10b981, #3b82f6)',
      blocks: '12 Blocks',
      institutions: '650 Schools',
      kpis: ['91.0%', '91.2%', '88.7%', '1:23', '93.1%', '89.8%', '96.2%', '3,340']
    }
  };

  const chips = document.querySelectorAll('.district-chip');
  const districtNameEl = document.getElementById('map-district-name');
  const breadDistrictEl = document.getElementById('bread-district');
  const barFillEl = document.getElementById('heatmap-bar-fill');
  const quickScoreEl = document.getElementById('quick-score');
  const quickBlocksEl = document.getElementById('quick-blocks');
  const quickInstEl = document.getElementById('quick-institutions');

  let currentDataset = 'schools';

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const districtKey = chip.getAttribute('data-district');
      const data = districtData[districtKey];

      if (!data) return;

      // Update UI with smooth effect
      districtNameEl.textContent = data.name;
      if (breadDistrictEl) breadDistrictEl.textContent = data.name.replace(' District', '');
      quickScoreEl.textContent = data.score;
      quickBlocksEl.textContent = data.blocks;
      quickInstEl.textContent = data.institutions;

      barFillEl.style.width = data.barWidth;
      barFillEl.style.background = data.barGradient;

      // Update KPIs
      for (let i = 1; i <= 8; i++) {
        const kpiEl = document.getElementById(`kpi-${i}`);
        if (kpiEl && data.kpis[i - 1]) {
          kpiEl.textContent = data.kpis[i - 1];
        }
      }

      showToast(`Loaded ${data.name} analytics (${data.score})`, 'info');
    });
  });

  // Dataset Toggle (Schools vs TNTET)
  const schoolBtn = document.getElementById('dataset-schools');
  const tntetBtn = document.getElementById('dataset-tntet');

  if (schoolBtn && tntetBtn) {
    schoolBtn.addEventListener('click', () => {
      schoolBtn.classList.add('active');
      tntetBtn.classList.remove('active');
      currentDataset = 'schools';
      showToast('Switched to Schools & Infrastructure Dataset', 'success');
    });

    tntetBtn.addEventListener('click', () => {
      tntetBtn.classList.add('active');
      schoolBtn.classList.remove('active');
      currentDataset = 'tntet';
      showToast('Switched to TNTET Verified Candidates Dataset', 'success');
    });
  }
}

/* ==========================================================================
   6. PROJECT MODALS & DEEP DIVES
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
      title: 'Vedasakthi — Tamil Nadu Government Schools Education Dashboard',
      image: 'assets/images/vedasakthi.jpg',
      category: 'Gov-Tech & Data Analytics (2026)',
      stack: ['Next.js', 'Supabase (PostgreSQL)', 'Leaflet.js', 'Vercel', 'GitHub'],
      description: `
        A production-grade Minister's Command View analytics dashboard engineered end-to-end to deliver unprecedented visibility into the education performance of all 38 districts in Tamil Nadu.
      `,
      highlights: [
        '<strong>Full Geographic Coverage:</strong> Rebuilt a static prototype into a live, highly responsive Next.js application spanning 38 districts, 413 blocks, and thousands of government schools.',
        '<strong>Dynamic Choropleth Heatmap:</strong> Visualizes 8 key performance indicators (Green/Yellow/Red status thresholds) with custom Leaflet GeoJSON layer integration.',
        '<strong>3-Tier Drilldown Navigation:</strong> Intuitive exploration flow: State Level &rarr; District &rarr; Block &rarr; Individual School data.',
        '<strong>Dataset Switcher:</strong> Live toggle between School Infrastructure / Academic data and TNTET Candidate roster datasets.',
        '<strong>Rapid Delivery:</strong> Completed all 3 project milestones on schedule within a strict 20-day build cycle.'
      ],
      architecture: `
        Normalized Supabase schema with PostgreSQL Row Level Security (RLS) &rarr; Next.js App Router for dynamic API rendering &rarr; Leaflet.js client visualization &rarr; Automated Vercel CI/CD.
      `
    },
    robot: {
      title: 'Obstacle Avoiding Robot using Inverted Pendulum Method (IPM)',
      image: 'assets/images/robot.jpg',
      category: 'Embedded Systems & Robotics (Dec 2025 – Jan 2026)',
      stack: ['Arduino Nano', 'Embedded C', 'ML Algorithms (IPM)', 'Ultrasonic Sensors', 'Actuators'],
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
        <div style="background: rgba(0,0,0,0.4); padding: 14px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8;">
          ${data.architecture}
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
   7. CONTACT FORM & VALIDATION
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name Validation
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    } else {
      nameError.textContent = '';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    } else {
      emailError.textContent = '';
    }

    // Message Validation
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter a message.';
      isValid = false;
    } else {
      messageError.textContent = '';
    }

    if (isValid) {
      const subject = encodeURIComponent(`${subjectInput.value} — from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hi Gurupriyan,\n\n${messageInput.value.trim()}\n\nFrom: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}`
      );

      // Open mail client
      window.location.href = `mailto:gurupriyan828@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening your default email client...', 'success');
      form.reset();
    }
  });
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
