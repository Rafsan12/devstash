/* ============================================================
   DevStash Homepage — script.js
   Chaos canvas animation, scroll effects, navbar, video showcase
   ============================================================ */

/* ── Navbar scroll opacity ─────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('nav-mobile-toggle');
  const menu   = document.getElementById('nav-mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }
})();

/* ── Scroll-based fade-in ──────────────────────────────────── */
(function initScrollFade() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Chaos Canvas Animation ────────────────────────────────── */
(function initChaos() {
  const canvas = document.getElementById('chaos-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Item type chips — real DevStash colors
  const TYPES = [
    { label: '.ts',     color: '#3b82f6', name: 'Snippet'  },
    { label: '.prompt', color: '#8b5cf6', name: 'Prompt'   },
    { label: '.sh',     color: '#f97316', name: 'Command'  },
    { label: '.md',     color: '#fde047', name: 'Note'     },
    { label: '.url',    color: '#10b981', name: 'Link'     },
    { label: '.txt',    color: '#6b7280', name: 'File'     },
    { label: '.png',    color: '#ec4899', name: 'Image'    },
  ];

  // Canvas sizing — responsive
  const CANVAS_W = 280;
  const CANVAS_H = 300;
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;

  // Sizing constants
  const CHIP_PAD_X    = 9;
  const CHIP_FONT     = '600 10px "JetBrains Mono", monospace';
  const CHIP_RADIUS   = 4;
  const MAX_SPEED     = 1.4;
  const DAMP          = 0.992;
  const REPEL_RADIUS  = 120;
  const REPEL_FORCE   = 0.28;

  // Mouse position relative to canvas
  const mouse = { x: -9999, y: -9999 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (CANVAS_W / rect.width);
    mouse.y = (e.clientY - rect.top)  * (CANVAS_H / rect.height);
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pre-measure chip widths
  ctx.font = CHIP_FONT;
  const chips = [];
  TYPES.forEach((type) => {
    const tw = ctx.measureText(type.label).width;
    const w  = tw + CHIP_PAD_X * 2;
    const h  = 22;

    // Create 2 of each type = 14 particles total
    for (let j = 0; j < 2; j++) {
      const margin = 10;
      chips.push({
        x:     margin + Math.random() * (CANVAS_W - w - margin * 2) + w / 2,
        y:     margin + Math.random() * (CANVAS_H - h - margin * 2) + h / 2,
        vx:    (Math.random() - 0.5) * 1.2,
        vy:    (Math.random() - 0.5) * 1.2,
        w,
        h,
        label: type.label,
        color: type.color,
      });
    }
  });

  function drawChip(p) {
    const x = p.x - p.w / 2;
    const y = p.y - p.h / 2;
    const r = CHIP_RADIUS;

    // Background fill (semi-transparent)
    ctx.fillStyle   = p.color + '18';
    ctx.strokeStyle = p.color + '70';
    ctx.lineWidth   = 1;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + p.w - r, y);
    ctx.quadraticCurveTo(x + p.w, y,         x + p.w, y + r);
    ctx.lineTo(x + p.w, y + p.h - r);
    ctx.quadraticCurveTo(x + p.w, y + p.h,   x + p.w - r, y + p.h);
    ctx.lineTo(x + r, y + p.h);
    ctx.quadraticCurveTo(x, y + p.h,         x, y + p.h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y,               x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Label text
    ctx.fillStyle    = p.color;
    ctx.font         = CHIP_FONT;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, p.x, p.y + 0.5);
  }

  function clampSpeed(p) {
    const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (spd > MAX_SPEED) {
      p.vx = (p.vx / spd) * MAX_SPEED;
      p.vy = (p.vy / spd) * MAX_SPEED;
    }
  }

  function tick() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Soft vignette
    const grad = ctx.createRadialGradient(
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.3,
      CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.75,
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    chips.forEach(p => {
      // Mouse repulsion
      const dx   = p.x - mouse.x;
      const dy   = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < REPEL_RADIUS) {
        const strength = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        p.vx += (dx / dist) * strength * REPEL_FORCE;
        p.vy += (dy / dist) * strength * REPEL_FORCE;
      }

      // Dampen
      p.vx *= DAMP;
      p.vy *= DAMP;

      // Clamp speed
      clampSpeed(p);

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      const hw = p.w / 2;
      const hh = p.h / 2;
      if (p.x - hw < 0)          { p.x = hw;             p.vx =  Math.abs(p.vx); }
      if (p.x + hw > CANVAS_W)   { p.x = CANVAS_W - hw;  p.vx = -Math.abs(p.vx); }
      if (p.y - hh < 0)          { p.y = hh;             p.vy =  Math.abs(p.vy); }
      if (p.y + hh > CANVAS_H)   { p.y = CANVAS_H - hh;  p.vy = -Math.abs(p.vy); }

      drawChip(p);
    });

    requestAnimationFrame(tick);
  }

  tick();
})();

/* ── Glass card: 3D tilt + parallax layers ─────────────────── */
(function initGlassCard() {
  const scene  = document.getElementById('glass-scene');
  const card   = document.getElementById('glass-card');
  const shine  = document.getElementById('glass-shine');
  if (!scene || !card) return;

  // Disable on mobile
  if (window.innerWidth <= 768) return;

  const MAX_TILT  = 12;     // degrees
  const LERP_T    = 0.09;   // smoothing — lower = more inertia

  // Layer depth multipliers (match data-depth in HTML)
  const layers = Array.from(card.querySelectorAll('[data-depth]')).map(el => ({
    el,
    depth: parseFloat(el.dataset.depth),
  }));

  // Current & target rotation state
  let tX = 0, tY = 0;  // target
  let cX = 0, cY = 0;  // current (lerped)
  let rafId = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function applyState() {
    // Card tilt
    card.style.transform =
      `perspective(1100px) rotateX(${cX.toFixed(3)}deg) rotateY(${cY.toFixed(3)}deg)`;

    // Specular shine — brighter toward the lit edge
    if (shine) {
      // Map rotation to a radial gradient position
      const sx = 50 + cY * 2.5;   // shift shine left/right with Y rotation
      const sy = 50 - cX * 2.5;   // shift shine up/down with X rotation
      const intensity = Math.min(0.18, 0.04 + (Math.abs(cX) + Math.abs(cY)) / MAX_TILT * 0.14);
      shine.style.background =
        `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,${intensity.toFixed(3)}) 0%, transparent 65%)`;
    }

    // Parallax layers — each depth factor controls how far they shift
    const rect = card.getBoundingClientRect();
    layers.forEach(({ el, depth }) => {
      // Shift opposite to tilt so content "floats" inside the glass
      const dx = -cY / MAX_TILT * depth * 12;
      const dy =  cX / MAX_TILT * depth * 12;
      el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    });
  }

  function tick() {
    cX = lerp(cX, tX, LERP_T);
    cY = lerp(cY, tY, LERP_T);
    applyState();

    // Keep animating until settled
    if (Math.abs(cX - tX) > 0.01 || Math.abs(cY - tY) > 0.01) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  scene.addEventListener('mousemove', (e) => {
    isInside = true;
    const rect = scene.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const nx   = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const ny   = (e.clientY - cy) / (rect.height / 2); // -1 to 1

    tX = -ny * MAX_TILT;   // tilt up/down with vertical mouse
    tY =  nx * MAX_TILT;   // tilt left/right with horizontal mouse
    startTick();
  });

  scene.addEventListener('mouseleave', () => {
    isInside = false;
    tX = 0;
    tY = 0;
    startTick();
  });
})();

/* ── Smooth scroll for anchor links ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
