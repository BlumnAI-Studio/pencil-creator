/* ===================================================================
   sample010 — CAT17 Character Animation · Avatar Studio
   ─────────────────────────────────────────────────────────────────
   WPF → Web mapping (via design/xaml/sample/39~44.xaml):
     RectAnimation (sprite walk)        → CSS @keyframes + steps
     ScaleTransform non-uniform         → transform: scale + cubic-bezier
     SineEase + AutoReverse + Forever   → ease-in-out alternate infinite
     LinearDoubleKeyFrame (eye blink)   → WAAPI keyframes
     MouseMove + RotateTransform        → mousemove + atan2 + transform
     SplineDoubleKeyFrame               → WAAPI Promise chain w/ keyspline
================================================================== */

/* ------------------------------------------------------------------ */
/* 0. Utilities                                                        */
/* ------------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const wait  = (ms) => new Promise(r => setTimeout(r, ms));
const now   = () => performance.now();

/* ------------------------------------------------------------------ */
/* 1. Hero avatar — Idle Breathing + Eye Blink + Head Tracking         */
/* ------------------------------------------------------------------ */
class HeroAvatar {
  constructor(root) {
    this.root      = root;
    this.charRoot  = $('.char-root', root);
    this.head      = $('.char-head', root);
    this.body      = $('.char-body', root);
    this.eyes      = $('.eyes', root);
    this.eyeWraps  = $$('.iris-wrap', root);
    this.lids      = $$('.lid', root);
    this.armL      = $('.arm-l', root);
    this.armR      = $('.arm-r', root);
    this.brows     = $$('.brow', root);
    this.cursorReadout = $('#cursor-readout');

    this.targetAngle = 0;
    this.targetEye   = { x: 0, y: 0 };
    this.currentAngle = 0;
    this.currentEye  = { x: 0, y: 0 };

    this.isBusy = false;
    this.startBreathing();
    this.startBlinking();
    this.startMicroSway();
    this.bindTracking();
    this.tick();
  }

