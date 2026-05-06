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

  // ───── 6) PixiJS Sky-lane traffic — opaque 3-type future vehicles ─────
  if (typeof PIXI !== 'undefined') {
    const canvas = document.getElementById('sl-pixi');
    if (canvas) {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: canvas.parentElement || window,
        backgroundAlpha: 0,
        antialias: true,
      });
      const cars = [];
      const laneDefs = [
        { y: 0.31, speed: -1.55, scale: 0.62, count: 4, gap: 0.26, type: 0 },
        { y: 0.42, speed: 1.25, scale: 0.78, count: 4, gap: 0.27, type: 1 },
        { y: 0.54, speed: -1.95, scale: 0.9, count: 5, gap: 0.23, type: 2 },
        { y: 0.66, speed: 1.62, scale: 1.02, count: 4, gap: 0.29, type: 0 },
      ];
      const palettes = [
        { hull: 0xF0F4F8, belly: 0x637488, glass: 0x15263A, neon: 0x00C8E8, warm: 0xFFC857 },
        { hull: 0x1B2334, belly: 0x3547A6, glass: 0xBDEFFF, neon: 0xFF4FD8, warm: 0xFFFFFF },
        { hull: 0xD8CDBE, belly: 0x6F5E54, glass: 0x1D3246, neon: 0xB6FF63, warm: 0xFF9F45 },
      ];

      function roundedRect(g, x, y, w, h, r, color, alpha = 1) {
        g.beginFill(color, alpha).drawRoundedRect(x, y, w, h, r).endFill();
      }

      function drawVehicle(type) {
        const p = palettes[type % palettes.length];
        const c = new PIXI.Container();
        const body = new PIXI.Graphics();
        if (type === 0) {
          // Commuter pod: soft capsule, visible windows, solid hull.
          roundedRect(body, -64, -14, 128, 28, 14, p.hull);
          roundedRect(body, -44, -20, 74, 18, 10, p.glass, 0.96);
          roundedRect(body, -54, 8, 102, 10, 5, p.belly);
          body.beginFill(p.neon).drawRect(-50, -17, 34, 3).drawRect(18, -17, 24, 3).endFill();
          body.beginFill(p.warm).drawCircle(58, -2, 4).endFill();
        } else if (type === 1) {
          // Blade coupe: sharp city taxi silhouette.
          body.beginFill(p.hull).drawPolygon([-72, 5, -42, -16, 32, -19, 70, -2, 38, 15, -40, 15]).endFill();
          body.beginFill(p.glass, 0.98).drawPolygon([-28, -13, 18, -15, 42, -4, -36, -3]).endFill();
          body.beginFill(p.belly).drawPolygon([-62, 7, 44, 7, 34, 14, -52, 14]).endFill();
          body.beginFill(p.neon).drawRect(-58, 11, 72, 4).drawCircle(62, -1, 3).endFill();
        } else {
          // Cargo shuttle: heavier rectangular vehicle for scale diversity.
          roundedRect(body, -76, -17, 142, 34, 8, p.hull);
          roundedRect(body, -58, -23, 58, 16, 6, p.glass, 0.96);
          roundedRect(body, 8, -11, 44, 13, 5, p.belly);
          body.beginFill(p.neon).drawRect(-66, 12, 112, 4).endFill();
          body.beginFill(p.warm).drawCircle(62, 0, 4).drawCircle(51, 0, 3).endFill();
        }
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x03050A, 0.38).drawEllipse(0, 18, 52, 8).endFill();
        const trail = new PIXI.Graphics();
        trail.beginFill(p.neon, 0.42).drawPolygon([-78, -5, -132, -10, -132, 8, -78, 5]).endFill();
        c.addChild(shadow, trail, body);
        c._trail = trail;
        c._body = body;
        return c;
      }

      function buildTraffic() {
        app.stage.removeChildren();
        cars.length = 0;
        const w = app.screen.width;
        const h = app.screen.height;
        laneDefs.forEach((lane, laneIndex) => {
          for (let i = 0; i < lane.count; i++) {
            const type = (lane.type + i) % 3;
            const car = drawVehicle(type);
            const depth = lane.scale * (0.92 + (i % 3) * 0.05);
            const spacing = w * lane.gap;
            car.x = (i * spacing + laneIndex * 90) % (w + spacing);
            if (lane.speed < 0) car.x = w - car.x;
            car.y = h * lane.y + (i % 2 ? 9 : -7);
            car.scale.set(depth * (lane.speed < 0 ? -1 : 1), depth);
            car.alpha = 1;
            car._lane = lane;
            car._baseY = car.y;
            car._speed = lane.speed * (0.88 + (i % 4) * 0.06);
            car._phase = i * 0.8 + laneIndex;
            car._wrap = 170 * depth;
            app.stage.addChild(car);
            cars.push(car);
          }
        });
      }

      buildTraffic();
      addEventListener('resize', () => setTimeout(buildTraffic, 80));
      app.ticker.add((delta) => {
        const t = app.ticker.lastTime / 1000;
        const w = app.screen.width;
        const h = app.screen.height;
        cars.forEach((c, i) => {
          c.x += c._speed * delta;
          c.y = h * c._lane.y + Math.sin(t * 1.4 + c._phase) * 5 + (i % 2 ? 8 : -6);
          c._trail.alpha = 0.28 + Math.sin(t * 2.2 + c._phase) * 0.08;
          if (c._speed < 0 && c.x < -c._wrap) c.x = w + c._wrap + (i % 4) * 36;
          if (c._speed > 0 && c.x > w + c._wrap) c.x = -c._wrap - (i % 4) * 36;
        });
      });
    }
  }

  // ───── 7) Decode scramble — chapter labels ─────
  function scrambleText(el) {
    const final = el.dataset.decode || el.textContent;
    const chars = '!@#$%^&*()_-+=[]{}|;:,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const total = 24;
    const tick = () => {
      let out = '';
      for (let i = 0; i < final.length; i++) {
        if (i < (frame / total) * final.length) {
          out += final[i];
        } else if (final[i] === ' ' || final[i] === '·' || final[i] === '-') {
          out += final[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    tick();
  }
  const decodeIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target._decoded) {
        entry.target._decoded = true;
        scrambleText(entry.target);
        decodeIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.decode').forEach((el) => decodeIo.observe(el));

  // ───── 8) Typewriter — meta lane text ─────
  function typewriterText(el) {
    const final = el.textContent;
    el.textContent = '';
    let i = 0;
    const speed = 22;
    const tick = () => {
      if (i < final.length) {
        el.textContent += final[i++];
        setTimeout(tick, speed + Math.random() * 30);
      } else {
        el.classList.add('done');
      }
    };
    tick();
  }
  const typeIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target._typed) {
        entry.target._typed = true;
        // small stagger by index
        const delay = Array.from(entry.target.parentElement.parentElement.children)
          .indexOf(entry.target.parentElement) * 220;
        setTimeout(() => typewriterText(entry.target), delay);
        typeIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.typewriter').forEach((el) => typeIo.observe(el));

  // ═════════ CH-04 · Pixel City — 8-bit future ═════════
  function initPixelCity() {
    if (typeof PIXI === 'undefined') return;
    const canvas = document.getElementById('pixel-stage');
    if (!canvas) return;

    // Internal low-res render target then scaled up via CSS image-rendering: pixelated
    const SCALE = 4; // each "pixel" = 4 screen pixels
    const app = new PIXI.Application({
      view: canvas,
      resizeTo: canvas.parentElement || window,
      backgroundAlpha: 0,
      antialias: false,
      resolution: 1 / SCALE,
      autoDensity: false,
    });
    // PixiJS auto-scales via resolution. Disable smoothing.
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const W = () => app.screen.width;
    const H = () => app.screen.height;

    // Color palette (light-cyberpunk pastel pixel)
    const PAL = {
      sky1: 0xFFB8C9, sky2: 0xC78EE0, sky3: 0x6E5BB8,
      bldA: 0x2E2452, bldB: 0x4A3B7A, bldC: 0x6B5BA5,
      bldEdge: 0xFFE4F2,
      win1: 0xFFE890, win2: 0xFFB85C, win3: 0xFF6BC1,
      neonC: 0x00F0FF, neonM: 0xFF6BC1, neonV: 0x8B6FFF,
      ground: 0x1A0B3D, road: 0x3D1B5C,
      moss: 0x4DD0B0, asphalt: 0x27184E, crowd: 0xE9F7FF,
      drone: 0xB5FF3A, holo: 0x6DFFEA,
    };

    // Sky gradient bands (low-res rectangles)
    const skyContainer = new PIXI.Container();
    app.stage.addChild(skyContainer);
    function drawSky() {
      skyContainer.removeChildren();
      const w = W(), h = H();
      const bands = [PAL.sky1, PAL.sky1, PAL.sky2, PAL.sky2, PAL.sky3, PAL.sky3];
      const bandH = h * 0.62 / bands.length;
      bands.forEach((c, i) => {
        const g = new PIXI.Graphics();
        g.beginFill(c).drawRect(0, i * bandH, w, bandH + 1).endFill();
        skyContainer.addChild(g);
      });
      // Sun (pixel circle)
      const sunR = Math.round(h * 0.04 / 2) * 2;
      const sun = new PIXI.Graphics();
      sun.beginFill(0xFFE890).drawCircle(w * 0.78, h * 0.22, sunR).endFill();
      sun.beginFill(0xFFFFFF, 0.6).drawCircle(w * 0.78, h * 0.22, sunR * 0.6).endFill();
      skyContainer.addChild(sun);
      // Stars (top)
      for (let i = 0; i < 40; i++) {
        const sx = Math.floor(Math.random() * w);
        const sy = Math.floor(Math.random() * h * 0.25);
        const star = new PIXI.Graphics();
        star.beginFill(0xFFFFFF, 0.6 + Math.random() * 0.4).drawRect(sx, sy, 1, 1).endFill();
        skyContainer.addChild(star);
      }
    }

    // Distant skyline (parallax layer 1)
    const skyline = new PIXI.Container();
    app.stage.addChild(skyline);
    function drawSkyline() {
      skyline.removeChildren();
      const w = W(), h = H();
      let x = -10;
      while (x < w + 10) {
        const bw = 4 + Math.floor(Math.random() * 10);
        const bh = 14 + Math.floor(Math.random() * 36);
        const baseY = h * 0.62;
        const palette = [PAL.bldA, PAL.bldB, PAL.bldC];
        const c = palette[Math.floor(Math.random() * palette.length)];
        const g = new PIXI.Graphics();
        g.beginFill(c).drawRect(x, baseY - bh, bw, bh).endFill();
        // Edge highlight on right
        g.beginFill(PAL.bldEdge, 0.18).drawRect(x + bw - 1, baseY - bh, 1, bh).endFill();
        // Random window dots
        for (let wy = baseY - bh + 2; wy < baseY - 2; wy += 2) {
          if (Math.random() < 0.35) {
            const wx = x + Math.floor(Math.random() * (bw - 1));
            const winColor = [PAL.win1, PAL.win2, PAL.win3][Math.floor(Math.random() * 3)];
            g.beginFill(winColor, 0.8).drawRect(wx, wy, 1, 1).endFill();
          }
        }
        skyline.addChild(g);
        x += bw + 2;
      }
    }

    // Layered sky rails and stations give the air traffic a natural route.
    const railContainer = new PIXI.Container();
    app.stage.addChild(railContainer);
    function drawSkyRails() {
      railContainer.removeChildren();
      const w = W(), h = H();
      const rails = [
        { y: h * 0.34, c: PAL.neonC, a: 0.28, lean: -18 },
        { y: h * 0.46, c: PAL.neonM, a: 0.24, lean: -10 },
        { y: h * 0.58, c: PAL.neonV, a: 0.22, lean: -5 },
      ];
      rails.forEach((r, idx) => {
        const line = new PIXI.Graphics();
        line.lineStyle(1, r.c, r.a);
        line.moveTo(-20, r.y + idx * 2);
        line.lineTo(w + 20, r.y - r.lean);
        line.lineStyle(1, 0xFFFFFF, r.a * 0.35);
        line.moveTo(-20, r.y + 5 + idx * 2);
        line.lineTo(w + 20, r.y - r.lean + 5);
        railContainer.addChild(line);

        for (let s = 0; s < 4; s++) {
          const sx = w * (0.16 + s * 0.23) + idx * 11;
          const sy = r.y + s % 2 * 5;
          const station = new PIXI.Graphics();
          station.beginFill(0x0F1424, 0.78).drawRect(sx - 8, sy - 5, 17, 7).endFill();
          station.beginFill(r.c, 0.92).drawRect(sx - 7, sy - 6, 15, 1).endFill();
          station.beginFill(0xFFFFFF, 0.32).drawRect(sx - 5, sy - 3, 3, 2).drawRect(sx + 2, sy - 3, 3, 2).endFill();
          railContainer.addChild(station);
        }
      });
    }

    // 3 Mega-towers (foreground, signature)
    const megaContainer = new PIXI.Container();
    app.stage.addChild(megaContainer);
    function drawMegaTowers() {
      megaContainer.removeChildren();
      const w = W(), h = H();
      const baseY = h * 0.78;
      const towers = [
        { x: w * 0.22, w: 26, h: 110, color: PAL.bldA, neon: PAL.neonC },
        { x: w * 0.45, w: 32, h: 140, color: PAL.bldB, neon: PAL.neonM },
        { x: w * 0.70, w: 26, h: 120, color: PAL.bldC, neon: PAL.neonV },
      ];
      towers.forEach((t) => {
        const g = new PIXI.Graphics();
        // Body
        g.beginFill(t.color).drawRect(t.x - t.w / 2, baseY - t.h, t.w, t.h).endFill();
        // Edge glow
        g.beginFill(PAL.bldEdge, 0.3).drawRect(t.x - t.w / 2, baseY - t.h, 1, t.h).endFill();
        g.beginFill(PAL.bldEdge, 0.3).drawRect(t.x + t.w / 2 - 1, baseY - t.h, 1, t.h).endFill();
        // Crown neon
        g.beginFill(t.neon).drawRect(t.x - t.w / 2, baseY - t.h - 3, t.w, 2).endFill();
        // Window grid
        for (let wy = baseY - t.h + 6; wy < baseY - 4; wy += 4) {
          for (let wx = t.x - t.w / 2 + 2; wx < t.x + t.w / 2 - 2; wx += 4) {
            if (Math.random() < 0.55) {
              const winColor = [PAL.win1, PAL.win2, t.neon][Math.floor(Math.random() * 3)];
              g.beginFill(winColor, 0.85).drawRect(wx, wy, 2, 2).endFill();
            }
          }
        }
        megaContainer.addChild(g);
      });

      // Visible sky bridges between towers.
      const bridge = new PIXI.Graphics();
      bridge.lineStyle(3, PAL.neonC, 0.5);
      bridge.moveTo(w * 0.22 + 13, baseY - 74);
      bridge.lineTo(w * 0.45 - 16, baseY - 86);
      bridge.lineStyle(2, PAL.neonM, 0.42);
      bridge.moveTo(w * 0.45 + 16, baseY - 108);
      bridge.lineTo(w * 0.70 - 13, baseY - 94);
      bridge.lineStyle(1, 0xFFFFFF, 0.35);
      bridge.moveTo(w * 0.22 + 13, baseY - 70);
      bridge.lineTo(w * 0.45 - 16, baseY - 82);
      bridge.moveTo(w * 0.45 + 16, baseY - 104);
      bridge.lineTo(w * 0.70 - 13, baseY - 90);
      megaContainer.addChild(bridge);
    }

    // Ground / road
    const ground = new PIXI.Container();
    app.stage.addChild(ground);
    function drawGround() {
      ground.removeChildren();
      const w = W(), h = H();
      const baseY = h * 0.78;
      const g = new PIXI.Graphics();
      g.beginFill(PAL.ground).drawRect(0, baseY, w, h - baseY).endFill();
      g.beginFill(PAL.asphalt, 0.86).drawRect(0, h * 0.88, w, h * 0.12).endFill();
      g.beginFill(PAL.moss, 0.42).drawRect(0, baseY + 3, w, 7).endFill();
      // Road grid lines
      for (let i = 0; i < 12; i++) {
        const t = i / 12;
        const ly = baseY + (h - baseY) * t * t;
        const alpha = 0.35 - t * 0.25;
        g.beginFill(PAL.neonC, alpha).drawRect(0, ly, w, 1).endFill();
      }
      // Vertical perspective lines
      for (let i = -5; i <= 5; i++) {
        const cx = w / 2 + i * (w / 10);
        const path = new PIXI.Graphics();
        path.lineStyle(1, PAL.neonM, 0.25);
        path.moveTo(cx, baseY);
        path.lineTo(w / 2 + i * 6, h);
        ground.addChild(path);
      }
      // Crosswalks and plaza pads make pedestrian movement readable.
      for (let x = 12; x < w; x += 42) {
        g.beginFill(0xFFFFFF, 0.2).drawRect(x, h * 0.905, 12, 2).endFill();
      }
      for (let p = 0; p < 3; p++) {
        const px = w * (0.24 + p * 0.23);
        const py = h * (0.835 + (p % 2) * 0.025);
        g.beginFill(0x0F1424, 0.52).drawRect(px - 26, py - 5, 52, 12).endFill();
        g.beginFill(PAL.neonC, 0.42).drawRect(px - 24, py - 6, 48, 1).endFill();
      }
      ground.addChild(g);
    }

    // Cyber cars (pixel sprites)
    const carContainer = new PIXI.Container();
    app.stage.addChild(carContainer);
    const cars = [];
    function makeCar(kind = 'car') {
      const c = new PIXI.Graphics();
      const colors = [PAL.neonC, PAL.neonM, PAL.neonV, PAL.win2];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const len = kind === 'bus' ? 18 : 10 + Math.floor(Math.random() * 4);
      c.beginFill(0x100927).drawRect(0, 2, len, 4).endFill();
      c.beginFill(color, 0.96).drawRect(1, 0, len - 2, 3).endFill();
      c.beginFill(0xFFFFFF, 0.72).drawRect(2, 0, 2, 1).drawRect(len - 5, 0, 2, 1).endFill();
      if (kind === 'taxi') c.beginFill(PAL.win2, 0.95).drawRect(4, -2, 4, 1).endFill();
      // glow trail
      c.beginFill(color, 0.45).drawRect(-2, 1, 2, 2).endFill();
      c.beginFill(color, 0.2).drawRect(-5, 1, 3, 2).endFill();
      return c;
    }
    function spawnCars() {
      carContainer.removeChildren();
      cars.length = 0;
      const w = W(), h = H();
      const lanes = [
        { y: h * 0.34, s: 0.62, speed: 0.34 },
        { y: h * 0.43, s: 0.78, speed: 0.58 },
        { y: h * 0.53, s: 0.95, speed: 0.82 },
        { y: h * 0.62, s: 1.18, speed: 1.05 },
      ];
      for (let i = 0; i < 40; i++) {
        const lane = Math.floor(Math.random() * lanes.length);
        const kind = i % 11 === 0 ? 'bus' : (i % 5 === 0 ? 'taxi' : 'car');
        const car = makeCar(kind);
        car.x = Math.random() * w;
        car.y = lanes[lane].y;
        car._lane = lane;
        car._baseY = lanes[lane].y;
        car._speed = lanes[lane].speed * (0.7 + Math.random() * 0.75);
        car._phase = Math.random() * Math.PI * 2;
        car.scale.set(lanes[lane].s);
        if (Math.random() < 0.5) {
          car._speed = -car._speed;
          car.scale.x *= -1;
        }
        carContainer.addChild(car);
        cars.push(car);
      }
    }

    const droneContainer = new PIXI.Container();
    app.stage.addChild(droneContainer);
    const drones = [];
    function makeDrone() {
      const d = new PIXI.Graphics();
      const color = Math.random() > 0.5 ? PAL.drone : PAL.holo;
      d.beginFill(color, 0.92).drawRect(2, 1, 5, 2).endFill();
      d.beginFill(0xFFFFFF, 0.55).drawRect(0, 0, 2, 1).drawRect(8, 0, 2, 1).endFill();
      d.beginFill(color, 0.3).drawRect(3, 4, 3, 1).endFill();
      return d;
    }
    function spawnDrones() {
      droneContainer.removeChildren();
      drones.length = 0;
      const w = W(), h = H();
      for (let i = 0; i < 18; i++) {
        const d = makeDrone();
        d.x = Math.random() * w;
        d.y = h * (0.22 + Math.random() * 0.36);
        d._baseY = d.y;
        d._speed = (0.12 + Math.random() * 0.34) * (Math.random() > 0.5 ? 1 : -1);
        d._phase = Math.random() * Math.PI * 2;
        d.scale.set(0.7 + Math.random() * 0.65);
        if (d._speed < 0) d.scale.x *= -1;
        droneContainer.addChild(d);
        drones.push(d);
      }
    }

    // Pixel humanoids walking on ground
    const humContainer = new PIXI.Container();
    app.stage.addChild(humContainer);
    const humans = [];
    function makeHuman(color, accessory = false) {
      const c = new PIXI.Container();
      const g = new PIXI.Graphics();
      g.beginFill(color).drawRect(0, 0, 3, 2).endFill(); // head
      g.beginFill(0xFFFFFF, 0.9).drawRect(1, 0, 1, 1).endFill(); // visor
      g.beginFill(color).drawRect(0, 2, 3, 4).endFill(); // body
      g.beginFill(0xFFFFFF, 0.4).drawRect(0, 6, 1, 2).endFill(); // leg L
      g.beginFill(0xFFFFFF, 0.4).drawRect(2, 6, 1, 2).endFill(); // leg R
      if (accessory) {
        g.beginFill(PAL.neonC, 0.75).drawRect(4, 3, 2, 2).endFill();
      }
      c.addChild(g);
      return c;
    }
    function spawnHumans() {
      humContainer.removeChildren();
      humans.length = 0;
      const w = W(), h = H();
      const walkBands = [h * 0.84, h * 0.865, h * 0.905, h * 0.94];
      for (let i = 0; i < 76; i++) {
        const colors = [0xFFFFFF, PAL.neonC, PAL.neonM, PAL.win2, PAL.drone, PAL.moss];
        const h_ = makeHuman(colors[Math.floor(Math.random() * colors.length)], i % 7 === 0);
        const band = i % walkBands.length;
        h_.x = Math.random() * w;
        h_.y = walkBands[band] + Math.floor(Math.random() * 10);
        h_._speed = (0.06 + Math.random() * 0.22) * (band > 1 ? 1.25 : 0.8) * (Math.random() < 0.5 ? -1 : 1);
        if (h_._speed < 0) h_.scale.x = -1;
        const depth = 0.72 + band * 0.14;
        h_.scale.x *= depth;
        h_.scale.y = depth;
        h_._frame = Math.random() * 30;
        h_._baseY = h_.y;
        h_._pause = Math.random() * 120;
        humContainer.addChild(h_);
        humans.push(h_);
      }
    }

    // NEON sign (foreground UI)
    const signContainer = new PIXI.Container();
    app.stage.addChild(signContainer);
    function drawSign() {
      signContainer.removeChildren();
      const w = W(), h = H();
      const sx = Math.floor(w * 0.04);
      const sy = Math.floor(h * 0.32);
      const g = new PIXI.Graphics();
      // Backdrop block
      g.beginFill(0x0F1424, 0.6).drawRect(sx, sy, 50, 22).endFill();
      g.beginFill(PAL.neonC, 0.9).drawRect(sx + 1, sy + 1, 48, 1).endFill();
      g.beginFill(PAL.neonM, 0.9).drawRect(sx + 1, sy + 20, 48, 1).endFill();
      // "D-01"
      g.beginFill(PAL.win2).drawRect(sx + 4, sy + 6, 1, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 4, sy + 7, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 4, sy + 8, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 4, sy + 9, 1, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 7, sy + 9, 1, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 8, sy + 7, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 11, sy + 7, 1, 3).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 13, sy + 8, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 16, sy + 7, 1, 3).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 17, sy + 7, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 17, sy + 9, 2, 1).endFill();
      g.beginFill(PAL.win2).drawRect(sx + 19, sy + 8, 1, 1).endFill();
      // Extra animated billboards across the skyline.
      const signs = [
        { x: w * 0.78, y: h * 0.39, cw: 42, ch: 15, c: PAL.neonC },
        { x: w * 0.58, y: h * 0.29, cw: 34, ch: 12, c: PAL.neonM },
        { x: w * 0.11, y: h * 0.52, cw: 38, ch: 13, c: PAL.drone },
      ];
      signs.forEach((s, i) => {
        g.beginFill(0x0F1424, 0.72).drawRect(s.x, s.y, s.cw, s.ch).endFill();
        g.beginFill(s.c, 0.9).drawRect(s.x + 1, s.y + 1, s.cw - 2, 1).endFill();
        for (let px = 5; px < s.cw - 5; px += 5) {
          g.beginFill(i % 2 ? PAL.win2 : 0xFFFFFF, 0.7).drawRect(s.x + px, s.y + 5 + (px % 3), 3, 2).endFill();
        }
      });
      signContainer.addChild(g);
    }

    // Build all
    function rebuild() {
      drawSky();
      drawSkyline();
      drawSkyRails();
      drawMegaTowers();
      drawGround();
      drawSign();
      spawnCars();
      spawnDrones();
      spawnHumans();
    }
    rebuild();
    addEventListener('resize', () => setTimeout(rebuild, 100));

    // Animate
    let frameCount = 0;
    app.ticker.add((delta) => {
      frameCount += delta;
      const w = W();
      // cars
      for (const c of cars) {
        c.x += c._speed * delta;
        c.y = c._baseY + Math.sin(frameCount * 0.04 + c._phase) * 1.6;
        c.alpha = 0.82 + Math.sin(frameCount * 0.05 + c._phase) * 0.16;
        const carW = 28;
        if (c._speed < 0 && c.x < -carW) c.x = w + carW;
        if (c._speed > 0 && c.x > w + carW) c.x = -carW;
      }
      // drones drift more slowly than cars and bob independently
      for (const d of drones) {
        d.x += d._speed * delta;
        d.y = d._baseY + Math.sin(frameCount * 0.035 + d._phase) * 3;
        d.alpha = 0.72 + Math.sin(frameCount * 0.06 + d._phase) * 0.22;
        if (d._speed < 0 && d.x < -16) d.x = w + 16;
        if (d._speed > 0 && d.x > w + 16) d.x = -16;
      }
      // humans walking
      for (const h_ of humans) {
        const pausing = Math.sin((frameCount + h_._pause) * 0.012) > 0.86;
        h_.x += (pausing ? h_._speed * 0.12 : h_._speed) * delta;
        h_._frame += delta;
        // walk cycle bobs y by 1 pixel
        const bob = Math.floor(Math.sin(h_._frame * 0.3) * 0.5 + 0.5);
        h_.pivot.y = -bob + Math.sin(frameCount * 0.012 + h_._pause) * 0.4;
        if (h_._speed < 0 && h_.x < -8) h_.x = w + 8;
        if (h_._speed > 0 && h_.x > w + 8) h_.x = -8;
      }
      // Sign neon flicker
      if (frameCount % 6 < 0.5) {
        signContainer.alpha = 0.92 + Math.random() * 0.08;
      }
    });
  }
  initPixelCity();

  // ═════════ CH-04C · Gemini texture 3D AI model house ═════════
  function initModelHouse3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('modelhouse-3d');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x03050A, 12, 38);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(7.2, 5.2, 9.4);
    camera.lookAt(0, 1.2, 0);

    function resize() {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    }
    resize();
    addEventListener('resize', resize);

    scene.add(new THREE.AmbientLight(0xB8D8FF, 0.5));
    const key = new THREE.DirectionalLight(0xEAF7FF, 0.95);
    key.position.set(6, 7, 5);
    scene.add(key);
    const cyan = new THREE.PointLight(0x32E6FF, 1.7, 24);
    cyan.position.set(-4, 2.6, 3);
    scene.add(cyan);
    const amber = new THREE.PointLight(0xFFC857, 1.25, 18);
    amber.position.set(3.8, 2.2, -2.6);
    scene.add(amber);
    const magenta = new THREE.PointLight(0xFF4FD8, 1.05, 22);
    magenta.position.set(0, 4, 4.2);
    scene.add(magenta);

    const loader = new THREE.TextureLoader();
    const texturePaths = {
      floor: 'img/2026-05-07-modelhouse-marble-floor.png',
      walnut: 'img/2026-05-07-modelhouse-walnut-panel.png',
      glass: 'img/2026-05-07-modelhouse-holo-glass.png',
      kitchen: 'img/2026-05-07-modelhouse-kitchen-stone.png',
      city: 'img/2026-05-07-modelhouse-city-window.png',
      fabric: 'img/2026-05-07-modelhouse-fabric-sofa.png',
      bath: 'img/2026-05-07-modelhouse-bath-stone.png',
      ceiling: 'img/2026-05-07-modelhouse-neon-ceiling.png',
    };

    function texture(keyName, repeatX = 1, repeatY = 1) {
      const t = loader.load(texturePaths[keyName]);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      if ('encoding' in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
      return t;
    }

    const mats = {
      floor: new THREE.MeshStandardMaterial({ color: 0xDCE7EA, map: texture('floor', 3.4, 2.2), metalness: 0.16, roughness: 0.34 }),
      walnut: new THREE.MeshStandardMaterial({ color: 0x8C6A4E, map: texture('walnut', 2.2, 1.4), metalness: 0.22, roughness: 0.4, emissive: 0x17100A, emissiveIntensity: 0.06 }),
      glass: new THREE.MeshStandardMaterial({ color: 0xA8E8FF, map: texture('glass', 1.2, 1.2), transparent: true, opacity: 0.34, metalness: 0.06, roughness: 0.08, emissive: 0x102A38, emissiveIntensity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
      kitchen: new THREE.MeshStandardMaterial({ color: 0x2B3036, map: texture('kitchen', 1.7, 1.1), metalness: 0.34, roughness: 0.28 }),
      city: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture('city', 1, 1), transparent: true, opacity: 0.86 }),
      fabric: new THREE.MeshStandardMaterial({ color: 0x5B6670, map: texture('fabric', 1.8, 1.2), metalness: 0.02, roughness: 0.84 }),
      bath: new THREE.MeshStandardMaterial({ color: 0xD8D4C8, map: texture('bath', 1.6, 1.2), metalness: 0.1, roughness: 0.42 }),
      ceiling: new THREE.MeshStandardMaterial({ color: 0xEAF7FF, map: texture('ceiling', 2.8, 1.6), metalness: 0.14, roughness: 0.32, emissive: 0x174858, emissiveIntensity: 0.45 }),
      bronze: new THREE.MeshStandardMaterial({ color: 0xB0927A, metalness: 0.8, roughness: 0.28, emissive: 0x251406, emissiveIntensity: 0.08 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x0B1322, metalness: 0.5, roughness: 0.34, emissive: 0x040B14, emissiveIntensity: 0.2 }),
      cyan: new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.78 }),
      amberGlow: new THREE.MeshBasicMaterial({ color: 0xFFC857, transparent: true, opacity: 0.72 }),
      pinkGlow: new THREE.MeshBasicMaterial({ color: 0xFF4FD8, transparent: true, opacity: 0.62 }),
    };

    const room = new THREE.Group();
    scene.add(room);

    function box(size, pos, mat, rotY = 0) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.y = rotY;
      room.add(mesh);
      return mesh;
    }

    function plane(size, pos, mat, rot = [-Math.PI / 2, 0, 0]) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      room.add(mesh);
      return mesh;
    }

    plane([12.8, 8.2], [0, 0, 0], mats.floor);
    plane([12.8, 8.2], [0, 3.35, 0], mats.ceiling, [Math.PI / 2, 0, 0]);
    box([12.9, 0.18, 0.22], [0, 0.09, 4.05], mats.bronze);
    box([12.9, 0.18, 0.22], [0, 0.09, -4.05], mats.bronze);
    box([0.22, 0.18, 8.2], [-6.4, 0.09, 0], mats.bronze);
    box([0.22, 0.18, 8.2], [6.4, 0.09, 0], mats.bronze);
    box([12.8, 3.1, 0.18], [0, 1.55, -4.05], mats.walnut);
    box([0.18, 3.1, 8.2], [-6.4, 1.55, 0], mats.walnut);
    box([0.18, 3.1, 8.2], [6.4, 1.55, 0], mats.walnut);
    plane([7.4, 3.3], [1.2, 1.8, -4.16], mats.city, [0, 0, 0]);

    // Low interior partitions preserve an open model-house read.
    box([0.12, 1.8, 3.1], [-1.42, 0.9, -1.25], mats.glass);
    box([3.2, 1.8, 0.12], [3.85, 0.9, 0.78], mats.glass);
    box([0.14, 1.45, 2.35], [2.55, 0.72, 2.58], mats.bath);

    // Living room.
    box([2.25, 0.34, 0.88], [-3.65, 0.28, 1.65], mats.fabric);
    box([2.25, 0.72, 0.24], [-3.65, 0.58, 2.0], mats.fabric);
    box([0.34, 0.6, 0.72], [-4.95, 0.46, 1.65], mats.fabric);
    box([0.34, 0.6, 0.72], [-2.35, 0.46, 1.65], mats.fabric);
    box([1.22, 0.16, 0.62], [-3.65, 0.18, 0.55], mats.bronze);
    box([1.58, 0.9, 0.08], [-3.65, 1.26, -3.92], mats.dark);
    box([1.18, 0.62, 0.04], [-3.65, 1.3, -3.86], mats.cyan);

    // AI kitchen.
    box([2.2, 0.82, 0.92], [0.72, 0.46, 1.65], mats.kitchen);
    box([2.05, 0.1, 0.76], [0.72, 0.92, 1.65], mats.ceiling);
    box([2.65, 1.12, 0.24], [0.8, 0.68, -3.78], mats.kitchen);
    box([0.95, 0.28, 0.12], [0.0, 1.36, -3.62], mats.cyan);
    box([0.74, 0.28, 0.12], [1.08, 1.36, -3.62], mats.pinkGlow);

    // Bedroom.
    box([2.35, 0.36, 1.45], [3.8, 0.28, -1.72], mats.fabric);
    box([2.46, 0.86, 0.18], [3.8, 0.68, -2.48], mats.walnut);
    box([0.42, 0.36, 0.42], [2.35, 0.24, -1.08], mats.bronze);
    box([0.42, 0.36, 0.42], [5.25, 0.24, -1.08], mats.bronze);
    box([1.55, 0.08, 0.06], [3.8, 1.24, -2.34], mats.amberGlow);

    // Bathroom.
    box([1.28, 0.48, 0.76], [4.6, 0.32, 2.82], mats.bath);
    box([0.96, 0.72, 0.08], [5.88, 0.94, 2.38], mats.glass, Math.PI / 2);
    box([0.7, 0.18, 0.48], [3.45, 0.28, 3.0], mats.kitchen);
    box([0.55, 0.55, 0.04], [3.45, 1.0, 3.42], mats.cyan);

    // Ceiling light rails and room zones.
    const lightRails = [];
    [-4.2, -1.4, 1.4, 4.2].forEach((x, i) => {
      const rail = box([1.8, 0.035, 0.045], [x, 3.22, 0.8 - (i % 2) * 2.1], i % 2 ? mats.pinkGlow.clone() : mats.cyan.clone());
      lightRails.push(rail);
    });
    const zoneRings = [];
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
    [[-3.65, 0.04, 0.55], [0.72, 0.045, 1.65], [3.8, 0.05, -1.72], [4.6, 0.055, 2.82]].forEach((p, i) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.58, 72), ringMat.clone());
      ring.position.set(p[0], p[1], p[2]);
      ring.rotation.x = -Math.PI / 2;
      ring.material.color = new THREE.Color([0x32E6FF, 0xFFC857, 0xFF4FD8, 0xB6FF63][i]);
      room.add(ring);
      zoneRings.push(ring);
    });

    function makeLabel(text, pos, color = '#32E6FF') {
      const cnv = document.createElement('canvas');
      cnv.width = 512;
      cnv.height = 96;
      const ctx = cnv.getContext('2d');
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.fillStyle = 'rgba(3, 6, 12, 0.62)';
      ctx.fillRect(0, 0, cnv.width, cnv.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, cnv.width - 16, cnv.height - 16);
      ctx.font = '700 34px JetBrains Mono, monospace';
      ctx.fillStyle = '#EAF7FF';
      ctx.fillText(text, 28, 60);
      const tex = new THREE.CanvasTexture(cnv);
      if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.82 }));
      sprite.position.set(pos[0], pos[1], pos[2]);
      sprite.scale.set(1.55, 0.3, 1);
      room.add(sprite);
      return sprite;
    }
    makeLabel('LIVING', [-4.45, 1.85, 0.34]);
    makeLabel('AI KITCHEN', [-0.1, 1.92, 1.05], '#FFC857');
    makeLabel('MASTER', [3.8, 1.86, -0.64], '#FF4FD8');
    makeLabel('SPA', [4.7, 1.72, 3.46], '#B6FF63');

    const cars = [];
    for (let i = 0; i < 14; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.07), i % 2 ? mats.pinkGlow.clone() : mats.cyan.clone());
      const trail = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.018, 0.025), mats.cyan.clone());
      trail.position.x = -0.34;
      g.add(body, trail);
      g.position.set(-5.4 + Math.random() * 10.8, 1.6 + Math.random() * 1.3, -4.35);
      g.userData.speed = 0.006 + Math.random() * 0.008;
      g.userData.phase = Math.random() * Math.PI * 2;
      room.add(g);
      cars.push(g);
    }

    let isDragging = false, lastX = 0, lastY = 0;
    let targetY = -0.35, currentY = -0.35;
    let targetX = 0.03, currentX = 0.03;
    let auto = true;
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      auto = false;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      targetY += (e.clientX - lastX) * 0.008;
      targetX = Math.max(-0.34, Math.min(0.22, targetX + (e.clientY - lastY) * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
    });
    const stopDrag = () => {
      isDragging = false;
      setTimeout(() => { auto = true; }, 1600);
    };
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('pointerleave', stopDrag);

    let t = 0;
    function loop() {
      t += 0.01;
      if (auto) targetY += 0.0018;
      currentY += (targetY - currentY) * 0.06;
      currentX += (targetX - currentX) * 0.06;
      room.rotation.y = currentY;
      room.rotation.x = currentX;
      room.position.y = Math.sin(t * 1.2) * 0.035;
      camera.lookAt(0, 1.15, 0);
      cyan.intensity = 1.45 + Math.sin(t * 2.4) * 0.28;
      magenta.intensity = 0.92 + Math.cos(t * 2.1) * 0.22;
      lightRails.forEach((rail, i) => {
        rail.material.opacity = 0.52 + Math.sin(t * 3 + i) * 0.18;
      });
      zoneRings.forEach((ring, i) => {
        ring.material.opacity = 0.26 + Math.sin(t * 2.2 + i) * 0.14;
        ring.rotation.z += 0.003 + i * 0.0008;
      });
      cars.forEach((car, i) => {
        car.position.x += car.userData.speed * (i % 2 ? -1 : 1);
        car.position.y += Math.sin(t * 2.5 + car.userData.phase) * 0.0015;
        if (car.position.x > 5.7) car.position.x = -5.7;
        if (car.position.x < -5.7) car.position.x = 5.7;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
  }
  initModelHouse3D();

  // ═════════ CH-04B · 3D Orbit Gate Terminal ═════════
  function initOrbitTerminal3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('orbit-terminal-3d');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x03050A, 13, 42);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(7.4, 4.8, 9.6);
    camera.lookAt(0, 1.15, 0);

    function resize() {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    }
    resize();
    addEventListener('resize', resize);

    scene.add(new THREE.AmbientLight(0xA9CFFF, 0.48));
    const key = new THREE.DirectionalLight(0xEAF7FF, 0.9);
    key.position.set(6, 8, 4);
    scene.add(key);
    const cyan = new THREE.PointLight(0x32E6FF, 1.75, 25);
    cyan.position.set(-4, 2.8, 3.2);
    scene.add(cyan);
    const amber = new THREE.PointLight(0xFFC857, 1.25, 20);
    amber.position.set(4, 2.2, -2.8);
    scene.add(amber);
    const magenta = new THREE.PointLight(0xFF4FD8, 0.95, 22);
    magenta.position.set(0, 4.2, 4.2);
    scene.add(magenta);

    const loader = new THREE.TextureLoader();
    const paths = {
      floor: 'img/2026-05-07-orbit-terminal-floor.png',
      hull: 'img/2026-05-07-orbit-terminal-hull-panel.png',
      glass: 'img/2026-05-07-orbit-terminal-glass-dome.png',
      ring: 'img/2026-05-07-orbit-terminal-docking-ring.png',
      board: 'img/2026-05-07-orbit-terminal-departure-board.png',
      earth: 'img/2026-05-07-orbit-terminal-earth-window.png',
    };

    function tex(name, rx = 1, ry = 1) {
      const t = loader.load(paths[name]);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx, ry);
      if ('encoding' in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
      return t;
    }

    const mats = {
      floor: new THREE.MeshStandardMaterial({ color: 0xBFC6CE, map: tex('floor', 2.8, 2.1), metalness: 0.42, roughness: 0.24 }),
      hull: new THREE.MeshStandardMaterial({ color: 0xDDE3E8, map: tex('hull', 2.4, 1.4), metalness: 0.32, roughness: 0.36, emissive: 0x071827, emissiveIntensity: 0.08 }),
      glass: new THREE.MeshStandardMaterial({ color: 0xBCEBFF, map: tex('glass', 2, 1), transparent: true, opacity: 0.26, metalness: 0.02, roughness: 0.04, emissive: 0x0C2A38, emissiveIntensity: 0.34, depthWrite: false, side: THREE.DoubleSide }),
      ring: new THREE.MeshStandardMaterial({ color: 0x303642, map: tex('ring', 1.8, 1.8), metalness: 0.66, roughness: 0.22, emissive: 0x061620, emissiveIntensity: 0.18 }),
      board: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: tex('board', 1, 1), transparent: true, opacity: 0.86 }),
      earth: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: tex('earth', 1, 1), transparent: true, opacity: 0.92 }),
      cyan: new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.78 }),
      amberGlow: new THREE.MeshBasicMaterial({ color: 0xFFC857, transparent: true, opacity: 0.72 }),
      pinkGlow: new THREE.MeshBasicMaterial({ color: 0xFF4FD8, transparent: true, opacity: 0.62 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x09111F, metalness: 0.7, roughness: 0.3, emissive: 0x030912, emissiveIntensity: 0.22 }),
      shuttle: new THREE.MeshStandardMaterial({ color: 0xEAF7FF, metalness: 0.45, roughness: 0.28, emissive: 0x101820, emissiveIntensity: 0.1 }),
    };

    const terminal = new THREE.Group();
    scene.add(terminal);

    function add(mesh, x, y, z, rx = 0, ry = 0, rz = 0) {
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      terminal.add(mesh);
      return mesh;
    }
    const box = (sx, sy, sz, mat) => new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);

    add(new THREE.Mesh(new THREE.CircleGeometry(6.7, 96), mats.floor), 0, 0, 0, -Math.PI / 2);
    const outerRing = add(new THREE.Mesh(new THREE.RingGeometry(5.6, 6.15, 128), mats.ring), 0, 0.025, 0, -Math.PI / 2);
    const innerRing = add(new THREE.Mesh(new THREE.RingGeometry(2.15, 2.34, 128), mats.cyan.clone()), 0, 0.04, 0, -Math.PI / 2);
    const dome = add(new THREE.Mesh(new THREE.SphereGeometry(5.95, 64, 18, 0, Math.PI * 2, 0, Math.PI / 2), mats.glass), 0, 0.05, 0);
    dome.scale.y = 0.58;

    add(box(9.2, 2.2, 0.12, mats.earth), 0, 2.0, -5.95);
    add(box(2.55, 1.08, 0.08, mats.board), -3.65, 1.55, -5.78);
    add(box(2.55, 1.08, 0.08, mats.board.clone()), 3.65, 1.55, -5.78);

    const gatePiers = [];
    [-4.35, -2.15, 2.15, 4.35].forEach((x, i) => {
      const pier = add(box(0.18, 2.5, 0.24, mats.hull), x, 1.25, -4.85);
      gatePiers.push(pier);
      add(box(0.76, 0.08, 0.14, i % 2 ? mats.pinkGlow.clone() : mats.cyan.clone()), x, 2.55, -4.7);
    });

    const bridge = add(box(3.8, 0.2, 1.05, mats.hull), 0, 0.74, 2.9);
    const bridgeGlass = add(box(3.6, 0.48, 0.08, mats.glass), 0, 1.05, 3.45);
    const boardingRing = add(new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.1, 16, 96), mats.ring), 0, 1.25, 4.15, Math.PI / 2);
    const boardingGlow = add(new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.025, 8, 96), mats.cyan.clone()), 0, 1.25, 4.15, Math.PI / 2);

    const shuttle = new THREE.Group();
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 2.5, 28), mats.shuttle);
    fuselage.rotation.x = Math.PI / 2;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.74, 28), mats.shuttle);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 1.62;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.52, 28), mats.dark);
    tail.rotation.x = -Math.PI / 2;
    tail.position.z = -1.45;
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.38), mats.glass);
    cockpit.position.set(0, 0.25, 0.76);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.055, 0.52), mats.hull);
    wingL.position.set(-0.72, -0.04, -0.22);
    wingL.rotation.z = -0.18;
    const wingR = wingL.clone();
    wingR.position.x = 0.72;
    wingR.rotation.z = 0.18;
    const engineGlow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 32), mats.amberGlow.clone());
    engineGlow.position.z = -1.72;
    engineGlow.rotation.y = Math.PI;
    shuttle.add(fuselage, nose, tail, cockpit, wingL, wingR, engineGlow);
    shuttle.position.set(0, 1.25, 5.8);
    shuttle.rotation.y = Math.PI;
    terminal.add(shuttle);

    const neonRails = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const rail = add(box(2.9, 0.035, 0.04, i % 2 ? mats.pinkGlow.clone() : mats.cyan.clone()), Math.cos(angle) * 2.7, 0.08, Math.sin(angle) * 2.7, 0, -angle, 0);
      neonRails.push(rail);
    }

    const pods = [];
    for (let i = 0; i < 34; i++) {
      const pod = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.17, 10), mats.hull);
      body.rotation.x = Math.PI;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), i % 3 ? mats.cyan.clone() : mats.amberGlow.clone());
      head.position.y = 0.12;
      pod.add(body, head);
      pod.userData.radius = 1.4 + (i % 4) * 0.68;
      pod.userData.phase = (i / 34) * Math.PI * 2;
      pod.userData.speed = 0.002 + (i % 5) * 0.00045;
      terminal.add(pod);
      pods.push(pod);
    }

    function makeLabel(text, pos, color = '#32E6FF') {
      const cnv = document.createElement('canvas');
      cnv.width = 512;
      cnv.height = 96;
      const ctx = cnv.getContext('2d');
      ctx.fillStyle = 'rgba(3, 6, 12, 0.66)';
      ctx.fillRect(0, 0, cnv.width, cnv.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, cnv.width - 16, cnv.height - 16);
      ctx.font = '700 32px JetBrains Mono, monospace';
      ctx.fillStyle = '#EAF7FF';
      ctx.fillText(text, 26, 60);
      const t = new THREE.CanvasTexture(cnv);
      if ('encoding' in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0.82 }));
      s.position.set(pos[0], pos[1], pos[2]);
      s.scale.set(1.52, 0.29, 1);
      terminal.add(s);
      return s;
    }
    makeLabel('ORBIT GATE', [0, 2.8, -4.55]);
    makeLabel('BOARDING RING', [0, 2.42, 3.6], '#FFC857');

    let isDragging = false, lastX = 0, lastY = 0;
    let targetY = -0.42, currentY = -0.42;
    let targetX = 0.02, currentX = 0.02;
    let auto = true;
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      auto = false;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      targetY += (e.clientX - lastX) * 0.008;
      targetX = Math.max(-0.3, Math.min(0.22, targetX + (e.clientY - lastY) * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
    });
    const stopDrag = () => {
      isDragging = false;
      setTimeout(() => { auto = true; }, 1600);
    };
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('pointerleave', stopDrag);

    let t = 0;
    function loop() {
      t += 0.01;
      if (auto) targetY += 0.0016;
      currentY += (targetY - currentY) * 0.06;
      currentX += (targetX - currentX) * 0.06;
      terminal.rotation.y = currentY;
      terminal.rotation.x = currentX;
      terminal.position.y = Math.sin(t * 1.15) * 0.035;
      camera.lookAt(0, 1.15, 0);
      cyan.intensity = 1.5 + Math.sin(t * 2.3) * 0.28;
      amber.intensity = 1.1 + Math.cos(t * 2.0) * 0.22;
      outerRing.rotation.z += 0.002;
      innerRing.rotation.z -= 0.0038;
      boardingRing.rotation.z += 0.004;
      boardingGlow.material.opacity = 0.48 + Math.sin(t * 3.4) * 0.2;
      bridgeGlass.material.opacity = 0.26 + Math.sin(t * 2.6) * 0.08;
      shuttle.position.y = 1.25 + Math.sin(t * 1.8) * 0.07;
      shuttle.position.z = 5.7 + Math.sin(t * 0.9) * 0.12;
      engineGlow.material.opacity = 0.48 + Math.sin(t * 6.4) * 0.2;
      neonRails.forEach((rail, i) => {
        rail.material.opacity = 0.52 + Math.sin(t * 3 + i) * 0.17;
      });
      pods.forEach((pod, i) => {
        const a = pod.userData.phase + t * pod.userData.speed * 120;
        pod.position.set(Math.cos(a) * pod.userData.radius, 0.14, Math.sin(a) * pod.userData.radius);
        pod.rotation.y = -a;
        if (i % 7 === 0) pod.position.y = 0.14 + Math.sin(t * 4 + i) * 0.025;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
  }
  initOrbitTerminal3D();

  // ═════════ CH-05 · Three.js Interactive Mega-Tower ═════════
  function initTower3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('tower-3d');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
    };
    resize();
    addEventListener('resize', resize);

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x050912, 18, 70);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(0, 13, 32);
    camera.lookAt(0, 12, 0);

    function updateCamera() {
      const r = canvas.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    }
    updateCamera();
    addEventListener('resize', updateCamera);

    // Lighting — high-contrast city-night cyber realism
    const ambient = new THREE.AmbientLight(0x6F86B8, 0.46);
    scene.add(ambient);
    const sunLight = new THREE.DirectionalLight(0xD8F2FF, 0.72);
    sunLight.position.set(8, 20, 12);
    scene.add(sunLight);
    const cyanFill = new THREE.PointLight(0x00C8E8, 1.2, 30);
    cyanFill.position.set(-8, 14, 10);
    scene.add(cyanFill);
    const magentaFill = new THREE.PointLight(0xFF4FD8, 1.45, 32);
    magentaFill.position.set(10, 8, -8);
    scene.add(magentaFill);
    const amberDeck = new THREE.PointLight(0xFFC857, 1.0, 28);
    amberDeck.position.set(0, 4, 14);
    scene.add(amberDeck);

    // Tower group
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    // 47 floors as stacked plates
    const FLOORS = 47;
    const FLOOR_H = 0.5;
    const TOTAL_H = FLOORS * FLOOR_H;
    const baseW = 3.5, baseD = 3.5;
    const floors = [];
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xEAF7FF, metalness: 0.46, roughness: 0.28, transparent: true, opacity: 0.72, depthWrite: false,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x7FB8D8, metalness: 0.82, roughness: 0.08, transparent: true, opacity: 0.55,
      emissive: 0x071827, emissiveIntensity: 0.28, depthWrite: false,
    });

    for (let i = 0; i < FLOORS; i++) {
      const t = i / (FLOORS - 1);
      // Slight taper: width 100% at base → 84% at top
      const w = baseW * (1 - t * 0.16);
      const d = baseD * (1 - t * 0.16);
      const geom = new THREE.BoxGeometry(w, FLOOR_H * 0.94, d);
      const mat = (i % 5 === 0) ? floorMat : glassMat;
      const mesh = new THREE.Mesh(geom, mat.clone());
      mesh.position.y = i * FLOOR_H + FLOOR_H / 2;
      mesh.userData.floor = i + 1;
      mesh.userData.baseColor = new THREE.Color(mat.color);
      towerGroup.add(mesh);
      floors.push(mesh);

      // Bronze edge band every 5 floors
      if (i % 5 === 0 && i > 0) {
        const bandGeom = new THREE.BoxGeometry(w + 0.12, 0.1, d + 0.12);
        const bandMat = new THREE.MeshStandardMaterial({
          color: 0xB0927A, metalness: 0.85, roughness: 0.3, emissive: 0x4a3525,
        });
        const band = new THREE.Mesh(bandGeom, bandMat);
        band.position.y = i * FLOOR_H + FLOOR_H / 2;
        towerGroup.add(band);
      }
    }

    // Facade neon fins and live window pixels add realistic scale.
    const finMat = new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.66 });
    const finGeom = new THREE.BoxGeometry(0.035, TOTAL_H * 0.92, 0.035);
    [
      [-baseW * 0.53, TOTAL_H * 0.48, baseD * 0.53],
      [baseW * 0.53, TOTAL_H * 0.48, baseD * 0.53],
      [-baseW * 0.53, TOTAL_H * 0.48, -baseD * 0.53],
      [baseW * 0.53, TOTAL_H * 0.48, -baseD * 0.53],
    ].forEach((p) => {
      const fin = new THREE.Mesh(finGeom, finMat);
      fin.position.set(p[0], p[1], p[2]);
      towerGroup.add(fin);
    });

    const windowMats = [
      new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.75 }),
      new THREE.MeshBasicMaterial({ color: 0xFF4FD8, transparent: true, opacity: 0.62 }),
      new THREE.MeshBasicMaterial({ color: 0xFFC857, transparent: true, opacity: 0.7 }),
    ];
    const winGeom = new THREE.BoxGeometry(0.055, 0.09, 0.018);
    const windowLights = [];
    for (let f = 2; f < FLOORS; f += 2) {
      const y = f * FLOOR_H + 0.22;
      for (let col = -2; col <= 2; col++) {
        if (Math.random() < 0.36) continue;
        const mat = windowMats[(f + col + 6) % windowMats.length].clone();
        const front = new THREE.Mesh(winGeom, mat);
        front.position.set(col * 0.52, y, baseD * 0.51);
        towerGroup.add(front);
        windowLights.push(front);
        if (Math.random() > 0.42) {
          const side = new THREE.Mesh(winGeom, mat.clone());
          side.position.set(baseW * 0.51, y, col * 0.52);
          side.rotation.y = Math.PI / 2;
          towerGroup.add(side);
          windowLights.push(side);
        }
      }
    }

    // Tiny office interiors: each floor gets a slightly different lived-in layout.
    const officeGroup = new THREE.Group();
    towerGroup.add(officeGroup);
    const officeGeoms = {
      desk: new THREE.BoxGeometry(0.24, 0.035, 0.11),
      chair: new THREE.BoxGeometry(0.055, 0.075, 0.055),
      screen: new THREE.BoxGeometry(0.07, 0.06, 0.012),
      partition: new THREE.BoxGeometry(0.018, 0.19, 0.44),
      light: new THREE.BoxGeometry(0.32, 0.012, 0.018),
      sofa: new THREE.BoxGeometry(0.3, 0.085, 0.12),
      table: new THREE.BoxGeometry(0.12, 0.04, 0.12),
      plantStem: new THREE.BoxGeometry(0.018, 0.09, 0.018),
      plantTop: new THREE.BoxGeometry(0.075, 0.075, 0.075),
      wallPanel: new THREE.BoxGeometry(0.38, 0.18, 0.012),
    };
    const officeMats = {
      desk: new THREE.MeshStandardMaterial({ color: 0xD4A36B, metalness: 0.28, roughness: 0.5, emissive: 0x2a1708, emissiveIntensity: 0.08 }),
      darkDesk: new THREE.MeshStandardMaterial({ color: 0x27314A, metalness: 0.45, roughness: 0.32, emissive: 0x071827, emissiveIntensity: 0.2 }),
      chair: new THREE.MeshStandardMaterial({ color: 0xEAF7FF, metalness: 0.18, roughness: 0.45, transparent: true, opacity: 0.82 }),
      screenCyan: new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.9 }),
      screenPink: new THREE.MeshBasicMaterial({ color: 0xFF4FD8, transparent: true, opacity: 0.78 }),
      screenAmber: new THREE.MeshBasicMaterial({ color: 0xFFC857, transparent: true, opacity: 0.82 }),
      partition: new THREE.MeshStandardMaterial({ color: 0x8D7CFF, metalness: 0.2, roughness: 0.18, transparent: true, opacity: 0.22, emissive: 0x181030, emissiveIntensity: 0.25, depthWrite: false }),
      light: new THREE.MeshBasicMaterial({ color: 0xEAF7FF, transparent: true, opacity: 0.74 }),
      sofa: new THREE.MeshStandardMaterial({ color: 0xB0927A, metalness: 0.12, roughness: 0.65 }),
      plantStem: new THREE.MeshStandardMaterial({ color: 0x27412F, roughness: 0.7 }),
      plantTop: new THREE.MeshBasicMaterial({ color: 0x49E0B8, transparent: true, opacity: 0.82 }),
      wallPanel: new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.24 }),
    };
    const officeLights = [];

    function addOfficeMesh(geom, mat, x, y, z, sx = 1, sy = 1, sz = 1, ry = 0) {
      const m = new THREE.Mesh(geom, mat);
      m.position.set(x, y, z);
      m.scale.set(sx, sy, sz);
      m.rotation.y = ry;
      officeGroup.add(m);
      return m;
    }

    function addWorkstation(x, y, z, screenMat, flip = 1) {
      addOfficeMesh(officeGeoms.desk, Math.random() > 0.55 ? officeMats.desk : officeMats.darkDesk, x, y, z, 1, 1, 1);
      addOfficeMesh(officeGeoms.chair, officeMats.chair, x - 0.11 * flip, y + 0.028, z + 0.055, 1, 1, 1);
      const screen = addOfficeMesh(officeGeoms.screen, screenMat, x + 0.055 * flip, y + 0.07, z - 0.06, 1, 1, 1, flip < 0 ? Math.PI : 0);
      officeLights.push(screen);
    }

    function addPlant(x, y, z) {
      addOfficeMesh(officeGeoms.plantStem, officeMats.plantStem, x, y + 0.035, z, 1, 1, 1);
      addOfficeMesh(officeGeoms.plantTop, officeMats.plantTop, x, y + 0.105, z, 1, 1, 1);
    }

    function buildFloorInterior(floorIndex) {
      if (floorIndex < 2) return;
      const ft = floorIndex / (FLOORS - 1);
      const w = baseW * (1 - ft * 0.16);
      const d = baseD * (1 - ft * 0.16);
      const y = floorIndex * FLOOR_H + 0.18;
      const frontZ = d * 0.32;
      const backZ = -d * 0.22;
      const pattern = floorIndex % 5;
      const palette = [officeMats.screenCyan, officeMats.screenPink, officeMats.screenAmber];

      // Office lights near the facade make each occupied floor readable from outside.
      for (let lx = -1; lx <= 1; lx++) {
        const light = addOfficeMesh(officeGeoms.light, officeMats.light, lx * w * 0.25, y + 0.13, d * 0.45, 1, 1, 1);
        officeLights.push(light);
      }

      if (pattern === 0) {
        [-0.36, 0, 0.36].forEach((x, i) => addWorkstation(x * w, y, frontZ, palette[(floorIndex + i) % palette.length], i % 2 ? -1 : 1));
        addOfficeMesh(officeGeoms.partition, officeMats.partition, -w * 0.18, y + 0.04, backZ, 1, 1, 1);
        addPlant(w * 0.33, y, backZ);
      } else if (pattern === 1) {
        [-0.28, 0.28].forEach((x, i) => addWorkstation(x * w, y, frontZ, palette[(floorIndex + i) % palette.length], 1));
        addOfficeMesh(officeGeoms.sofa, officeMats.sofa, 0, y + 0.02, backZ, 1.25, 1, 1.1);
        addOfficeMesh(officeGeoms.table, officeMats.darkDesk, 0, y + 0.025, backZ + 0.18, 1, 1, 1);
        addPlant(-w * 0.38, y, backZ);
        addPlant(w * 0.38, y, backZ + 0.1);
      } else if (pattern === 2) {
        [-0.42, -0.14, 0.14, 0.42].forEach((x, i) => addWorkstation(x * w, y, frontZ, palette[(floorIndex + i) % palette.length], i % 2 ? -1 : 1));
        addOfficeMesh(officeGeoms.wallPanel, officeMats.wallPanel, 0, y + 0.09, -d * 0.48, 1.35, 1, 1);
      } else if (pattern === 3) {
        addOfficeMesh(officeGeoms.partition, officeMats.partition, -w * 0.3, y + 0.04, frontZ, 1, 1, 1, Math.PI / 2);
        addOfficeMesh(officeGeoms.partition, officeMats.partition, w * 0.08, y + 0.04, frontZ, 1, 1, 1, Math.PI / 2);
        [-0.22, 0.18].forEach((x, i) => addWorkstation(x * w, y, backZ, palette[(floorIndex + i) % palette.length], -1));
        addPlant(w * 0.4, y, frontZ);
      } else {
        [-0.32, 0.32].forEach((x, i) => {
          addOfficeMesh(officeGeoms.sofa, officeMats.sofa, x * w, y + 0.02, frontZ, 0.95, 1, 1);
          addOfficeMesh(officeGeoms.table, officeMats.darkDesk, x * w, y + 0.035, frontZ - 0.17, 0.85, 1, 0.85);
          const panel = addOfficeMesh(officeGeoms.wallPanel, palette[(floorIndex + i) % palette.length], x * w, y + 0.11, -d * 0.47, 0.8, 1, 1);
          officeLights.push(panel);
        });
        addWorkstation(0, y, frontZ + 0.02, palette[floorIndex % palette.length], 1);
      }
    }

    for (let f = 1; f < FLOORS; f++) {
      buildFloorInterior(f);
    }

    // Crown
    const crownGeom = new THREE.ConeGeometry(baseW * 0.42, 1.6, 4);
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xFF6BC1, metalness: 0.7, roughness: 0.3, emissive: 0x600040, emissiveIntensity: 0.6,
    });
    const crown = new THREE.Mesh(crownGeom, crownMat);
    crown.rotation.y = Math.PI / 4;
    crown.position.y = TOTAL_H + 0.8;
    towerGroup.add(crown);
    // Crown light orb
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, emissive: 0x00C8E8, emissiveIntensity: 1.5,
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), orbMat);
    orb.position.y = TOTAL_H + 1.7;
    towerGroup.add(orb);

    // Two side towers (smaller)
    function makeSideTower(x, h, color) {
      const g = new THREE.Group();
      const w = 1.6;
      for (let i = 0; i < h; i++) {
        const t = i / (h - 1);
        const ww = w * (1 - t * 0.14);
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(ww, FLOOR_H * 0.94, ww),
          new THREE.MeshStandardMaterial({
            color, metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.78,
          })
        );
        m.position.y = i * FLOOR_H + FLOOR_H / 2;
        g.add(m);
      }
      g.position.x = x;
      return g;
    }
    const sideL = makeSideTower(-5.5, 32, 0xE0D8F0);
    const sideR = makeSideTower(5.5, 36, 0xD8E8F0);
    scene.add(sideL, sideR);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Secondary urban massing around the sales tower.
    const blockMats = [
      new THREE.MeshStandardMaterial({ color: 0x152238, metalness: 0.72, roughness: 0.22, emissive: 0x071827, emissiveIntensity: 0.24 }),
      new THREE.MeshStandardMaterial({ color: 0x1E1638, metalness: 0.68, roughness: 0.26, emissive: 0x18091C, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0x243126, metalness: 0.6, roughness: 0.34, emissive: 0x0C211A, emissiveIntensity: 0.22 }),
    ];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 8 + (i % 5) * 1.35;
      const h = 1.2 + (i % 7) * 0.58;
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.8 + (i % 3) * 0.26, h, 0.8 + (i % 4) * 0.18),
        blockMats[i % blockMats.length].clone()
      );
      block.position.set(Math.cos(angle) * radius, h / 2, Math.sin(angle) * radius);
      block.rotation.y = -angle + Math.PI / 8;
      cityGroup.add(block);
    }

    const bridgeMat = new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.5 });
    function makeBridge(y, z, color) {
      const mat = bridgeMat.clone();
      mat.color = new THREE.Color(color);
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 11.1, 12), mat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, y, z);
      scene.add(bridge);
      return bridge;
    }
    const bridges = [
      makeBridge(7.8, 0.2, 0x32E6FF),
      makeBridge(12.4, -0.35, 0xFF4FD8),
      makeBridge(17.2, 0.55, 0xB6FF63),
    ];

    // Ground disk
    const groundGeom = new THREE.CircleGeometry(15.5, 96);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x07101D, metalness: 0.54, roughness: 0.45, emissive: 0x02080F,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Ground neon ring
    const ringGeom = new THREE.RingGeometry(10.8, 11.25, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00C8E8, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(4.6, 4.76, 96),
      new THREE.MeshBasicMaterial({ color: 0xFF4FD8, transparent: true, opacity: 0.46, side: THREE.DoubleSide })
    );
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.03;
    scene.add(ring2);

    const gridMat = new THREE.LineBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.16 });
    const gridLines = new THREE.Group();
    for (let i = -7; i <= 7; i++) {
      const g1 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 1.7, 0.05, -13),
        new THREE.Vector3(i * 1.7, 0.05, 13),
      ]);
      const g2 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-13, 0.05, i * 1.7),
        new THREE.Vector3(13, 0.05, i * 1.7),
      ]);
      gridLines.add(new THREE.Line(g1, gridMat));
      gridLines.add(new THREE.Line(g2, gridMat));
    }
    scene.add(gridLines);

    const vehicleMat = new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.88 });
    const trailMat = new THREE.MeshBasicMaterial({ color: 0x32E6FF, transparent: true, opacity: 0.28 });
    const airTraffic = [];
    for (let i = 0; i < 18; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.13), vehicleMat.clone());
      const trail = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.035), trailMat.clone());
      trail.position.x = -0.42;
      g.add(body, trail);
      g.userData.radius = 5.5 + (i % 5) * 1.4;
      g.userData.speed = 0.004 + (i % 4) * 0.0015;
      g.userData.phase = (i / 18) * Math.PI * 2;
      g.userData.height = 4.6 + (i % 6) * 1.35;
      g.userData.dir = i % 2 ? -1 : 1;
      scene.add(g);
      airTraffic.push(g);
    }

    // Mouse / touch drag rotation
    let isDragging = false, lastX = 0, lastY = 0;
    let targetRotY = 0, currentRotY = 0;
    let targetRotX = 0, currentRotX = 0;
    let autoRotate = true;
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      autoRotate = false;
      lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX + dy * 0.005));
      lastX = e.clientX; lastY = e.clientY;
    });
    const stopDrag = () => { isDragging = false; setTimeout(() => { autoRotate = true; }, 1800); };
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('pointerleave', stopDrag);

    // Floor highlight on hover (raycaster)
    const raycaster = new THREE.Raycaster();
    const mouseV = new THREE.Vector2();
    let highlightedFloor = null;
    const floorTag = document.getElementById('tw-floor-tag');
    const fnoEl = document.getElementById('tw-fno');
    const fnameEl = document.getElementById('tw-fname');
    const floorNames = {
      1: 'Grand Lobby', 10: 'Wellness', 25: 'Observatory', 35: 'Sky Lounge', 47: 'Penthouse',
    };
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouseV.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseV.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouseV, camera);
      const hits = raycaster.intersectObjects(floors);
      if (hits.length > 0) {
        const hit = hits[0].object;
        if (highlightedFloor !== hit) {
          // reset previous
          if (highlightedFloor) {
            highlightedFloor.material.emissive = new THREE.Color(0x000000);
            highlightedFloor.material.emissiveIntensity = 0;
          }
          highlightedFloor = hit;
          highlightedFloor.material.emissive = new THREE.Color(0x00C8E8);
          highlightedFloor.material.emissiveIntensity = 0.6;
          // tag
          if (floorTag) {
            const fno = hit.userData.floor;
            fnoEl.textContent = `${fno}F`;
            fnameEl.textContent = floorNames[fno] || `Floor ${fno}`;
            floorTag.classList.add('on');
          }
        }
      } else if (highlightedFloor) {
        highlightedFloor.material.emissive = new THREE.Color(0x000000);
        highlightedFloor.material.emissiveIntensity = 0;
        highlightedFloor = null;
        if (floorTag) floorTag.classList.remove('on');
      }
    });

    // External floor list hover sync
    document.querySelectorAll('.f-item[data-floor]').forEach((item) => {
      const f = parseInt(item.dataset.floor, 10);
      item.addEventListener('mouseenter', () => {
        const m = floors[f - 1];
        if (m) {
          if (highlightedFloor && highlightedFloor !== m) {
            highlightedFloor.material.emissive = new THREE.Color(0x000000);
            highlightedFloor.material.emissiveIntensity = 0;
          }
          highlightedFloor = m;
          m.material.emissive = new THREE.Color(parseInt(getComputedStyle(item).getPropertyValue('--c').trim().replace('#', '0x') || '0x00C8E8', 16));
          m.material.emissiveIntensity = 0.85;
          item.classList.add('hot');
          // Camera tilt to focus on floor
          targetRotX = (TOTAL_H / 2 - f * FLOOR_H) * 0.014;
          autoRotate = false;
        }
      });
      item.addEventListener('mouseleave', () => {
        if (highlightedFloor) {
          highlightedFloor.material.emissive = new THREE.Color(0x000000);
          highlightedFloor.material.emissiveIntensity = 0;
          highlightedFloor = null;
        }
        item.classList.remove('hot');
        setTimeout(() => { autoRotate = true; }, 1500);
      });
    });

    // Animation loop
    let t = 0;
    function loop() {
      t += 0.01;
      if (autoRotate) targetRotY += 0.0024;
      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotX += (targetRotX - currentRotX) * 0.06;
      towerGroup.rotation.y = currentRotY;
      towerGroup.rotation.x = currentRotX * 0.5;
      sideL.rotation.y = currentRotY * 0.85;
      sideR.rotation.y = currentRotY * 0.7;
      cityGroup.rotation.y = currentRotY * 0.18;
      gridLines.rotation.y = currentRotY * 0.08;
      // Camera focus on tower middle
      camera.position.x = Math.sin(currentRotY * 0.1) * 2;
      camera.position.y = 12 - currentRotX * 8;
      camera.lookAt(0, TOTAL_H / 2, 0);
      // Crown orb pulse
      orbMat.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.4;
      ringMat.opacity = 0.55 + Math.sin(t * 2) * 0.2;
      ring2.material.opacity = 0.34 + Math.cos(t * 1.7) * 0.12;
      bridges.forEach((bridge, i) => {
        bridge.material.opacity = 0.36 + Math.sin(t * 2.4 + i) * 0.16;
      });
      for (let i = 0; i < windowLights.length; i++) {
        if (i % 11 === 0) {
          windowLights[i].material.opacity = 0.45 + Math.sin(t * 5 + i) * 0.24;
        }
      }
      for (let i = 0; i < officeLights.length; i++) {
        if (officeLights[i].material && officeLights[i].material.opacity !== undefined) {
          officeLights[i].material.opacity = 0.52 + Math.sin(t * 3.2 + i * 0.37) * 0.22;
        }
      }
      airTraffic.forEach((v) => {
        const a = v.userData.phase + t * v.userData.speed * 100 * v.userData.dir;
        v.position.set(
          Math.cos(a) * v.userData.radius,
          v.userData.height + Math.sin(a * 2) * 0.28,
          Math.sin(a) * v.userData.radius
        );
        v.rotation.y = -a + (v.userData.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      });
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
  }
  initTower3D();

  // ───── 10) Reality UX micro-interactions ─────
  function initRealityUX() {
    const tiltTargets = document.querySelectorAll('.i-card, .int-tile, .lb-tile, .am-img, .city-mask, .mh-stage, .orbit-terminal-wrap, .tw-3d-frame');
    tiltTargets.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (innerWidth < 900) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${py * -4}deg) rotateY(${px * 5}deg) translateY(-3px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });

    const districtItems = Array.from(document.querySelectorAll('.d-item'));
    document.querySelectorAll('.district-node').forEach((node, i) => {
      node.addEventListener('mouseenter', () => districtItems[i]?.classList.add('is-hot'));
      node.addEventListener('mouseleave', () => districtItems[i]?.classList.remove('is-hot'));
    });

    const chapters = document.querySelectorAll('section.ch');
    const viewIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-viewing', entry.isIntersecting));
    }, { threshold: 0.52 });
    chapters.forEach((section) => viewIo.observe(section));
  }
  initRealityUX();

  // ───── 11) Kinetic text system — scan, stream, glitch, word reveal ─────
  function initKineticText() {
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    function wrapWords(el) {
      if (el.dataset.kineticReady === '1') return;
      el.dataset.kineticReady = '1';
      el.dataset.kinetic = el.textContent.trim().replace(/\s+/g, ' ');
      const nodes = Array.from(el.childNodes);
      let index = 0;
      const frag = document.createDocumentFragment();
      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          frag.appendChild(document.createElement('br'));
          return;
        }
        if (node.nodeType !== Node.TEXT_NODE) {
          frag.appendChild(node.cloneNode(true));
          return;
        }
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const span = document.createElement('span');
          span.className = 'kt-word';
          span.style.setProperty('--i', index++);
          span.textContent = part;
          frag.appendChild(span);
        });
      });
      el.textContent = '';
      el.appendChild(frag);
    }

    const titleEls = document.querySelectorAll('.ch-title:not(.flip-title), .d01-title, .hero-sub');
    titleEls.forEach((el) => {
      el.classList.add('kinetic-title');
      wrapWords(el);
    });

    const bodyEls = document.querySelectorAll('.ch-body:not(.line-mask), .d01-sub, .reserve-success');
    bodyEls.forEach((el) => {
      el.classList.add('kinetic-body');
      el.dataset.kinetic = el.textContent.trim().replace(/\s+/g, ' ');
    });

    document.querySelectorAll('.i-meta h3, .am-meta h3, .int-meta h3, .lb-info h4, .d-name, .fname, .stat .v, .mh-textures span')
      .forEach((el, i) => {
        el.classList.add('neon-copy');
        el.style.setProperty('--i', i % 9);
        el.dataset.kinetic = el.textContent.trim();
      });

    document.querySelectorAll('.hero-meta span:not(.dot-sep), .pixel-meta span:not(.dot-sep), .gen-stats span, .gen-panel, .mh-metrics span, .mh-hud span, .mh-hud b, .mh-orbit-hint span:not(.dot-3d), .ot-hud span, .ot-hud b, .ot-hint span:not(.dot-3d), .orbit-meta span:not(.dot-sep), .launch-hud span, .launch-hud b, .tw-metrics span, .foot-tech .t-pill, .stat .k, .cat, .i-tag, .am-badge, .int-meta .tag')
      .forEach((el, i) => {
        el.classList.add('data-stream');
        el.style.setProperty('--i', i % 12);
      });

    const textIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('text-live');
      });
    }, { threshold: 0.24, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.kinetic-title, .kinetic-body, .neon-copy, .data-stream')
      .forEach((el) => textIo.observe(el));
  }
  initKineticText();

  // ───── 12) Image-aware micro SVG vectors — subtle, matched to each visual asset ─────
  function initMicroVectors() {
    const NS = 'http://www.w3.org/2000/svg';
    const targets = [
      { el: document.querySelector('.hero-bg'), variant: 'city', accent: '#32E6FF', accent2: '#FF4FD8' },
      { el: document.querySelector('.sl-bg'), variant: 'lanes', accent: '#32E6FF', accent2: '#B6FF63' },
      { el: document.querySelector('.gen-bg'), variant: 'interior', accent: '#D4A36B', accent2: '#32E6FF' },
      { el: document.querySelector('.mh-bg'), variant: 'city', accent: '#32E6FF', accent2: '#FFC857' },
      { el: document.querySelector('.orbit-bg'), variant: 'orbit', accent: '#32E6FF', accent2: '#B6FF63' },
      ...Array.from(document.querySelectorAll('.city-mask')).map((el) => ({ el, variant: 'plan', accent: '#32E6FF', accent2: '#FFC857' })),
      ...Array.from(document.querySelectorAll('.i-img')).map((el) => ({ el, variant: 'infra', accent: '#49E0B8', accent2: '#8D7CFF' })),
      ...Array.from(document.querySelectorAll('.am-img')).map((el) => ({ el, variant: 'amenity', accent: '#FFC857', accent2: '#32E6FF' })),
      ...Array.from(document.querySelectorAll('.int-img')).map((el) => ({ el, variant: 'interior', accent: '#D4A36B', accent2: '#32E6FF' })),
      ...Array.from(document.querySelectorAll('.lb-img')).map((el) => ({ el, variant: 'material', accent: '#32E6FF', accent2: '#FF4FD8' })),
    ].filter((item) => item.el && !item.el.querySelector(':scope > .micro-vector'));

    function makeEl(name, attrs = {}) {
      const el = document.createElementNS(NS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    }

    function path(d, cls = 'mv-line') {
      return makeEl('path', { d, class: cls, pathLength: '100' });
    }

    function circle(cx, cy, r, cls = 'mv-node') {
      return makeEl('circle', { cx, cy, r, class: cls });
    }

    function poly(points, cls = 'mv-line mv-soft') {
      return makeEl('polyline', { points, class: cls, pathLength: '100' });
    }

    function buildVariant(svg, variant) {
      const g = makeEl('g', { class: `mv-shape mv-${variant}` });
      if (variant === 'city') {
        g.append(
          path('M4 74 C22 58 42 58 58 44 S86 26 98 18', 'mv-line mv-long'),
          path('M8 86 L26 76 L38 82 L54 66 L70 72 L92 54', 'mv-line mv-soft'),
          circle(26, 76, 1.5), circle(54, 66, 1.2), circle(82, 34, 1.4),
          poly('12,22 20,22 20,30 28,30 28,18 36,18', 'mv-line mv-corner')
        );
      } else if (variant === 'lanes') {
        g.append(
          path('M-4 34 C20 26 36 30 58 24 S84 10 104 16', 'mv-line mv-long'),
          path('M-6 50 C22 44 40 52 62 44 S86 34 106 38', 'mv-line mv-long mv-delay'),
          path('M-4 68 C24 62 44 70 66 60 S88 52 104 56', 'mv-line mv-long mv-late'),
          circle(35, 31, 1.1), circle(71, 42, 1.2), circle(88, 55, 1.1)
        );
      } else if (variant === 'plan') {
        g.append(
          path('M18 22 L48 38 L76 28 L88 58 L56 76 L24 62 Z', 'mv-line mv-soft'),
          path('M24 62 L48 38 L56 76', 'mv-line mv-route'),
          circle(18, 22, 1.6), circle(48, 38, 1.4), circle(76, 28, 1.5), circle(56, 76, 1.4)
        );
      } else if (variant === 'infra') {
        g.append(
          poly('10,18 34,18 34,32 56,32 56,46 84,46', 'mv-line mv-circuit'),
          poly('14,78 34,78 34,62 62,62 62,70 88,70', 'mv-line mv-circuit mv-delay'),
          circle(34, 18, 1.5), circle(56, 32, 1.3), circle(62, 70, 1.3), circle(88, 70, 1.5)
        );
      } else if (variant === 'amenity') {
        g.append(
          path('M4 70 C20 58 34 78 50 66 S76 48 96 62', 'mv-line mv-wave'),
          path('M10 82 C25 72 39 88 55 78 S80 62 94 74', 'mv-line mv-wave mv-delay'),
          circle(18, 67, 1.2), circle(50, 66, 1.4), circle(82, 57, 1.1)
        );
      } else if (variant === 'interior') {
        g.append(
          poly('8,8 28,8 28,12 12,12 12,30 8,30 8,8', 'mv-line mv-corner'),
          poly('92,92 72,92 72,88 88,88 88,70 92,70 92,92', 'mv-line mv-corner mv-delay'),
          path('M16 76 C34 58 48 58 64 44 S82 24 94 28', 'mv-line mv-soft')
        );
      } else if (variant === 'orbit') {
        g.append(
          path('M50 104 C45 72 47 36 56 -6', 'mv-line mv-long'),
          path('M2 76 C24 54 72 50 104 66', 'mv-line mv-soft'),
          path('M14 88 C38 70 74 70 98 82', 'mv-line mv-soft mv-delay'),
          circle(52, 70, 1.4), circle(55, 42, 1.2), circle(58, 18, 1.4)
        );
      } else {
        g.append(
          path('M48 12 L74 28 L74 58 L48 76 L22 58 L22 28 Z', 'mv-line mv-crystal'),
          path('M48 12 L48 76 M22 28 L74 58 M74 28 L22 58', 'mv-line mv-soft'),
          circle(48, 12, 1.2), circle(74, 58, 1.1), circle(22, 58, 1.1)
        );
      }
      svg.appendChild(g);
    }

    targets.forEach(({ el, variant, accent, accent2 }, i) => {
      const svg = makeEl('svg', {
        class: `micro-vector micro-vector-${variant}`,
        viewBox: '0 0 100 100',
        preserveAspectRatio: 'none',
        'aria-hidden': 'true',
      });
      svg.style.setProperty('--mv-a', accent);
      svg.style.setProperty('--mv-b', accent2);
      svg.style.setProperty('--mv-delay', `${(i % 7) * 0.42}s`);
      buildVariant(svg, variant);
      el.appendChild(svg);
    });
  }
  initMicroVectors();

  console.info(
    '%cLUMIÈRE 2300 · sample12 v2',
    'color:#00C8E8;font-family:Orbitron;font-size:24px;letter-spacing:8px;font-weight:700;',
    '\nLenis + view-timeline + PixiJS + Three.js — modern scroll active'
  );
})();
