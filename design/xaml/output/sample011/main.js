/* ════════════════════════════════════════════════════════════════
   LUMIÈRE FUTUR · sample011 — Interactive runtime
   - 6 anadd/herenn 기법: section snap / trajan stack / ken-burns /
                          soso loop / building popup / mouse parallax
   - 5 신규: cursor glow / 3D tilt / counter-up / stroke-draw / stagger reveal
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═════════ 1) Cursor glow (신규) ═════════
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    const easeTo = () => {
      gx += (tx - gx) * 0.16;
      gy += (ty - gy) * 0.16;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(easeTo);
    };
    requestAnimationFrame(easeTo);
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('visible');
    });
    window.addEventListener('mouseleave', () => glow.classList.remove('visible'));
  }

  // ═════════ 2) IntersectionObserver — stagger reveal (신규 + Trajan stack 영입) ═════════
  const motionEls = document.querySelectorAll('[data-reveal]');
  const sectionEls = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  motionEls.forEach((el) => io.observe(el));

  // section-level "in" toggling for soso letter-spacing & tower elev
  const sio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.soso, .tower-elev').forEach((el) => sio.observe(el));

  // amen-card individual reveal with building-popup pattern
  const amenIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        amenIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.amen-card').forEach((el) => amenIo.observe(el));

  // ═════════ 3) Counter-up (신규) ═════════
  const counters = document.querySelectorAll('.counter');
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target || '0');
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1700;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out quart
        const eased = 1 - Math.pow(1 - t, 4);
        const val = target * eased;
        el.textContent = prefix + (decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countIo.observe(el));

  // ═════════ 4) Mouse parallax (anadd/herenn 영입 — data-depth) ═════════
  const scenes = document.querySelectorAll('[data-mouse-scene]');
  scenes.forEach((scene) => {
    const layers = scene.querySelectorAll('[data-depth]');
    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onMove = (e) => {
      const rect = scene.getBoundingClientRect();
      tx = (e.clientX - rect.left - rect.width / 2);
      ty = (e.clientY - rect.top - rect.height / 2);
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth || '0.1');
        layer.style.transform = `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
  });

  // ═════════ 5) 3D tilt cards (신규) ═════════
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    let rx = 0, ry = 0, trx = 0, tryR = 0;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      tryR = (px - 0.5) * 12; // rotate Y
      trx = (0.5 - py) * 10;  // rotate X
    });
    el.addEventListener('mouseleave', () => { trx = 0; tryR = 0; });
    const tick = () => {
      rx += (trx - rx) * 0.16;
      ry += (tryR - ry) * 0.16;
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // ═════════ 6) Floor lines stagger draw (Tower hero) ═════════
  document.querySelectorAll('.floor-line').forEach((line, i) => {
    line.style.setProperty('--i', i);
  });

  // ═════════ 7) Tower elevation — generate floor ticks + scroll progress ═════════
  const teGroup = document.querySelector('.te-floors');
  if (teGroup) {
    const totalFloors = 47;
    const top = 60;
    const bottom = 660;
    const step = (bottom - top) / totalFloors;
    let html = '';
    for (let i = 0; i < totalFloors; i++) {
      const y = top + step * i;
      html += `<line class="te-floor-line" x1="320" y1="${y}" x2="480" y2="${y}" pathLength="100"/>`;
    }
    teGroup.innerHTML = html;
  }
  // tower-elev highlight scroll-driven
  const towerSec = document.querySelector('#tower');
  const teHighlight = document.querySelector('.te-highlight');
  if (towerSec && teHighlight) {
    const labels = [
      { y: 660, label: '1F · LOBBY' },
      { y: 500, label: '10F · GYM' },
      { y: 320, label: '25F · OBSERVATORY' },
      { y: 200, label: '35F · SKY LOUNGE' },
      { y: 80,  label: '47F · PENTHOUSE' },
    ];
    window.addEventListener('scroll', () => {
      const rect = towerSec.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      // visibility 0..1
      const visible = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      const idx = Math.min(labels.length - 1, Math.floor(visible * labels.length));
      teHighlight.setAttribute('y', labels[idx].y);
    }, { passive: true });
  }

  // ═════════ 8) Section rail dots — active state on scroll ═════════
  const dots = document.querySelectorAll('.rail-dot');
  const railIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dots.forEach((d) => d.classList.remove('active'));
      const dot = document.querySelector(`.rail-dot[href="#${id}"]`);
      if (dot) dot.classList.add('active');
    });
  }, { threshold: 0.5 });
  sectionEls.forEach((s) => railIo.observe(s));

  // ═════════ 9) Interior — Apple sticky horizontal scrub ═════════
  // Vertical scroll within the section translates the horizontal track.
  const interiorSection = document.getElementById('interior');
  const hpinTrack = document.getElementById('hpin-track');
  const hpinName = document.getElementById('hpin-name');
  const hpinCur = document.getElementById('hpin-cur');
  const hpinSegs = document.querySelectorAll('.hpin-progress .seg');
  if (interiorSection && hpinTrack) {
    const cards = hpinTrack.querySelectorAll('.hpin-card');
    const names = ['LIVING · 134㎡', 'KITCHEN · BOFFI', 'MASTER · 23.4㎡', 'BATH · STONE'];

    const updateHpin = () => {
      const rect = interiorSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = interiorSection.offsetHeight - vh;
      const scrolled = -rect.top;
      const pl = Math.max(0, Math.min(1, scrolled / Math.max(1, totalScroll)));

      // Total horizontal travel = scrollWidth - viewport width
      const travel = hpinTrack.scrollWidth - window.innerWidth;
      hpinTrack.style.transform = `translate3d(${(-pl * travel).toFixed(2)}px, 0, 0)`;

      // Active card detection
      const idx = Math.min(cards.length - 1, Math.floor(pl * cards.length + 0.0001));
      cards.forEach((c, i) => {
        // active when card is mostly visible — use position within travel
        c.classList.toggle('in', i === idx);
      });
      if (hpinName) hpinName.textContent = names[idx];
      if (hpinCur) hpinCur.textContent = String(idx + 1).padStart(2, '0');
      hpinSegs.forEach((seg, i) => {
        seg.classList.toggle('active', i === idx);
        seg.classList.toggle('passed', i < idx);
      });
    };

    // Hook into existing scroll listener
    const _orig = window.onscroll;
    const hpinScroll = () => { requestAnimationFrame(updateHpin); };
    window.addEventListener('scroll', hpinScroll, { passive: true });
    window.addEventListener('resize', hpinScroll, { passive: true });
    // initial run after DOM paint
    setTimeout(updateHpin, 50);
  }

  // ═════════ 10) Holographic border angle (신규: hueRotate on scroll) ═════════
  // Subtle: rotate the linear-gradient angle via CSS variable as user scrolls
  const root = document.documentElement;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const angle = (y * 0.1) % 360;
    root.style.setProperty('--holo-angle', `${angle}deg`);
    lastScroll = y;
  }, { passive: true });

  // ═════════ 11) Topbar transparency on scroll past hero ═════════
  const topbar = document.querySelector('.topbar');
  const heroSec = document.querySelector('.hero');
  if (topbar && heroSec) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        topbar.style.background = entry.isIntersecting
          ? 'rgba(250, 250, 250, 0.45)'
          : 'rgba(250, 250, 250, 0.92)';
      });
    }, { threshold: 0.15 });
    tio.observe(heroSec);
  }

  // ════════════════════════════════════════════════════════════════
  //  APPLE-STYLE SCROLL ENGINE — section progress + scrolly stages
  // ════════════════════════════════════════════════════════════════

  // ease-out cubic
  const easeOut = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  // ───── 12) Per-section progress (--p) ─────
  // p = 0 when section top hits viewport bottom; 1 when section bottom passes viewport top
  const progressSections = document.querySelectorAll('.section');
  const updateSectionProgress = () => {
    const vh = window.innerHeight;
    progressSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const span = rect.height + vh;
      const traveled = vh - rect.top;
      const p = clamp01(traveled / span);
      sec.style.setProperty('--p', p.toFixed(3));
      sec.style.setProperty('--pe', easeOut(p).toFixed(3));
    });
  };

  // ───── 13) Sticky scrollytelling — local progress over the track ─────
  // Each .scrolly has a height = (steps + 1) * 100vh; a sticky child holds the visual.
  // Local progress (0..1) advances as you scroll past the track.
  const scrollyStages = document.querySelectorAll('.scrolly');
  const updateScrolly = () => {
    const vh = window.innerHeight;
    scrollyStages.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      const totalScroll = stage.offsetHeight - vh;
      const scrolled = -rect.top;
      const pl = clamp01(scrolled / Math.max(1, totalScroll));
      stage.style.setProperty('--pl', pl.toFixed(3));

      // step toggling within the stage
      const steps = stage.querySelectorAll('[data-step]');
      if (steps.length > 0) {
        const idx = Math.min(steps.length - 1, Math.floor(pl * steps.length));
        steps.forEach((s, i) => {
          s.classList.toggle('active', i === idx);
        });
        // step rail ticks
        const ticks = stage.querySelectorAll('.tick');
        ticks.forEach((t, i) => t.classList.toggle('active', i <= idx));
      }

      // crossfade frames
      const frames = stage.querySelectorAll('.crossfade-stage > .frame');
      if (frames.length > 0) {
        const idx = Math.min(frames.length - 1, Math.floor(pl * frames.length));
        frames.forEach((f, i) => f.classList.toggle('active', i === idx));
      }

      // tower floor overlay positioning
      const overlay = stage.querySelector('.floor-overlay');
      const floorTag = stage.querySelector('.floor-tag');
      const floorStops = stage.dataset.floorStops;
      if (overlay && floorTag && floorStops) {
        const stops = JSON.parse(floorStops); // [{top:'82%', tag:'1F · LOBBY'}, ...]
        const idx = Math.min(stops.length - 1, Math.floor(pl * stops.length));
        overlay.style.top = stops[idx].top;
        floorTag.style.top = `calc(${stops[idx].top} - 20px)`;
        floorTag.textContent = stops[idx].tag;
      }
    });
  };

  // RAF-driven scroll listener
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateSectionProgress();
        updateScrolly();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // initial
  updateSectionProgress();
  updateScrolly();

  // ═════════ Init log ═════════
  console.info(
    '%cLUMIÈRE FUTUR · sample011',
    'color:#00D4D4;font-family:Cormorant Garamond;font-size:24px;letter-spacing:6px;',
    '\n6 영입 기법 + 5 신규 인터랙션 활성화'
  );
})();
