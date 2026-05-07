/* ════════════════════════════════════════════════════
   BUNYANG 25 — TOP 8 PLAYGROUND
   Animation modules — each card is independent
   ════════════════════════════════════════════════════ */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* ─── helpers ─── */
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const bind = (id, out, fmt = v => v) => {
  const inp = $(`#${id}`), o = $(`#${out}`);
  if (!inp || !o) return null;
  o.textContent = fmt(inp.value);
  inp.addEventListener('input', () => { o.textContent = fmt(inp.value); });
  return inp;
};

/* ─────────────────────────────────────────
   01 — HERO SPLIT REVEAL
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="01"]');
  const target = $('.split-text', stage);
  const sub = $('.split-sub', stage);
  const txt = target.dataset.text || target.textContent;
  // Build per-letter spans
  target.innerHTML = '';
  [...txt].forEach(ch => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    target.appendChild(span);
  });
  const letters = $$('span', target);

  const iS = bind('i01s', 'o01s');
  const iD = bind('i01d', 'o01d');
  const iE = $('#i01e');

  function play() {
    const stagger = +iS.value, dur = +iD.value, ease = iE.value;
    letters.forEach(l => l.classList.remove('in'));
    sub.classList.remove('in');
    void target.offsetWidth; // reflow
    letters.forEach((l, i) => {
      l.style.setProperty('--d', `${dur}ms`);
      l.style.setProperty('--e', ease);
      l.style.setProperty('--delay', `${i * stagger}ms`);
      requestAnimationFrame(() => l.classList.add('in'));
    });
    setTimeout(() => sub.classList.add('in'), letters.length * stagger);
  }
  $('[data-play="01"]').addEventListener('click', play);
  // play on first scroll-in
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   02 — WORD MASK REVEAL
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="02"]');
  const lines = $$('.line-mask', stage);

  const iS = bind('i02s', 'o02s');
  const iD = bind('i02d', 'o02d');
  const iE = $('#i02e');

  function play() {
    const stagger = +iS.value, dur = +iD.value, ease = iE.value;
    lines.forEach(l => l.classList.remove('in'));
    void stage.offsetWidth;
    lines.forEach((l, i) => {
      l.style.setProperty('--d', `${dur}ms`);
      l.style.setProperty('--e', ease);
      l.style.setProperty('--delay', `${i * stagger}ms`);
      const inner = $('span', l);
      inner.style.setProperty('--d', `${dur}ms`);
      inner.style.setProperty('--e', ease);
      inner.style.setProperty('--delay', `${i * stagger}ms`);
      inner.style.transitionDelay = `${i * stagger}ms`;
      requestAnimationFrame(() => l.classList.add('in'));
    });
  }
  $('[data-play="02"]').addEventListener('click', play);
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   03 — HANGUL · HANJA STAGGER
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="03"]');
  const items = $$('.hj-item', stage);

  const iS = bind('i03s', 'o03s');
  const iD = bind('i03d', 'o03d');
  const iY = bind('i03y', 'o03y');

  function play() {
    const stagger = +iS.value, dur = +iD.value, y = +iY.value;
    items.forEach(it => {
      it.classList.remove('in');
      it.style.transform = `translateY(${y}px)`;
    });
    void stage.offsetWidth;
    items.forEach((it, i) => {
      it.style.setProperty('--d', `${dur}ms`);
      it.style.setProperty('--delay', `${i * stagger}ms`);
      requestAnimationFrame(() => it.classList.add('in'));
    });
  }
  $('[data-play="03"]').addEventListener('click', play);
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   04 — SEQUENCE CROSSFADE (Ken Burns)
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="04"]');
  const frames = $$('.seq-frame', stage);
  const tags = $$('.seq-tag', stage);

  const iH = bind('i04h', 'o04h', v => Number(v).toFixed(1));
  const iF = bind('i04f', 'o04f', v => Number(v).toFixed(1));
  const iK = bind('i04k', 'o04k', v => Number(v).toFixed(2));

  let token = 0;
  function show(i) {
    frames.forEach((f, idx) => f.classList.toggle('in', idx === i));
    tags.forEach((t, idx) => t.classList.toggle('active', idx === i));
  }
  async function play() {
    const myToken = ++token;
    const hold = +iH.value * 1000, fade = +iF.value * 1000, k = +iK.value;
    frames.forEach(f => {
      f.style.transition = `opacity ${fade}ms ease, transform ${(hold + fade) * 1.2}ms linear`;
      f.style.setProperty('--k', k);
    });
    for (let i = 0; i < frames.length; i++) {
      if (token !== myToken) return;
      show(i);
      await wait(hold);
    }
    if (token === myToken) show(0);
  }
  $('[data-play="04"]').addEventListener('click', play);
  tags.forEach((t, i) => t.addEventListener('click', () => { token++; show(i); }));
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   05 — SCROLL PIN (Auto-driven within viewport)
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="05"]');
  const headline = $('.pin-headline', stage);
  const pages = $$('.pin-page', stage);

  const iS = bind('i05s', 'o05s', v => Number(v).toFixed(1));
  const iM = $('#i05m');

  let token = 0;
  async function play() {
    const myToken = ++token;
    const speed = +iS.value;
    const dwell = 1100 / speed;
    pages.forEach(p => p.classList.remove('show'));
    headline.style.transform = 'scale(1)'; headline.style.opacity = 1;
    await wait(200);
    for (let i = 0; i < pages.length; i++) {
      if (token !== myToken) return;
      const progress = (i + 1) / pages.length;
      // Pin scaling
      headline.style.transition = `transform ${dwell}ms ${iM.value === 'snap' ? 'cubic-bezier(.7,0,.3,1)' : 'ease'}, opacity ${dwell}ms ease`;
      headline.style.transform = `scale(${1 - progress * 0.18})`;
      headline.style.opacity = `${Math.max(0.35, 1 - progress * 0.7)}`;
      pages[i].classList.add('show');
      // Hide previous (push effect)
      if (i > 0) pages[i - 1].classList.remove('show');
      await wait(dwell);
    }
    if (token === myToken) {
      pages.forEach(p => p.classList.remove('show'));
      headline.style.transform = 'scale(1)'; headline.style.opacity = 1;
    }
  }
  $('[data-play="05"]').addEventListener('click', play);
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   06 — PARALLAX LAYER FLOAT
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="06"]');
  const par = $('.par-stage', stage);
  const base = $('.par-base', par);
  const l1 = $('.par-line.l1', par);
  const l2 = $('.par-line.l2', par);
  const ball = $('.par-ball', par);
  const shadow = $('.par-shadow', par);

  const iD = bind('i06d', 'o06d');
  const iP = bind('i06p', 'o06p', v => Number(v).toFixed(1));
  const iM = bind('i06m', 'o06m');

  let mx = 0, my = 0, running = true, t0 = performance.now();

  par.addEventListener('mousemove', (e) => {
    const r = par.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  });
  par.addEventListener('mouseleave', () => { mx = 0; my = 0; });

  function tick(t) {
    if (!running) return;
    const period = +iP.value * 1000;
    const amp = +iD.value;
    const mAmp = +iM.value;
    const phase = (t - t0) / period * Math.PI * 2;
    const yFloat = Math.sin(phase) * amp;
    const sFloat = Math.sin(phase + 0.3) * (amp * 0.6);
    base.style.transform   = `translate3d(${mx * mAmp * 0.3}px, ${my * mAmp * 0.3}px, 0)`;
    l1.style.transform     = `translate3d(${mx * mAmp * 0.6}px, ${my * mAmp * 0.6}px, 0)`;
    l2.style.transform     = `translate3d(${mx * mAmp * 0.4}px, ${my * mAmp * 0.4}px, 0)`;
    ball.style.transform   = `translate3d(${mx * mAmp * 1.4}px, ${my * mAmp * 1.4 + yFloat}px, 0)`;
    shadow.style.transform = `translate3d(${mx * mAmp * 1.4}px, 0, 0) scaleX(${1 - Math.abs(yFloat) / amp * 0.25})`;
    shadow.style.opacity   = `${0.6 + sFloat / amp * 0.2}`;
    requestAnimationFrame(tick);
  }
  $('[data-play="06"]').addEventListener('click', () => { running = false; setTimeout(() => { running = true; t0 = performance.now(); requestAnimationFrame(tick); }, 50); });
  requestAnimationFrame(tick);
})();

/* ─────────────────────────────────────────
   07 — NOISE GRAIN VEIL
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="07"]');
  const noiseEl = $('.noise-stage', stage);
  const out = $('#ngOut');

  const iO = bind('i07o', 'o07o');
  const iF = bind('i07f', 'o07f', v => Number(v).toFixed(2));
  const iB = $('#i07b');

  function applyLocal() {
    const op = +iO.value / 100;
    noiseEl.style.setProperty('--no-op', op);
    if (out) out.textContent = iO.value;
    // Update CSS via setProperty doesn't reach ::before; use direct stylesheet rule via inline class
    const rule = `.noise-stage::before{opacity:${op};mix-blend-mode:${iB.value};background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${iF.value}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='400' height='400' filter='url(%23n)'/></svg>");}`;
    let s = $('#noiseStyle');
    if (!s) {
      s = document.createElement('style');
      s.id = 'noiseStyle';
      document.head.appendChild(s);
    }
    s.textContent = rule;
  }

  iO.addEventListener('input', applyLocal);
  iF.addEventListener('input', applyLocal);
  iB.addEventListener('change', applyLocal);
  applyLocal();

  // Global toggle
  const veilBtn = $('#veilToggle');
  veilBtn.addEventListener('click', () => {
    const on = veilBtn.getAttribute('aria-pressed') === 'true';
    veilBtn.setAttribute('aria-pressed', String(!on));
    document.body.classList.toggle('veil-on', !on);
  });
  $('[data-play="07"]').addEventListener('click', () => {
    const on = veilBtn.getAttribute('aria-pressed') === 'true';
    veilBtn.setAttribute('aria-pressed', String(!on));
    document.body.classList.toggle('veil-on', !on);
  });
})();

/* ─────────────────────────────────────────
   08 — GOLD UNDERLINE (auto-cycle + hover)
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="08"]');
  const links = $$('.under-link', stage);

  const iD = bind('i08d', 'o08d');
  const iC = $('#i08c');
  const iT = bind('i08t', 'o08t');
  const auEvery = $('#auEvery');

  function applyVars() {
    links.forEach(l => {
      l.style.setProperty('--ud', `${iD.value}ms`);
      l.style.setProperty('--uc', iC.value);
      l.style.setProperty('--ut', `${iT.value}px`);
    });
  }
  iD.addEventListener('input', applyVars);
  iC.addEventListener('change', applyVars);
  iT.addEventListener('input', applyVars);
  applyVars();

  let timer = null, idx = 0;
  function startCycle() {
    stopCycle();
    timer = setInterval(() => {
      links.forEach(l => l.classList.remove('cycle'));
      links[idx].classList.add('cycle');
      idx = (idx + 1) % links.length;
    }, 3000);
    // immediate first
    links.forEach(l => l.classList.remove('cycle'));
    links[0].classList.add('cycle');
    idx = 1;
  }
  function stopCycle() {
    if (timer) { clearInterval(timer); timer = null; }
    links.forEach(l => l.classList.remove('cycle'));
  }
  $('[data-play="08"]').addEventListener('click', () => {
    if (timer) stopCycle(); else startCycle();
  });
  startCycle();
})();

/* ─────────────────────────────────────────
   09 — STATUS BADGE PULSE (anadd 게이트)
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="09"]');
  const cards = $$('.status-card', stage);
  const badges = $$('.sc-badge', stage);

  const iP = bind('i09p', 'o09p', v => Number(v).toFixed(1));
  const iS = bind('i09s', 'o09s', v => Number(v).toFixed(1));
  const iC = bind('i09c', 'o09c');

  function applyPulse() {
    badges.forEach(b => {
      b.style.setProperty('--pp', `${iP.value}s`);
      b.style.setProperty('--ps', iS.value);
    });
  }
  iP.addEventListener('input', applyPulse);
  iS.addEventListener('input', applyPulse);
  applyPulse();

  function play() {
    const stagger = +iC.value;
    cards.forEach(c => c.classList.remove('in'));
    void stage.offsetWidth;
    cards.forEach((c, i) => {
      c.style.setProperty('--delay', `${i * stagger}ms`);
      requestAnimationFrame(() => c.classList.add('in'));
    });
  }
  $('[data-play="09"]').addEventListener('click', play);
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   10 — COUNTER UP (스펙 카운트업)
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="10"]');
  const nums = $$('.cu-num', stage);

  const iD = bind('i10d', 'o10d', v => Number(v).toFixed(1));
  const iE = $('#i10e');

  const easings = {
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    linear: t => t,
  };

  let token = 0;
  function play() {
    const myToken = ++token;
    const dur = +iD.value * 1000;
    const ease = easings[iE.value] || easings.easeOutCubic;
    nums.forEach(el => {
      const target = +el.dataset.target;
      const start = performance.now();
      function tick(t) {
        if (token !== myToken) return;
        const k = Math.min((t - start) / dur, 1);
        el.textContent = Math.round(target * ease(k)).toLocaleString();
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  $('[data-play="10"]').addEventListener('click', play);
  observeOnce(stage, play);
})();

/* ─────────────────────────────────────────
   11 — SOSO BG INFINITE PAN
   ───────────────────────────────────────── */
