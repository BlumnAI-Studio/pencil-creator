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

  // ───── 6) PixiJS Sky-lane traffic — photoreal car sprites on screen-blend ─────
  if (typeof PIXI !== 'undefined') {
    const canvas = document.getElementById('sl-pixi');
    if (canvas) {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: canvas.parentElement || window,
        backgroundAlpha: 0,
        antialias: true,
      });
      const laneY = (i, h) => h * (0.28 + i * 0.13);
      const laneSpeed = [-1.6, -2.2, 1.2, 2.0, 0.8]; // 5 lanes
      const carUrls = ['img/car-cyan.png', 'img/car-magenta.png', 'img/car-violet.png'];
      const tints = [0xB5FF3A, 0x00C8E8, 0xFF6BC1, 0x8B6FFF, 0xFFB800];

      Promise.all(carUrls.map((url) => PIXI.Assets.load(url).catch(() => null))).then((textures) => {
        const valid = textures.filter(Boolean);
        if (valid.length === 0) return;
        const cars = [];
        const NUM = 14;
        for (let i = 0; i < NUM; i++) {
          const lane = Math.floor(Math.random() * 5);
          const tex = valid[Math.floor(Math.random() * valid.length)];
          const sprite = new PIXI.Sprite(tex);
          sprite.anchor.set(0.5);
          // size — small flying cars (60-90px tall) fit in lane corridor
          const targetH = 50 + Math.random() * 30;
          const ratio = tex.width / tex.height;
          sprite.height = targetH;
          sprite.width = targetH * ratio;
          sprite.x = Math.random() * app.screen.width;
          sprite.y = laneY(lane, app.screen.height);
          sprite.alpha = 0.92;
          // Slight color tint variation per lane
          sprite.tint = tints[lane];
          sprite._lane = lane;
          sprite._speed = laneSpeed[lane] * (0.7 + Math.random() * 0.6);
          // flip horizontally if speed is negative so they face direction
          if (sprite._speed < 0) sprite.scale.x = -Math.abs(sprite.scale.x);
          else sprite.scale.x = Math.abs(sprite.scale.x);
          // depth via scale + alpha
          const depth = 0.7 + Math.random() * 0.5;
          sprite.scale.x *= depth;
          sprite.scale.y *= depth;
          sprite.alpha *= depth;
          app.stage.addChild(sprite);
          cars.push(sprite);
        }
        app.ticker.add((delta) => {
          for (const c of cars) {
            c.x += c._speed * delta;
            const w = Math.abs(c.width) + 80;
            if (c._speed < 0 && c.x < -w) c.x = app.screen.width + w;
            if (c._speed > 0 && c.x > app.screen.width + w) c.x = -w;
            c.y = laneY(c._lane, app.screen.height);
          }
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
      moss: 0x4DD0B0,
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
      ground.addChild(g);
    }

    // Cyber cars (pixel sprites)
    const carContainer = new PIXI.Container();
    app.stage.addChild(carContainer);
    const cars = [];
    function makeCar() {
      const c = new PIXI.Graphics();
      const colors = [PAL.neonC, PAL.neonM, PAL.neonV, PAL.win2];
      const color = colors[Math.floor(Math.random() * colors.length)];
      c.beginFill(0x1A0B3D).drawRect(0, 1, 10, 3).endFill();
      c.beginFill(color, 0.95).drawRect(1, 0, 8, 3).endFill();
      c.beginFill(0xFFFFFF, 0.7).drawRect(2, 0, 1, 1).endFill();
      // glow trail
      c.beginFill(color, 0.45).drawRect(-2, 1, 2, 2).endFill();
      c.beginFill(color, 0.2).drawRect(-5, 1, 3, 2).endFill();
      return c;
    }
    function spawnCars() {
      carContainer.removeChildren();
      cars.length = 0;
      const w = W(), h = H();
      const lanes = [h * 0.36, h * 0.46, h * 0.56];
      for (let i = 0; i < 14; i++) {
        const lane = Math.floor(Math.random() * lanes.length);
        const car = makeCar();
        car.x = Math.random() * w;
        car.y = lanes[lane];
        car._lane = lane;
        car._speed = 0.4 + Math.random() * 0.8;
        if (Math.random() < 0.5) {
          car._speed = -car._speed;
          car.scale.x = -1;
        }
        carContainer.addChild(car);
        cars.push(car);
      }
    }

    // Pixel humanoids walking on ground
    const humContainer = new PIXI.Container();
    app.stage.addChild(humContainer);
    const humans = [];
    function makeHuman(color) {
      const c = new PIXI.Container();
      const g = new PIXI.Graphics();
      g.beginFill(color).drawRect(0, 0, 3, 2).endFill(); // head
      g.beginFill(0xFFFFFF, 0.9).drawRect(1, 0, 1, 1).endFill(); // visor
      g.beginFill(color).drawRect(0, 2, 3, 4).endFill(); // body
      g.beginFill(0xFFFFFF, 0.4).drawRect(0, 6, 1, 2).endFill(); // leg L
      g.beginFill(0xFFFFFF, 0.4).drawRect(2, 6, 1, 2).endFill(); // leg R
      c.addChild(g);
      return c;
    }
    function spawnHumans() {
      humContainer.removeChildren();
      humans.length = 0;
      const w = W(), h = H();
      for (let i = 0; i < 10; i++) {
        const colors = [0xFFFFFF, PAL.neonC, PAL.neonM, PAL.win2];
        const h_ = makeHuman(colors[Math.floor(Math.random() * colors.length)]);
        h_.x = Math.random() * w;
        h_.y = h * 0.86 + Math.floor(Math.random() * 14);
        h_._speed = (0.15 + Math.random() * 0.25) * (Math.random() < 0.5 ? -1 : 1);
        if (h_._speed < 0) h_.scale.x = -1;
        h_._frame = Math.random() * 30;
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
      signContainer.addChild(g);
    }

    // Build all
    function rebuild() {
      drawSky();
      drawSkyline();
      drawMegaTowers();
      drawGround();
      drawSign();
      spawnCars();
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
        const carW = 14;
        if (c._speed < 0 && c.x < -carW) c.x = w + carW;
        if (c._speed > 0 && c.x > w + carW) c.x = -carW;
      }
      // humans walking
      for (const h_ of humans) {
        h_.x += h_._speed * delta;
        h_._frame += delta;
        // walk cycle bobs y by 1 pixel
        const bob = Math.floor(Math.sin(h_._frame * 0.3) * 0.5 + 0.5);
        h_.pivot.y = -bob;
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
    scene.fog = new THREE.Fog(0xE6D9F0, 22, 60);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(0, 12, 30);
    camera.lookAt(0, 12, 0);

    function updateCamera() {
      const r = canvas.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    }
    updateCamera();
    addEventListener('resize', updateCamera);

    // Lighting — light cyberpunk
    const ambient = new THREE.AmbientLight(0xE0D5F0, 0.7);
    scene.add(ambient);
    const sunLight = new THREE.DirectionalLight(0xFFE890, 0.85);
    sunLight.position.set(8, 18, 12);
    scene.add(sunLight);
    const cyanFill = new THREE.PointLight(0x00C8E8, 1.2, 30);
    cyanFill.position.set(-8, 14, 10);
    scene.add(cyanFill);
    const magentaFill = new THREE.PointLight(0xFF6BC1, 1.0, 26);
    magentaFill.position.set(10, 8, -8);
    scene.add(magentaFill);

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
      color: 0xFFFFFF, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.92,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xC0DCE8, metalness: 0.6, roughness: 0.15, transparent: true, opacity: 0.6,
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

    // Ground disk
    const groundGeom = new THREE.CircleGeometry(14, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xEFE5F5, metalness: 0.3, roughness: 0.7,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Ground neon ring
    const ringGeom = new THREE.RingGeometry(11, 11.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00C8E8, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

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
      // Camera focus on tower middle
      camera.position.x = Math.sin(currentRotY * 0.1) * 2;
      camera.position.y = 12 - currentRotX * 8;
      camera.lookAt(0, TOTAL_H / 2, 0);
      // Crown orb pulse
      orbMat.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.4;
      ringMat.opacity = 0.55 + Math.sin(t * 2) * 0.2;
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
  }
  initTower3D();

  console.info(
    '%cLUMIÈRE 2300 · sample12 v2',
    'color:#00C8E8;font-family:Orbitron;font-size:24px;letter-spacing:8px;font-weight:700;',
    '\nLenis + view-timeline + PixiJS + Three.js — modern scroll active'
  );
})();
