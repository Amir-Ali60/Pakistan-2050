/* ═══════════════════════════════════════════════════════════
   PAKISTAN 2050 — MAIN JAVASCRIPT
   Author: Amir Ali | Portfolio Project
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── STAR / PARTICLE CANVAS BACKGROUND ─────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], nebulas = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#a0d0ff', '#d0b0ff', '#a0ffcc'][Math.floor(Math.random() * 4)]
    };
  }

  function randomNebula() {
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.8,
      r: Math.random() * 300 + 100,
      color: ['rgba(0,200,255,0.03)', 'rgba(155,89,247,0.03)', 'rgba(0,255,157,0.02)'][Math.floor(Math.random() * 3)]
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: 200 }, randomStar);
    nebulas = Array.from({ length: 5 }, randomNebula);
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Draw nebulas
    nebulas.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw stars
    stars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinklePhase));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.r * 4;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Slow drift
      s.y -= s.speed * 0.1;
      if (s.y < -2) {
        s.y = H + 2;
        s.x = Math.random() * W;
      }
    });

    // Occasional shooting star
    if (frame % 300 === 0) shootingStar();

    requestAnimationFrame(draw);
  }

  function shootingStar() {
    const sx = Math.random() * W * 0.8;
    const sy = Math.random() * H * 0.4;
    const len = Math.random() * 120 + 60;
    const angle = Math.PI / 5;
    let progress = 0;

    function drawShooter() {
      if (progress > 1) return;
      ctx.save();
      ctx.globalAlpha = (1 - progress) * 0.9;
      const grad = ctx.createLinearGradient(
        sx + progress * len * Math.cos(angle) - len * 0.3 * Math.cos(angle),
        sy + progress * len * Math.sin(angle) - len * 0.3 * Math.sin(angle),
        sx + progress * len * Math.cos(angle),
        sy + progress * len * Math.sin(angle)
      );
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(200,230,255,0.9)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(
        sx + progress * len * Math.cos(angle) - len * 0.3 * Math.cos(angle),
        sy + progress * len * Math.sin(angle) - len * 0.3 * Math.sin(angle)
      );
      ctx.lineTo(
        sx + progress * len * Math.cos(angle),
        sy + progress * len * Math.sin(angle)
      );
      ctx.stroke();
      ctx.restore();
      progress += 0.04;
      requestAnimationFrame(drawShooter);
    }

    drawShooter();
  }

  window.addEventListener('resize', () => {
    resize();
    nebulas = Array.from({ length: 5 }, randomNebula);
  });

  init();
  draw();
})();

/* ─── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks ? navLinks.querySelectorAll('a') : [];

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('active');
      navLinks && navLinks.classList.remove('open');
    });
  });

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
})();

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter, .hstat-num');

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000)    return num.toLocaleString();
    return num.toString();
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = formatNumber(current);

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = formatNumber(target);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── PROGRESS BARS ──────────────────────────────────────── */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill, .energy-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        entry.target.style.width = target + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ─── ANIMATED BAR CHART ─────────────────────────────────── */
(function initBarChart() {
  const bars = document.querySelectorAll('.chart-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'scaleY(1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach((bar, i) => {
    bar.style.transitionDelay = (i * 0.15) + 's';
    observer.observe(bar);
  });
})();

/* ─── CONTACT FORM ───────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();

  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate async submit
  setTimeout(() => {
    success.style.display = 'block';
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg, var(--neon-green), #00aa66)';

    // Reset form values but keep success visible
    setTimeout(() => {
      e.target.reset();
    }, 1000);
  }, 1500);
}

/* ─── BACK TO TOP ────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── SMOOTH SCROLL FOR NAV LINKS ────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ─── CURSOR GLOW EFFECT ─────────────────────────────────── */
(function initCursorGlow() {
  // Only on desktop
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 1;
    transition: opacity 0.3s ease;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  })();
})();

/* ─── HERO STAT COUNTERS (on load) ──────────────────────── */
(function initHeroCounters() {
  const hstatNums = document.querySelectorAll('.hstat-num[data-target]');

  // Small delay then start
  setTimeout(() => {
    hstatNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 2500;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      }

      requestAnimationFrame(update);
    });
  }, 600);
})();

/* ─── TILT EFFECT ON CARDS ───────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.city-card, .about-card, .tl-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 6;
      const tiltY  = ((cx - x) / cx) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── TYPING EFFECT FOR HERO PRE TEXT ───────────────────── */
(function initTypingEffect() {
  const el = document.querySelector('.hero-pre');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '2px solid var(--neon-blue)';
  el.style.animation   = 'none';
  el.style.opacity     = '1';

  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 45);
    } else {
      // Blink cursor
      el.style.animation = 'blinkCaret 0.8s ease infinite';
      setTimeout(() => {
        el.style.borderRight = 'none';
        el.style.animation   = '';
      }, 3000);
    }
  }

  setTimeout(type, 300);
})();

/* ─── SECTION ACTIVE HIGHLIGHT ───────────────────────────── */
(function initSectionHighlight() {
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightActive() {
    const scrollY = window.scrollY + 150;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--neon-blue)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActive, { passive: true });
})();

/* ─── GALLERY ITEM CLICK MODAL ──────────────────────────── */
(function initGalleryInteraction() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      const caption = item.querySelector('.gallery-caption')?.textContent || '';

      // Create a simple overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.92);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; backdrop-filter: blur(12px);
        opacity: 0; transition: opacity 0.3s ease;
      `;

      const label = document.createElement('div');
      label.style.cssText = `
        font-family: 'Orbitron', monospace;
        color: #fff;
        font-size: clamp(1rem, 3vw, 1.8rem);
        text-align: center;
        padding: 24px;
        border: 1px solid rgba(0,200,255,0.3);
        border-radius: 12px;
        background: rgba(0,20,50,0.8);
        max-width: 500px;
      `;
      label.innerHTML = `
        <div style="color:var(--neon-blue); font-size: 3rem; margin-bottom: 16px;">🖼️</div>
        <p style="margin-bottom:8px;">${caption}</p>
        <small style="color:#666; font-family: 'Space Mono', monospace; font-size: 0.7rem;">[ CLICK TO CLOSE ]</small>
      `;

      overlay.appendChild(label);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

      overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      });
    });
  });
})();

/* ─── CONSOLE EASTER EGG ────────────────────────────────── */
console.log('%c\nپاکستان ۲۰۵۰\nPakistan 2050 — Vision for the Future\n\nBuilt by Amir Ali\ngithub.com/Amir-Ali60\n', `
  color: #00c8ff;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0,200,255,0.8);
`);