(() => {
  const stage = $('[data-stage="11"]');
  const bg = $('.soso-bg', stage);

  const iP = bind('i11p', 'o11p', v => Number(v).toFixed(1));
  const iD = $('#i11d');
  const iE = $('#i11e');

  function applyAnim() {
    bg.style.animation = `soso_bg ${iP.value}s ${iE.value} infinite ${iD.value}`;
  }
  iP.addEventListener('input', applyAnim);
  iD.addEventListener('change', applyAnim);
  iE.addEventListener('change', applyAnim);
  applyAnim();

  let paused = false;
  $('[data-play="11"]').addEventListener('click', () => {
    paused = !paused;
    bg.classList.toggle('paused', paused);
  });
})();

/* ─────────────────────────────────────────
   INSIGHT — 8개 사이트 비교 분석
   별점 렌더 + 평가 바 애니 + 차트 애니 + 정렬 탭
   ───────────────────────────────────────── */
(() => {
  const insight = $('#insight');
  if (!insight) return;

  // ★ render stars (10-star scale, supports half via 0.1 increments)
  $$('.rc-stars', insight).forEach(el => {
    const score = +el.dataset.score; // out of 10
    const filled = Math.round(score);
    let html = '';
    for (let i = 1; i <= 10; i++) {
      html += `<span class="star${i <= filled ? ' f' : ''}">★</span>`;
    }
    html += ` <span class="star-num">${score.toFixed(1)} / 10</span>`;
    el.innerHTML = html;
  });

  // bar fill + chart fill on enter
  function fillBars() {
    $$('.rc-bar', insight).forEach(b => b.classList.add('in'));
    $$('.ca-b', insight).forEach(b => b.classList.add('in'));
  }
  observeOnce(insight, fillBars);

  // sort/filter tabs
  const tabs = $$('.i-tab', insight);
  const grid = $('#rankGrid', insight);
  const cards = $$('.rank-card', grid);

  function sortBy(key) {
    const list = cards.slice().sort((a, b) => {
      const av = key === 'rank' ? +a.dataset.rank : -(+a.dataset[key]);
      const bv = key === 'rank' ? +b.dataset.rank : -(+b.dataset[key]);
      return av - bv;
    });
    list.forEach(c => grid.appendChild(c));
    cards.forEach(c => c.classList.remove('dim'));
    if (key !== 'rank') {
      // dim all but top 3 in this axis
      list.slice(3).forEach(c => c.classList.add('dim'));
    }
    // refresh bars
    requestAnimationFrame(() => {
      $$('.rc-bar', insight).forEach(b => b.classList.remove('in'));
      void grid.offsetWidth;
      $$('.rc-bar', insight).forEach(b => b.classList.add('in'));
    });
  }

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.toggle('active', x === t));
    sortBy(t.dataset.sort);
  }));
})();

/* ─── observe & play once when card scrolls in ─── */
function observeOnce(el, fn) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        fn();
        io.disconnect();
      }
    });
  }, { threshold: 0.4 });
  io.observe(el);
}

/* ─── nav active highlight ─── */
(() => {
  const navLinks = $$('.nav a');
  const cards = $$('.card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4 });
  cards.forEach(c => io.observe(c));
})();