  /* Idle breathing — ScaleY 1.0→1.04 SineEase AutoReverse Forever */
  startBreathing() {
    this.body.animate(
      [
        { transform: 'scale(1, 1) translateY(0)' },
        { transform: 'scale(1.015, 1.038) translateY(-2.5px)' },
      ],
      { duration: 1600, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
    );
    /* Subtle head bob — slower */
    this.head.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-1.5px)' },
      ],
      { duration: 1600, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
    );
  }

  /* Eye blink — ScaleY 1→0.05→1 every ~3.5s, with double-blink occasionally */
  startBlinking() {
    const blinkOnce = (delay = 0) => {
      this.eyeWraps.forEach((eye, i) => {
        eye.animate(
          [
            { transform: 'scaleY(1)' },
            { transform: 'scaleY(0.05)' },
            { transform: 'scaleY(0.05)' },
            { transform: 'scaleY(1)' }
          ],
          { duration: 220, delay: delay + i * 18, easing: 'ease-in-out', fill: 'none' }
        );
      });
      this.lids.forEach((lid, i) => {
        lid.animate(
          [
            { opacity: 0 },
            { opacity: 0.75 },
            { opacity: 0.75 },
            { opacity: 0 }
          ],
          { duration: 220, delay: delay + i * 18, easing: 'linear', fill: 'none' }
        );
      });
    };

    const loop = () => {
      const baseInterval = 2800 + Math.random() * 2200;
      setTimeout(() => {
        blinkOnce();
        if (Math.random() < 0.25) blinkOnce(280); // occasional double-blink
        loop();
      }, baseInterval);
    };
    loop();
  }

  /* Subtle arm sway — adds life beyond pure breathing */
  startMicroSway() {
    this.armL.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(2.5deg)' }],
      { duration: 3200, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
    );
    this.armR.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-2.5deg)' }],
      { duration: 3200, delay: 600, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
    );
    /* Brow micro-twitch */
    this.brows.forEach((brow, i) => {
      brow.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-1.2px)' }],
        { duration: 4400 + i * 320, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
      );
    });
  }

  /* Head tracking — atan2(dy, dx), damping toward target */
  bindTracking() {
    const onMove = (e) => {
      const rect = this.root.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy - 40; // bias slightly upward (face area)
      const ang  = Math.atan2(dy, dx) * 180 / Math.PI;
      this.targetAngle = clamp(ang * 0.06, -10, 10);
      const norm = Math.min(1, Math.hypot(dx, dy) / Math.max(rect.width, rect.height));
      this.targetEye.x = clamp((dx / rect.width) * 24, -7, 7);
      this.targetEye.y = clamp((dy / rect.height) * 18, -5, 5);
      if (this.cursorReadout) {
        this.cursorReadout.textContent =
          `Δ ${dx.toFixed(0).padStart(4)} · ${dy.toFixed(0).padStart(4)}  ang ${ang.toFixed(1)}°`;
      }
    };
    const onLeave = () => {
      this.targetAngle = 0;
      this.targetEye.x = 0;
      this.targetEye.y = 0;
      if (this.cursorReadout) this.cursorReadout.textContent = '· · ·';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
  }

  /* RAF loop — smooth lerp toward targets */
  tick() {
    const lerp = (a, b, t) => a + (b - a) * t;
    const step = () => {
      this.currentAngle = lerp(this.currentAngle, this.targetAngle, 0.12);
      this.currentEye.x = lerp(this.currentEye.x, this.targetEye.x, 0.16);
      this.currentEye.y = lerp(this.currentEye.y, this.targetEye.y, 0.16);
      if (!this.isBusy) {
        this.head.style.transform =
          `translateY(0) rotate(${this.currentAngle.toFixed(2)}deg)`;
        this.eyes.style.transform =
          `translate(${this.currentEye.x.toFixed(2)}px, ${this.currentEye.y.toFixed(2)}px)`;
      }
      requestAnimationFrame(step);
    };
    step();
  }

  /* Triggered jump — Anticipation + Stretch + Squash + Follow-through */
  async jump(power = 1) {
    if (this.isBusy) return;
    this.isBusy = true;
    this.charRoot.classList.add('is-jumping');

    // mouth opens during stretch
    const mouth = $('.mouth', this.root);
    if (mouth) {
      mouth.animate(
        [
          { d: 'path("M142 216 Q160 226 178 216")' },
          { d: 'path("M138 216 Q160 234 182 216")' },
          { d: 'path("M142 216 Q160 226 178 216")' }
        ],
        { duration: 700, easing: 'ease-out' }
      );
    }
    await wait(720);
    this.charRoot.classList.remove('is-jumping');
    this.isBusy = false;
  }

  /* Anticipation trigger — pull-back + dash + overshoot + settle */
  async anticipate(power = 1) {
    if (this.isBusy) return;
    this.isBusy = true;
    const distance = 80 * power;

    await this.charRoot.animate(
      [
        { transform: 'translateX(0) rotate(0deg) scale(1)' },
        { transform: `translateX(-${22 * power}px) rotate(-6deg) scale(1.05, 0.95)` },
      ],
      { duration: 360, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    ).finished;

    await this.charRoot.animate(
      [
        { transform: `translateX(-${22 * power}px) rotate(-6deg) scale(1.05, 0.95)` },
        { transform: `translateX(${distance}px) rotate(8deg) scale(0.95, 1.1)` },
      ],
      { duration: 480, easing: 'cubic-bezier(0.6,0,0.2,1)', fill: 'forwards' }
    ).finished;

    await this.charRoot.animate(
      [
        { transform: `translateX(${distance}px) rotate(8deg) scale(0.95, 1.1)` },
        { transform: `translateX(${distance + 14}px) rotate(4deg) scale(1.1, 0.92)` },
      ],
      { duration: 180, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    ).finished;

    await this.charRoot.animate(
      [
        { transform: `translateX(${distance + 14}px) rotate(4deg) scale(1.1, 0.92)` },
        { transform: 'translateX(0) rotate(0deg) scale(1, 1)' },
      ],
      { duration: 460, easing: 'cubic-bezier(0.3,1.4,0.5,1)', fill: 'forwards' }
    ).finished;

    this.charRoot.style.transform = '';
    this.isBusy = false;
  }
}

const heroAvatar = new HeroAvatar($('.avatar--hero'));
$('#trigger-jump').addEventListener('click', () => heroAvatar.jump(1));
$('#trigger-anticipate').addEventListener('click', () => heroAvatar.anticipate(1.0));


/* ------------------------------------------------------------------ */
/* 2. PLAYGROUND — 6 isolated demos                                     */
/* ------------------------------------------------------------------ */

/* 17-1 Walk Cycle — speed/bounce sliders */
(() => {
  const walker = $('.mini-walker');
  const speedIn = $('#walk-speed'),  speedOut  = $('#walk-speed-out');
  const bounceIn = $('#walk-bounce'), bounceOut = $('#walk-bounce-out');
  const apply = () => {
    const sp = parseFloat(speedIn.value);
    const bn = parseInt(bounceIn.value, 10);
    speedOut.textContent  = `${sp.toFixed(1)}×`;
    bounceOut.textContent = `${bn}px`;
    walker.style.setProperty('--bounce', `${bn}px`);
    walker.style.animationDuration = `${4 / sp}s, ${0.4 / sp}s`;
    walker.querySelectorAll('.leg-l, .leg-r, .arm-l, .arm-r').forEach(g => {
      g.style.animationDuration = `${0.4 / sp}s`;
    });
  };
  speedIn.addEventListener('input', apply);
  bounceIn.addEventListener('input', apply);
  apply();
})();

/* 17-2 Squash & Stretch — drop with cubic-bezier elasticity */
(() => {
  const ball   = $('#squash-ball');
  const shadow = $('#squash-shadow');
  const force  = $('#squash-force'), forceOut = $('#squash-force-out');
  const trigger = $('#squash-trigger');
  let busy = false;

  const apply = () => { forceOut.textContent = `${parseFloat(force.value).toFixed(1)}×`; };
  force.addEventListener('input', apply); apply();

  const drop = async () => {
    if (busy) return;
    busy = true;
    const f = parseFloat(force.value);
    const height = 110 * f;
    ball.animate(
      [
        { transform: 'translateY(0) scale(1, 1)',     offset: 0 },
        { transform: `translateY(-${height}px) scale(0.85, 1.2)`, offset: 0.4 },
        { transform: 'translateY(0) scale(1, 1)',     offset: 0.7 },
        { transform: `translateY(0) scale(${1.5*f}, ${0.55})`, offset: 0.78 },
        { transform: `translateY(0) scale(${0.92}, ${1.08})`,  offset: 0.88 },
        { transform: 'translateY(0) scale(1, 1)',     offset: 1   },
      ],
      { duration: 1100, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' }
    );
    shadow.animate(
      [
        { transform: 'scale(1)',     opacity: 0.8 },
        { transform: 'scale(0.4)',   opacity: 0.3 },
        { transform: 'scale(1)',     opacity: 0.8 },
        { transform: `scale(${1.4*f})`, opacity: 0.95 },
        { transform: 'scale(1)',     opacity: 0.8 },
      ],
      { duration: 1100, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' }
    );
    await wait(1100);
    busy = false;
  };
  trigger.addEventListener('click', drop);
  drop();
  setInterval(drop, 2400);
})();

/* 17-3 Idle Breathing — depth/tempo sliders */
(() => {
  const breath = $('.mini-breath');
  const depthIn = $('#breath-depth'), depthOut = $('#breath-depth-out');
  const tempoIn = $('#breath-tempo'), tempoOut = $('#breath-tempo-out');
  const apply = () => {
    const d = parseFloat(depthIn.value);
    const t = parseFloat(tempoIn.value);
    depthOut.textContent = `${(d * 100).toFixed(1)}%`;
    tempoOut.textContent = `${t.toFixed(1)}s`;
    breath.style.setProperty('--breath-scale', (1 + d).toFixed(3));
    breath.style.animationDuration = `${t}s`;
  };
  depthIn.addEventListener('input', apply);
  tempoIn.addEventListener('input', apply);
  apply();
})();

/* 17-4 Eye Blink — interval slider + Blink Now */
(() => {
  const eyes = $$('.blink-eye');
  const status = $('#blink-status');
  const intervalIn = $('#blink-interval'), intervalOut = $('#blink-interval-out');
  const trigger = $('#blink-now');
  let timer = null;

  const blink = () => {
    status.textContent = 'blink';
    eyes.forEach((eye, i) => {
      eye.animate(
        [
          { transform: 'scaleY(1)' },
          { transform: 'scaleY(0.05)' },
          { transform: 'scaleY(0.05)' },
          { transform: 'scaleY(1)' }
        ],
        { duration: 220, delay: i * 18, easing: 'ease-in-out' }
      );
    });
    setTimeout(() => status.textContent = 'awake', 260);
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    const t = parseFloat(intervalIn.value) * 1000;
    timer = setTimeout(() => { blink(); schedule(); }, t);
  };
  const apply = () => {
    intervalOut.textContent = `${parseFloat(intervalIn.value).toFixed(1)}s`;
    schedule();
  };
  intervalIn.addEventListener('input', apply);
  trigger.addEventListener('click', blink);
  apply();
})();

/* 17-5 Head Tracking — local stage tracking */
(() => {
  const stage = $('.stage-track');
  const head  = $('#track-head');
  const eyes  = $('#track-eyes');
  const pupils = $$('.track-pupil', stage);
  const target = $('.track-target', stage);
  const senseIn = $('#track-sense'), senseOut = $('#track-sense-out');
  const eyeIn   = $('#track-eye'),   eyeOut   = $('#track-eye-out');

  let sense  = 0.18;
  let eyeRange = 6;
  let target_ = { angle: 0, ex: 0, ey: 0 };
  let cur     = { angle: 0, ex: 0, ey: 0 };

  const apply = () => {
    sense = parseFloat(senseIn.value);
    eyeRange = parseInt(eyeIn.value, 10);
    senseOut.textContent = sense.toFixed(2);
    eyeOut.textContent = `${eyeRange}px`;
  };
  senseIn.addEventListener('input', apply);
  eyeIn.addEventListener('input', apply); apply();

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    target.style.left = `${x}px`;
    target.style.top  = `${y}px`;
    target_.angle = clamp(Math.atan2(dy, dx) * 180 / Math.PI * sense, -25, 25);
    target_.ex    = clamp(dx / rect.width * eyeRange * 4, -eyeRange, eyeRange);
    target_.ey    = clamp(dy / rect.height * eyeRange * 4, -eyeRange/1.4, eyeRange/1.4);
  });
  stage.addEventListener('mouseleave', () => {
    target_.angle = 0; target_.ex = 0; target_.ey = 0;
  });

  (function tick() {
    cur.angle += (target_.angle - cur.angle) * 0.18;
    cur.ex    += (target_.ex    - cur.ex)    * 0.20;
    cur.ey    += (target_.ey    - cur.ey)    * 0.20;
    head.style.transform = `rotate(${cur.angle.toFixed(2)}deg)`;
    eyes.style.transform = `translate(${cur.ex.toFixed(2)}px, ${cur.ey.toFixed(2)}px)`;
    requestAnimationFrame(tick);
  })();
})();

/* 17-6 Anticipation & Follow-Through — 4-stage WAAPI */
(() => {
  const hero  = $('#anti-hero');
  const stage = $('.stage-anti');
  const stages = $$('.anti-stage');
  const power = $('#anti-power'), powerOut = $('#anti-power-out');
  const trigger = $('#anti-trigger');
  let busy = false;

  const apply = () => { powerOut.textContent = `${parseFloat(power.value).toFixed(1)}×`; };
  power.addEventListener('input', apply); apply();

  const setStage = (idx) => {
    stages.forEach((s, i) => s.classList.toggle('active', i === idx));
  };

  const run = async () => {
    if (busy) return;
    busy = true;
    const p = parseFloat(power.value);
    const w = stage.clientWidth - 80;

    setStage(0);
    await hero.animate(
      [
        { transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)' },
        { transform: `translate(${-26*p}px, 6px) rotate(-12deg) scale(1.05, 0.92)` },
      ],
      { duration: 420, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    ).finished;

    setStage(1);
    await hero.animate(
      [
        { transform: `translate(${-26*p}px, 6px) rotate(-12deg) scale(1.05, 0.92)` },
        { transform: `translate(${w*p}px, 0px) rotate(14deg) scale(0.92, 1.1)` },
      ],
      { duration: 540, easing: 'cubic-bezier(0.6,0,0.2,1)', fill: 'forwards' }
    ).finished;

    setStage(2);
    await hero.animate(
      [
        { transform: `translate(${w*p}px, 0px) rotate(14deg) scale(0.92, 1.1)` },
        { transform: `translate(${(w+18)*p}px, -4px) rotate(7deg) scale(1.12, 0.9)` },
      ],
      { duration: 200, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    ).finished;

    setStage(3);
    await hero.animate(
      [
        { transform: `translate(${(w+18)*p}px, -4px) rotate(7deg) scale(1.12, 0.9)` },
        { transform: `translate(${w*p}px, 0px) rotate(0deg) scale(1, 1)` },
      ],
      { duration: 480, easing: 'cubic-bezier(0.3,1.4,0.5,1)', fill: 'forwards' }
    ).finished;

    await wait(700);
    setStage(-1);

    /* return  */
    await hero.animate(
      [
        { transform: `translate(${w*p}px, 0px) rotate(0deg) scale(1, 1)` },
        { transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)' },
      ],
      { duration: 480, easing: 'ease-in-out', fill: 'forwards' }
    ).finished;
    hero.style.transform = '';
    busy = false;
  };
  trigger.addEventListener('click', run);
  setTimeout(run, 800);
  setInterval(run, 4800);
})();

/* ------------------------------------------------------------------ */
/* 3. PIPELINE — Full sequence: enter → breathe → anticipate → jump → squash → cheer  */
/* ------------------------------------------------------------------ */
class Pipeline {
  constructor() {
    this.avatar = $('#pl-avatar');
    this.root   = $('.pl-root', this.avatar);
    this.head   = $('.pl-head', this.avatar);
    this.body   = $('.pl-body', this.avatar);
    this.mouth  = $('.pl-mouth', this.avatar);
    this.steps  = $$('.pl-step');
    this.canvas = $('#confetti');
    this.ctx    = this.canvas.getContext('2d');
    this.particles = [];
    this.busy = false;
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();
    this.tickCanvas();
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width  = rect.width  * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setStep(i) { this.steps.forEach((s, j) => s.classList.toggle('active', j === i)); }

  async run() {
    if (this.busy) return;
    this.busy = true;

    // 1. Enter from offscreen left
    this.setStep(0);
    await this.root.animate(
      [
        { transform: 'translateX(-220px) scale(0.96)', opacity: 0 },
        { transform: 'translateX(0px) scale(1)',       opacity: 1 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'forwards' }
    ).finished;

    // 2. Breathe (3 cycles)
    this.setStep(1);
    await this.body.animate(
      [
        { transform: 'scale(1, 1)' },
        { transform: 'scale(1.02, 1.04)' },
        { transform: 'scale(1, 1)' },
        { transform: 'scale(1.02, 1.04)' },
        { transform: 'scale(1, 1)' },
        { transform: 'scale(1.02, 1.04)' },
        { transform: 'scale(1, 1)' },
      ],
      { duration: 2200, easing: 'ease-in-out', fill: 'forwards' }
    ).finished;

    // 3. Anticipation (crouch + tilt)
    this.setStep(2);
    await this.root.animate(
      [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(8px) scale(1.18, 0.78)' },
      ],
      { duration: 360, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    ).finished;

    // 4. Jump (stretch up)
    this.setStep(3);
    await this.root.animate(
      [
        { transform: 'translateY(8px) scale(1.18, 0.78)' },
        { transform: 'translateY(-180px) scale(0.85, 1.22)' },
      ],
      { duration: 380, easing: 'cubic-bezier(0.2,0.5,0.4,1)', fill: 'forwards' }
    ).finished;

    // 5. Land (squash with overshoot bounce)
    this.setStep(4);
    await this.root.animate(
      [
        { transform: 'translateY(-180px) scale(0.85, 1.22)' },
        { transform: 'translateY(0) scale(1.5, 0.55)' },
        { transform: 'translateY(-12px) scale(0.94, 1.08)' },
        { transform: 'translateY(0) scale(1, 1)' },
      ],
      { duration: 720, easing: 'cubic-bezier(0.3,1.4,0.5,1)', fill: 'forwards' }
    ).finished;

    // 6. Cheer (mouth opens, confetti burst)
    this.setStep(5);
    if (this.mouth) {
      this.mouth.animate(
        [
          { d: 'path("M142 216 Q160 226 178 216")' },
          { d: 'path("M132 214 Q160 248 188 214")' },
          { d: 'path("M142 216 Q160 226 178 216")' }
        ],
        { duration: 900, easing: 'ease-out', fill: 'forwards' }
      );
    }
    this.body.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-12px)' },
        { transform: 'translateY(0)' }
      ],
      { duration: 720, easing: 'ease-in-out', iterations: 2 }
    );
    this.burst();
    await wait(1600);

    this.setStep(-1);
    this.root.style.transform = '';
    this.body.style.transform = '';
    this.busy = false;
  }

  burst() {
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height * 0.55;
    const colors = ['#F472B6', '#22D3EE', '#FBBF24', '#A78BFA', '#FF6B6B'];
    for (let i = 0; i < 110; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 4,
        size: 3 + Math.random() * 4,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 12,
        color: colors[(Math.random() * colors.length) | 0],
        life: 1.0,
        decay: 0.005 + Math.random() * 0.012
      });
    }
  }

  tickCanvas() {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.99;
      p.rot += p.vrot;
      p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 1.6);
      ctx.restore();
      return true;
    });
    requestAnimationFrame(() => this.tickCanvas());
  }
}

