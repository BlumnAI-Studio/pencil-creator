/* ════════════════════════════════════════════════════════════════
   LUMIÈRE 2300 · sample12 v2 — Lenis + PixiJS + view-timeline aware
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ───── 1) Lenis smooth scroll ─────
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 1.5,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        }
      });
    });
  }

  // ───── 2) Cursor halo ─────
  const halo = document.querySelector('.cursor-halo');
  if (halo) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      halo.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      halo.classList.add('visible');
    });
    addEventListener('mouseleave', () => halo.classList.remove('visible'));
  }

  // ───── 3) Right-rail active dot via IntersectionObserver ─────
  const dots = document.querySelectorAll('.ch-dot');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section.ch');
  const map = {};
  sections.forEach((s, i) => { map[s.id] = i; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const i = map[id];
      dots.forEach((d, j) => d.classList.toggle('active', j === i));
      navLinks.forEach((l) => {
        const href = l.getAttribute('href');
        l.classList.toggle('active', href === `#${id}`);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => io.observe(s));

  // ───── 4) Fallback reveal for browsers without view-timeline ─────
  if (!CSS.supports('animation-timeline: view()')) {
    const revealEls = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .city-mask, .i-card, .lb-tile, .int-tile, .am-row, .film-line span, .shift-x, .shift-y'
    );
    const revIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => revIo.observe(el));

    // film line stagger via inline transition-delay
    document.querySelectorAll('.film-line').forEach((line) => {
      const spans = line.querySelectorAll('span');
      spans.forEach((s, i) => {
        s.style.transitionDelay = `${i * 80}ms`;
      });
    });
  }

  // ───── 5) PixiJS Hero light particles ─────
  if (typeof PIXI !== 'undefined') {
    const canvas = document.getElementById('hero-pixi');
    if (canvas) {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: canvas.parentElement || window,
        backgroundAlpha: 0,
        antialias: true,
      });
      const NUM = 60;
      const particles = [];
      const colors = [0x00C8E8, 0xFF6BC1, 0x8B6FFF, 0xB5FF3A];
      for (let i = 0; i < NUM; i++) {
        const g = new PIXI.Graphics();
        const c = colors[Math.floor(Math.random() * colors.length)];
        const r = 1 + Math.random() * 2.5;
        g.beginFill(c, 0.85).drawCircle(0, 0, r).endFill();
        g.x = Math.random() * app.screen.width;
        g.y = Math.random() * app.screen.height;
        g.alpha = 0.4 + Math.random() * 0.5;
        g._vx = -0.4 - Math.random() * 1.2;
        g._vy = -0.1 + Math.random() * 0.2;
        g._phase = Math.random() * Math.PI * 2;
        app.stage.addChild(g);
        particles.push(g);
      }
      app.ticker.add((delta) => {
        const t = app.ticker.lastTime / 1000;
        for (const p of particles) {
          p.x += p._vx * delta;
          p.y += p._vy * delta + Math.sin(t + p._phase) * 0.15;
          if (p.x < -10) p.x = app.screen.width + 10;
          if (p.y < -10) p.y = app.screen.height + 10;
          if (p.y > app.screen.height + 10) p.y = -10;
        }
      });
    }
  }

  // ───── 6) PixiJS Sky-lane traffic ─────
  if (typeof PIXI !== 'undefined') {
    const canvas = document.getElementById('sl-pixi');
    if (canvas) {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: canvas.parentElement || window,
        backgroundAlpha: 0,
        antialias: true,
      });
      const drawBg = () => {
        const g = new PIXI.Graphics();
        const w = app.screen.width;
        const h = app.screen.height;
        // horizon line
        g.lineStyle(1, 0x00C8E8, 0.3).moveTo(0, h * 0.85).lineTo(w, h * 0.85);
        app.stage.addChild(g);
      };
      drawBg();
      const laneY = (i, h) => h * (0.18 + i * 0.16);
      const laneColors = [0xB5FF3A, 0x00C8E8, 0xFF6BC1, 0x8B6FFF, 0xFFB800];
      const laneSpeed = [-1.8, -2.6, 1.4, 2.2, 1.0];
      const cars = [];
      const NUM = 22;
      for (let i = 0; i < NUM; i++) {
        const lane = Math.floor(Math.random() * 5);
        const c = new PIXI.Container();
        const body = new PIXI.Graphics();
        const color = laneColors[lane];
        body.beginFill(0x1A1F2E).drawRoundedRect(-22, -8, 44, 16, 6).endFill();
        body.beginFill(color, 0.95).drawRoundedRect(-18, -5, 36, 10, 4).endFill();
        const tail = new PIXI.Graphics();
        tail.beginFill(color, 0.5).drawCircle(-30, 0, 7).endFill();
        tail.beginFill(color, 0.25).drawCircle(-46, 0, 11).endFill();
        tail.beginFill(color, 0.12).drawCircle(-66, 0, 16).endFill();
        c.addChild(tail, body);
        c.x = Math.random() * app.screen.width;
        c.y = laneY(lane, app.screen.height);
        c.alpha = 0.92;
        c._lane = lane;
        c._speed = laneSpeed[lane] * (0.7 + Math.random() * 0.6);
        app.stage.addChild(c);
        cars.push(c);
      }
      app.ticker.add((delta) => {
        for (const c of cars) {
          c.x += c._speed * delta;
          if (c._speed < 0 && c.x < -80) c.x = app.screen.width + 80;
          if (c._speed > 0 && c.x > app.screen.width + 80) c.x = -80;
          c.y = laneY(c._lane, app.screen.height);
        }
      });
    }
  }

  console.info(
    '%cLUMIÈRE 2300 · sample12 v2',
    'color:#00C8E8;font-family:Orbitron;font-size:24px;letter-spacing:8px;font-weight:700;',
    '\nLenis + view-timeline + PixiJS — modern scroll active'
  );
})();