const pipeline = new Pipeline();
$('#pl-run').addEventListener('click', () => pipeline.run());
setTimeout(() => pipeline.run(), 1800);
setInterval(() => pipeline.run(), 12000);


/* ------------------------------------------------------------------ */
/* 4. CROWD — Multiple breathing/blinking characters with stagger      */
/* ------------------------------------------------------------------ */
(() => {
  const stage = $('#crowd-stage');
  const COUNT = 16;
  const palettes = [
    { skin: ['#FFE4C4', '#C49A78'], shirt: ['#3DD9F5', '#0E5E72'], hair: ['#5A3826', '#1F130A'] },
    { skin: ['#FFD9C0', '#A47865'], shirt: ['#F472B6', '#7A1F4E'], hair: ['#3F2F1F', '#0F0805'] },
    { skin: ['#F4D6B8', '#B07658'], shirt: ['#FBBF24', '#7A4E0F'], hair: ['#2A1A0E', '#0A0503'] },
    { skin: ['#FFE0BD', '#C28B6E'], shirt: ['#A78BFA', '#3B1B6A'], hair: ['#4F3220', '#1A0F08'] },
    { skin: ['#FFE4C8', '#B88F6D'], shirt: ['#22C55E', '#0D5A2A'], hair: ['#594035', '#1F140C'] },
  ];

  for (let i = 0; i < COUNT; i++) {
    const p = palettes[i % palettes.length];
    const tempo = 1.4 + Math.random() * 1.4;
    const blinkInterval = 2400 + Math.random() * 3000;
    const eyeShift = 0.85 + Math.random() * 0.3;

    const wrap = document.createElement('div');
    wrap.className = 'crowd-char';
    wrap.innerHTML = `
      <svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cs${i}" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stop-color="${p.skin[0]}"/><stop offset="100%" stop-color="${p.skin[1]}"/>
          </radialGradient>
          <radialGradient id="ct${i}" cx="0.5" cy="0.3" r="0.9">
            <stop offset="0%" stop-color="${p.shirt[0]}"/><stop offset="100%" stop-color="${p.shirt[1]}"/>
          </radialGradient>
          <radialGradient id="ch${i}" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stop-color="${p.hair[0]}"/><stop offset="100%" stop-color="${p.hair[1]}"/>
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="124" rx="22" ry="3" fill="rgba(0,0,0,0.4)"/>
        <g class="cb">
          <ellipse cx="40" cy="34" rx="20" ry="22" fill="url(#cs${i})"/>
          <path d="M22 30 Q28 12 40 8 Q52 12 58 30 Q50 22 42 24 Q34 24 28 28 Q24 30 22 30 Z" fill="url(#ch${i})"/>
          <g class="cey">
            <ellipse class="ceL" cx="33" cy="36" rx="3" ry="${2.4 * eyeShift}" fill="#0A0F1C"/>
            <ellipse class="ceR" cx="47" cy="36" rx="3" ry="${2.4 * eyeShift}" fill="#0A0F1C"/>
          </g>
          <path d="M34 44 Q40 47 46 44" stroke="#9B3A4F" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M22 60 Q40 54 58 60 L62 110 Q40 118 18 110 Z" fill="url(#ct${i})"/>
        </g>
      </svg>
    `;
    stage.appendChild(wrap);

    const body = wrap.querySelector('.cb');
    body.animate(
      [
        { transform: 'scale(1, 1) translateY(0)' },
        { transform: 'scale(1.015, 1.04) translateY(-1.5px)' }
      ],
      { duration: tempo * 1000, delay: i * 80, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity }
    );

    const eyes = wrap.querySelectorAll('.ceL, .ceR');
    const blink = () => {
      eyes.forEach((eye, k) => {
        eye.animate(
          [
            { transform: 'scaleY(1)' },
            { transform: 'scaleY(0.05)' },
            { transform: 'scaleY(1)' }
          ],
          { duration: 180, delay: k * 20, easing: 'ease-in-out' }
        );
      });
    };
    setTimeout(() => {
      const loop = () => {
        blink();
        setTimeout(loop, blinkInterval + Math.random() * 1200);
      };
      loop();
    }, i * 100);
  }
})();
