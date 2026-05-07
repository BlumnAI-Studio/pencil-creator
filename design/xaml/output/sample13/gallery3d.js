/* ════════════════════════════════════════════════════
   FINALE — 50평대 럭셔리 모델하우스 갤러리
   Three.js · 1인칭 이동 · 8 분양 사이트 액자
   ════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

(() => {
  const canvas = document.getElementById('apt3d');
  if (!canvas) return;
  const stage = canvas.parentElement;
  const overlay = document.getElementById('aptOverlay');
  const hudFrame = document.getElementById('hudFrame');
  const hudPos = document.getElementById('hudPos');
  const frameInfo = document.getElementById('frameInfo');
  const fiRank = frameInfo.querySelector('.fi-rank');
  const fiName = frameInfo.querySelector('.fi-name');
  const fiTag  = frameInfo.querySelector('.fi-tag');
  const enterBtn = document.querySelector('.apt-enter');

  /* ───── Room dimensions (50평형) ───── */
  const ROOM = { W: 16, D: 10, H: 3.0 }; // 16m × 10m × 3m
  const HALF_W = ROOM.W / 2, HALF_D = ROOM.D / 2;
  const PLAYER = { eye: 1.65, radius: 0.4, speed: 4.6 };

  /* ───── Site frames data (8 sites) ───── */
  const SITES = [
    { id:'tbz',     rank:'#5', name:'더블란츠 한강',          tag:'POETIC CLASS · 13세대',          score:8.0,
      palette:['#FAF8F4','#1A1A1A','#C5A572','#1E3A5F'],   sig:'underscore' },
    { id:'prg',     rank:'#4', name:'푸르지오 써밋 남천',      tag:'頂點 · 固有 · 超越',             score:8.2,
      palette:['#FFFFFF','#1A1A1A','#1E3A5F','#B89968'],   sig:'hanja' },
    { id:'ssy',     rank:'#8', name:'더 플래티넘 (메인)',      tag:'ONE & ONLY · Fine Tuned',        score:6.0,
      palette:['#FFFFFF','#1A1A1A','#3A4A5C','#98674C'],   sig:'banner' },
    { id:'and',     rank:'#6', name:'어나드 게이트',            tag:'유일무이 · 시대의 가치',         score:6.8,
      palette:['#FFFFFF','#231815','#B0927A','#009CAC'],   sig:'gate' },
    { id:'saem',    rank:'#3', name:'Saem · 만년필바',          tag:'Do nothing. Sit and drift',      score:8.4,
      palette:['#F5F1EA','#1A1A1A','#585858','#B89968'],   sig:'noise' },
    { id:'leel',    rank:'#2', name:'르엘 리버파크 센텀',       tag:'A NEW LEVEL OF LIVING',           score:9.4,
      palette:['#FAF8F4','#1A1A1A','#1E3A5F','#C5A572'],   sig:'parallax' },
    { id:'ssysub',  rank:'#7', name:'더 플래티넘 (sub)',        tag:'단지 · 평면 · 모델하우스',       score:6.6,
      palette:['#FFFFFF','#1A1A1A','#3A4A5C','#B89968'],   sig:'plan' },
    { id:'apt',     rank:'#1', name:'어나드 범어 ANADD APT',    tag:'THE GREATEST ONE · fullPage · 9 keyframes', score:9.8,
      palette:['#FFFFFF','#231815','#B0927A','#98674C'],   sig:'fullpage' },
  ];

  /* ───── Renderer / Scene / Camera ───── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF2EEE6);
  scene.fog = new THREE.Fog(0xF2EEE6, 22, 48);

  const camera = new THREE.PerspectiveCamera(66, 1, 0.05, 80);
  camera.position.set(0, 0, 0);

  /* ───── Lights ───── */
  scene.add(new THREE.HemisphereLight(0xFFF7EC, 0x776E63, 0.82));

  // Sun through windows (long wall)
  const sun = new THREE.DirectionalLight(0xFFE4B5, 1.38);
  sun.position.set(-12, 7.5, -4.5);
  sun.target.position.set(2, 1.15, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 28;
  scene.add(sun, sun.target);

  const softFill = new THREE.DirectionalLight(0xDDEBFF, 0.42);
  softFill.position.set(6, 4, 5);
  scene.add(softFill);

  // Broad ceiling spots. Only the sun casts shadows for stable, faster rendering.
  const ceilingSpots = [];
  [[-5, -2.5], [-5, 2.5], [5, -2.5], [5, 2.5]].forEach(([x, z]) => {
    const sp = new THREE.SpotLight(0xFFE7C2, 1.12, 9.5, Math.PI / 3.3, 0.6, 1.15);
    sp.position.set(x, ROOM.H - 0.05, z);
    sp.target.position.set(x, 0, z);
    scene.add(sp, sp.target);
    ceilingSpots.push(sp);
  });

  /* ───── Texture loader ───── */
  const tl = new THREE.TextureLoader();
  function loadTex(url, repeat = 1) {
    const t = tl.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (Array.isArray(repeat)) t.repeat.set(repeat[0], repeat[1]);
    else t.repeat.set(repeat, repeat);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  const TEX = {
    floor:    loadTex('img/marble-floor.png', [4, 3]),
    wall:     loadTex('img/walnut-panel.png', [3, 1]),
    ceiling:  loadTex('img/ceiling-light.png', [3, 2]),
    window:   loadTex('img/city-window.png', [1, 1]),
    sofa:     loadTex('img/fabric-sofa.png', [2, 1]),
    kitchen:  loadTex('img/kitchen-stone.png', [2, 1]),
    bath:     loadTex('img/bath-stone.png', [2, 1]),
    holo:     loadTex('img/holo-glass.png', [1, 1]),
  };

  /* ───── Floor ───── */
  const floorMat = new THREE.MeshStandardMaterial({
    map: TEX.floor,
    bumpMap: TEX.floor,
    bumpScale: 0.045,
    roughness: 0.22,
    metalness: 0.14,
    color: 0xFFF6E8,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.W, ROOM.D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ───── Ceiling ───── */
  const ceilingMat = new THREE.MeshStandardMaterial({
    map: TEX.ceiling,
    emissiveMap: TEX.ceiling,
    emissive: 0xFFF0D2,
    emissiveIntensity: 0.14,
    color: 0xFFF9EF,
    roughness: 0.62,
    metalness: 0.02,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.W, ROOM.D), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.H;
  scene.add(ceiling);

  // Cove gold strip on ceiling perimeter
  const coveMat = new THREE.MeshStandardMaterial({ color: 0xC5A572, emissive: 0x7B5C24, emissiveIntensity: 0.62, metalness: 0.7, roughness: 0.28 });
  const coveTop = new THREE.Mesh(new THREE.BoxGeometry(ROOM.W - 0.2, 0.02, 0.06), coveMat);
  coveTop.position.set(0, ROOM.H - 0.06, -HALF_D + 0.05);
  scene.add(coveTop);
  const coveBot = coveTop.clone(); coveBot.position.z = HALF_D - 0.05; scene.add(coveBot);
  const coveL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, ROOM.D - 0.2), coveMat);
  coveL.position.set(-HALF_W + 0.05, ROOM.H - 0.06, 0); scene.add(coveL);
  const coveR = coveL.clone(); coveR.position.x = HALF_W - 0.05; scene.add(coveR);

  const lightPanelMat = new THREE.MeshBasicMaterial({ color: 0xFFF2D4, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  [[-4.8, -3.2], [-4.8, 3.2], [0, 0], [4.8, -3.2], [4.8, 3.2]].forEach(([x, z]) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.42), lightPanelMat);
    panel.rotation.x = Math.PI / 2;
    panel.position.set(x, ROOM.H - 0.012, z);
    scene.add(panel);
  });

  /* ───── Walls ───── */
  const wallMat = new THREE.MeshStandardMaterial({
    map: TEX.wall,
    bumpMap: TEX.wall,
    bumpScale: 0.025,
    roughness: 0.55,
    metalness: 0.08,
    color: 0x9A7756,
  });
  const wallMatLight = new THREE.MeshStandardMaterial({
    color: 0xF0ECE4, roughness: 0.72, metalness: 0.02,
  });

  // North wall (z = -HALF_D) — front entrance, light
  const wallN = new THREE.Mesh(new THREE.BoxGeometry(ROOM.W, ROOM.H, 0.1), wallMatLight);
  wallN.position.set(0, ROOM.H / 2, -HALF_D);
  wallN.receiveShadow = true; scene.add(wallN);

  // South wall (z = HALF_D) — back, walnut
  const wallS = new THREE.Mesh(new THREE.BoxGeometry(ROOM.W, ROOM.H, 0.1), wallMat);
  wallS.position.set(0, ROOM.H / 2, HALF_D);
  wallS.receiveShadow = true; scene.add(wallS);

  // West wall — windows + frames
  const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.1, ROOM.H, ROOM.D), wallMatLight);
  wallW.position.set(-HALF_W, ROOM.H / 2, 0);
  wallW.receiveShadow = true; scene.add(wallW);

  // East wall — main gallery wall (8 frames)
  const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.1, ROOM.H, ROOM.D), wallMatLight);
  wallE.position.set(HALF_W, ROOM.H / 2, 0);
  wallE.receiveShadow = true; scene.add(wallE);

  const trimMat = new THREE.MeshStandardMaterial({ color: 0xBFA06A, metalness: 0.52, roughness: 0.32 });
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x34271E, roughness: 0.46, metalness: 0.08 });
  [
    { pos:[0, 0.09, -HALF_D + 0.08], scale:[ROOM.W, 0.18, 0.06] },
    { pos:[0, 0.09,  HALF_D - 0.08], scale:[ROOM.W, 0.18, 0.06] },
    { pos:[-HALF_W + 0.08, 0.09, 0], scale:[0.06, 0.18, ROOM.D] },
    { pos:[ HALF_W - 0.08, 0.09, 0], scale:[0.06, 0.18, ROOM.D] },
  ].forEach(({ pos, scale }) => {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(...scale), baseboardMat);
    trim.position.set(...pos);
    trim.receiveShadow = true;
    scene.add(trim);
  });

  [-3.4, -1.1, 1.1, 3.4].forEach(z => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.35, 0.035), trimMat);
    rail.position.set(HALF_W - 0.12, 1.55, z);
    rail.castShadow = true;
    scene.add(rail);
  });

  /* ───── Window glass on West wall ───── */
  const windowMat = new THREE.MeshStandardMaterial({
    map: TEX.window, roughness: 0.18, metalness: 0.45, color: 0xFFFFFF,
    emissive: 0x9EBBCE, emissiveIntensity: 0.34, transparent: true, opacity: 0.98,
  });
  const winGeo = new THREE.PlaneGeometry(2.6, 1.8);
  for (let i = -1; i <= 1; i++) {
    const win = new THREE.Mesh(winGeo, windowMat);
    win.position.set(-HALF_W + 0.06, 1.6, i * 3);
    win.rotation.y = Math.PI / 2;
    scene.add(win);
    // window frame golden
    const frm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.86, 2.66), coveMat);
    frm.position.set(-HALF_W + 0.04, 1.6, i * 3);
    scene.add(frm);
    const glow = new THREE.PointLight(0xBFDFFF, 0.75, 4.2, 1.6);
    glow.position.set(-HALF_W + 0.35, 1.65, i * 3);
    scene.add(glow);
  }

  /* ───── 8 Site Frames on East wall ───── */
  function makeSiteCanvas(site, w = 768, h = 1024) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    const [bg, ink, accent, deep] = site.palette;
    // background
    const bgGrad = x.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, bg);
    bgGrad.addColorStop(0.62, '#FFFFFF');
    bgGrad.addColorStop(1, bg);
    x.fillStyle = bgGrad; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(197,165,114,0.08)';
    x.fillRect(24, 24, w - 48, h - 48);
    // border
    x.strokeStyle = ink; x.lineWidth = 6; x.strokeRect(14, 14, w-28, h-28);
    x.strokeStyle = accent; x.lineWidth = 2; x.strokeRect(32, 32, w-64, h-64);
    // top eyebrow (rank + score)
    x.fillStyle = accent;
    x.font = 'bold 34px JetBrains Mono, monospace';
    x.fillText(`${site.rank} · ${site.score.toFixed(1)} / 10`, 54, 86);
    // big title
    x.fillStyle = ink;
    x.font = 'bold 56px Nanum Myeongjo, serif';
    wrap(x, site.name, 54, 162, w-108, 66);
    // tagline
    x.fillStyle = '#585858';
    x.font = '29px Nanum Myeongjo, serif';
    wrap(x, site.tag, 54, h - 286, w-108, 38);
    // signature mark
    drawSignature(x, site, w, h, ink, accent, deep);
    // bottom URL
    x.fillStyle = accent;
    x.font = 'bold 22px JetBrains Mono, monospace';
    x.fillText(`SITE · ${site.id.toUpperCase()}`, 54, h - 58);
    return c;
  }
  function wrap(ctx, text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '', yy = y;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line, x, yy); line = word + ' '; yy += lh;
      } else line = test;
    }
    ctx.fillText(line, x, yy);
  }
  function drawSignature(x, site, w, h, ink, accent, deep) {
    const cx = w/2, cy = h*0.5;
    x.save();
    switch (site.sig) {
      case 'underscore':
        // _POETIC CLASS_ underscore highlight
        x.fillStyle = deep;
        x.font = 'bold 28px Playfair Display, serif';
        x.textAlign = 'center';
        x.fillText('_POETIC CLASS_', cx, cy - 60);
        // 4-frame strip
        for (let i=0;i<4;i++){
          x.fillStyle = i===0? deep : i===1? accent : i===2? '#585858' : '#1A1A1A';
          x.fillRect(64 + i*100, cy, 80, 100);
        }
        break;
      case 'hanja':
        x.fillStyle = ink;
        x.font = 'bold 88px Nanum Myeongjo, serif';
        x.textAlign = 'center';
        x.fillText('頂', cx-110, cy+10);
        x.fillText('固', cx, cy+10);
        x.fillText('超', cx+110, cy+10);
        x.fillStyle = accent; x.font = '24px Nanum Myeongjo, serif';
        x.fillText('정 · 고 · 초', cx, cy+50);
        // sea line
        x.strokeStyle = deep; x.lineWidth = 2;
        x.beginPath(); x.moveTo(40, cy+120); x.bezierCurveTo(w*0.3, cy+100, w*0.7, cy+140, w-40, cy+120); x.stroke();
        break;
      case 'banner':
        // marketing banner stripes
        for (let i=0;i<3;i++){
          x.fillStyle = i===0? deep : i===1? accent : ink;
          x.fillRect(40, cy-80 + i*70, w-80, 56);
        }
        x.fillStyle = '#FFFFFF';
        x.font = 'bold 18px Inter, sans-serif'; x.textAlign='center';
        x.fillText('ONE & ONLY', cx, cy-46);
        x.fillText('FINE TUNED LIFE', cx, cy+24);
        x.fillText('THE PLATINUM', cx, cy+94);
        break;
      case 'gate':
        // 2 gate cards
        x.fillStyle = accent; x.fillRect(40, cy-100, w*0.42-40, 240);
        x.fillStyle = deep;   x.fillRect(w*0.5+8, cy-100, w*0.46-40, 240);
        x.fillStyle = '#FFFFFF';
        x.font = 'bold 24px Trajan Pro, Cormorant Garamond, serif'; x.textAlign='center';
        x.fillText('아파트', w*0.25, cy);
        x.fillText('오피스텔', w*0.74, cy);
        // status pulse dot
        x.fillStyle = '#009CAC';
        x.beginPath(); x.arc(w*0.25, cy+60, 8, 0, Math.PI*2); x.fill();
        x.fillStyle = '#B89968';
        x.beginPath(); x.arc(w*0.74, cy+60, 8, 0, Math.PI*2); x.fill();
        break;
      case 'noise':
        // noise grain via random dots
        x.fillStyle = '#1A1A1A';
        x.font = 'italic 30px Playfair Display, serif'; x.textAlign='center';
        x.fillText('Do nothing.', cx, cy-40);
        x.fillStyle = deep;
        x.fillText('Sit and drift.', cx, cy+10);
        for (let i=0;i<800;i++) {
          x.fillStyle = `rgba(0,0,0,${Math.random()*0.08})`;
          x.fillRect(Math.random()*w, Math.random()*h, 2, 2);
        }
        // photo wall mini
        x.fillStyle = '#7A6B5A';
        for (let i=0;i<4;i++) { x.fillRect(60 + i*100, cy+80, 70, 90); }
        break;
      case 'parallax':
        // ball floating + lines
        x.strokeStyle = accent; x.lineWidth = 2;
        x.beginPath(); x.moveTo(40, cy+10); x.lineTo(w-40, cy-10); x.stroke();
        x.beginPath(); x.moveTo(40, cy+50); x.lineTo(w-40, cy+30); x.stroke();
        // ball
        const grad = x.createRadialGradient(cx, cy-40, 4, cx, cy-40, 60);
        grad.addColorStop(0, '#FAF8F4'); grad.addColorStop(0.6, accent); grad.addColorStop(1, '#7A6B5A');
        x.fillStyle = grad;
        x.beginPath(); x.arc(cx, cy-40, 60, 0, Math.PI*2); x.fill();
        // shadow
        x.fillStyle = 'rgba(0,0,0,0.4)';
        x.beginPath(); x.ellipse(cx, cy+50, 50, 8, 0, 0, Math.PI*2); x.fill();
        // text
        x.fillStyle = ink; x.font = 'bold 28px Playfair Display, serif'; x.textAlign='center';
        x.fillText('A NEW LEVEL', cx, cy+150);
        x.fillStyle = deep; x.fillText('OF LIVING', cx, cy+184);
        break;
      case 'plan':
        // floor plan grid
        x.strokeStyle = ink; x.lineWidth = 1.5;
        x.strokeRect(40, cy-100, w-80, 200);
        x.beginPath(); x.moveTo(40, cy); x.lineTo(w-40, cy); x.stroke();
        x.beginPath(); x.moveTo(w*0.4, cy-100); x.lineTo(w*0.4, cy+100); x.stroke();
        x.beginPath(); x.moveTo(w*0.7, cy); x.lineTo(w*0.7, cy+100); x.stroke();
        // labels
        x.fillStyle = '#585858'; x.font = '14px JetBrains Mono, monospace';
        x.fillText('LIVING', 60, cy-50); x.fillText('BED', w*0.45, cy-50);
        x.fillText('KIT', 60, cy+50); x.fillText('BATH', w*0.45, cy+50);
        // tab indicator
        x.fillStyle = accent;
        x.fillRect(40, cy-130, 80, 4);
        x.fillStyle = ink; x.font = 'bold 12px Inter, sans-serif';
        x.fillText('단지 · 평면 · 모델', 44, cy-138);
        break;
      case 'fullpage':
        // fullpage 3-stripe
        for (let i=0;i<3;i++){
          x.fillStyle = i===0? deep : i===1? accent : ink;
          x.fillRect(40, cy-130 + i*100, w-80, 86);
        }
        x.fillStyle = '#FFFFFF';
        x.font = 'bold 22px Cormorant Garamond, Trajan, serif'; x.textAlign='center';
        x.fillText('THE GREATEST ONE', cx, cy-80);
        x.font = 'bold 24px Nanum Myeongjo, serif';
        x.fillText('시대의 가치', cx, cy+20);
        x.font = 'bold 16px JetBrains Mono, monospace';
        x.fillText('9 KEYFRAMES · soso_bg 9s', cx, cy+120);
        // crown badge
        x.fillStyle = '#E4324F';
        x.fillRect(w-110, 24, 86, 28);
        x.fillStyle = '#FFFFFF';
        x.font = 'bold 14px Inter, sans-serif'; x.textAlign='center';
        x.fillText('★ #1 BEST', w-67, 44);
        break;
    }
    x.restore();
  }

  const FRAME_W = 1.22, FRAME_H = 1.78;
  const FRAME_Y = 1.55;
  const wallEx = HALF_W - 0.06;
  const frameLights = [];
  const framePositions = [];
  const frameRailMat = new THREE.MeshStandardMaterial({
    color: 0xD2AF6C,
    emissive: 0x5C431A,
    emissiveIntensity: 0.28,
    metalness: 0.82,
    roughness: 0.2,
  });
  const frameBackMat = new THREE.MeshStandardMaterial({ color: 0x15110E, roughness: 0.55, metalness: 0.04 });
  const highlightMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  SITES.forEach((site, i) => {
    // place along east wall, evenly distributed in z
    const z = -HALF_D + 1.2 + i * ((ROOM.D - 2.4) / (SITES.length - 1));
    framePositions.push({ x: wallEx, y: FRAME_Y, z, site });

    // canvas → texture
    const tex = new THREE.CanvasTexture(makeSiteCanvas(site));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const rail = 0.09;
    const frameX = wallEx - 0.16;
    const paintingX = wallEx - 0.235;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.045, FRAME_H + rail * 2.3, FRAME_W + rail * 2.3), frameBackMat);
    back.position.set(wallEx - 0.095, FRAME_Y, z);
    back.receiveShadow = true;
    scene.add(back);

    [
      { scale:[0.12, rail, FRAME_W + rail * 2], pos:[frameX, FRAME_Y + FRAME_H / 2 + rail / 2, z] },
      { scale:[0.12, rail, FRAME_W + rail * 2], pos:[frameX, FRAME_Y - FRAME_H / 2 - rail / 2, z] },
      { scale:[0.12, FRAME_H, rail], pos:[frameX, FRAME_Y, z - FRAME_W / 2 - rail / 2] },
      { scale:[0.12, FRAME_H, rail], pos:[frameX, FRAME_Y, z + FRAME_W / 2 + rail / 2] },
    ].forEach(({ scale, pos }) => {
      const part = new THREE.Mesh(new THREE.BoxGeometry(...scale), frameRailMat);
      part.position.set(...pos);
      part.receiveShadow = true;
      scene.add(part);
    });

    // canvas painting
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.08,
      roughness: 0.32,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W, FRAME_H), mat);
    plane.position.set(paintingX, FRAME_Y, z);
    plane.rotation.y = -Math.PI / 2;
    plane.userData.site = site;
    scene.add(plane);

    const shine = new THREE.Mesh(new THREE.PlaneGeometry(0.18, FRAME_H * 0.86), highlightMat);
    shine.position.set(paintingX - 0.004, FRAME_Y + 0.05, z - FRAME_W * 0.22);
    shine.rotation.y = -Math.PI / 2;
    shine.rotation.z = -0.18;
    scene.add(shine);

    // No shadow on per-frame lights: clearer posters, no flickering, much cheaper.
    const sp = new THREE.SpotLight(0xFFE7C2, 1.28, 4.8, Math.PI / 4.7, 0.46, 1.2);
    sp.position.set(wallEx - 0.86, ROOM.H - 0.18, z);
    sp.target.position.set(paintingX, FRAME_Y - 0.04, z);
    scene.add(sp, sp.target);
    frameLights.push(sp);

    const pictureBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.045, FRAME_W + 0.22), frameRailMat);
    pictureBar.position.set(wallEx - 0.33, FRAME_Y + FRAME_H / 2 + 0.24, z);
    scene.add(pictureBar);

    // floor plinth label (mono nameplate)
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256; labelCanvas.height = 64;
    const lx = labelCanvas.getContext('2d');
    lx.fillStyle = '#1A1A1A'; lx.fillRect(0,0,256,64);
    lx.fillStyle = '#C5A572'; lx.font = 'bold 14px JetBrains Mono, monospace';
    lx.fillText(site.rank + ' · ' + site.score.toFixed(1) + '/10', 16, 28);
    lx.fillStyle = '#FAF8F4'; lx.font = 'bold 14px Nanum Myeongjo, serif';
    lx.fillText(site.name, 16, 50);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, emissive: 0x222020, emissiveIntensity: 0.4 });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.15), labelMat);
    label.position.set(wallEx - 0.22, 0.6, z);
    label.rotation.y = -Math.PI / 2;
    scene.add(label);
  });

  /* ───── Furniture (luxury living room) ───── */
  // Sofa (3-seat) — facing east wall
  const sofaMat = new THREE.MeshStandardMaterial({
    map: TEX.sofa,
    bumpMap: TEX.sofa,
    bumpScale: 0.035,
    roughness: 0.78,
    metalness: 0.02,
    color: 0xA69C8C,
  });
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 1.0), sofaMat);
  sofaBase.position.set(0.6, 0.25, -0.4);
  sofaBase.castShadow = true; sofaBase.receiveShadow = true;
  scene.add(sofaBase);
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 0.25), sofaMat);
  sofaBack.position.set(0.6, 0.6, -0.85);
  sofaBack.castShadow = true; scene.add(sofaBack);
  // arms
  const armGeo = new THREE.BoxGeometry(0.22, 0.55, 1.0);
  const armL = new THREE.Mesh(armGeo, sofaMat); armL.position.set(-0.65, 0.5, -0.4); armL.castShadow = true; scene.add(armL);
  const armR = new THREE.Mesh(armGeo, sofaMat); armR.position.set(1.85, 0.5, -0.4); armR.castShadow = true; scene.add(armR);
  // cushions
  for (let i = -1; i <= 1; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 0.85), sofaMat);
    c.position.set(0.6 + i * 0.84, 0.55, -0.35); c.castShadow = true;
    scene.add(c);
  }

  // Coffee table — marble top + walnut legs
  const tableTopMat = new THREE.MeshStandardMaterial({
    map: TEX.bath,
    bumpMap: TEX.bath,
    bumpScale: 0.03,
    roughness: 0.18,
    metalness: 0.16,
    color: 0xFFF7EA,
  });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.7), tableTopMat);
  tableTop.position.set(0.6, 0.36, 1.0);
  tableTop.castShadow = true; tableTop.receiveShadow = true;
  scene.add(tableTop);
  const legGeo = new THREE.BoxGeometry(0.06, 0.34, 0.06);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.7, metalness: 0.1 });
  [[-0.65, 0.16, 0.31],[0.65, 0.16, 0.31],[-0.65, 0.16, -0.31],[0.65, 0.16, -0.31]].forEach(p => {
    const l = new THREE.Mesh(legGeo, legMat);
    l.position.set(0.6 + p[0], p[1], 1.0 + p[2]);
    scene.add(l);
  });

  // Rug under living
  const rugMat = new THREE.MeshStandardMaterial({ color: 0xD8C9A8, roughness: 0.95, bumpMap: TEX.sofa, bumpScale: 0.02 });
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.6, 0.005, 0.3);
  scene.add(rug);

  // Dining table
  const diningMat = new THREE.MeshStandardMaterial({
    map: TEX.kitchen,
    bumpMap: TEX.kitchen,
    bumpScale: 0.035,
    roughness: 0.2,
    metalness: 0.16,
    color: 0xEFE8D6,
  });
  const diningTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.9), diningMat);
  diningTop.position.set(-3.2, 0.74, 0.6);
  diningTop.castShadow = true; diningTop.receiveShadow = true;
  scene.add(diningTop);
  // dining legs
  [[-1.0, 0.37, 0.4],[1.0, 0.37, 0.4],[-1.0, 0.37, -0.4],[1.0, 0.37, -0.4]].forEach(p => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.74, 0.05), legMat);
    l.position.set(-3.2 + p[0], p[1], 0.6 + p[2]);
    scene.add(l);
  });
  // dining chairs (4)
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x3B3028, roughness: 0.6, metalness: 0.04 });
  [[-3.2 - 0.55, 0.2, 0.6 + 0.65],[-3.2, 0.2, 0.6 + 0.65],[-3.2 + 0.55, 0.2, 0.6 + 0.65],
   [-3.2 - 0.55, 0.2, 0.6 - 0.65],[-3.2, 0.2, 0.6 - 0.65],[-3.2 + 0.55, 0.2, 0.6 - 0.65]].forEach(p => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), chairMat);
    seat.position.set(p[0], 0.42, p[2]);
    seat.castShadow = true;
    scene.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.06), chairMat);
    back.position.set(p[0], 0.7, p[2] + (p[2] > 0.6 ? 0.18 : -0.18));
    back.castShadow = true;
    scene.add(back);
  });

  // Kitchen island (long wall side opposite)
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1.0), tableTopMat);
  islandTop.position.set(-5.5, 0.92, -3.5);
  islandTop.castShadow = true; islandTop.receiveShadow = true;
  scene.add(islandTop);
  const islandBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.88, 1.0),
    new THREE.MeshStandardMaterial({ map: TEX.wall, bumpMap: TEX.wall, bumpScale: 0.02, color: 0x3A2A20, roughness: 0.48, metalness: 0.1 })
  );
  islandBase.position.set(-5.5, 0.44, -3.5);
  islandBase.castShadow = true; islandBase.receiveShadow = true;
  scene.add(islandBase);
  // pendant light
  const pendantMat = new THREE.MeshStandardMaterial({ color: 0xC5A572, emissive: 0xfddc8a, emissiveIntensity: 0.7, metalness: 0.6, roughness: 0.3 });
  for (let i = -1; i <= 1; i++) {
    const cord = new THREE.Mesh(new THREE.BoxGeometry(0.01, 1.2, 0.01), new THREE.MeshStandardMaterial({ color: 0x111 }));
    cord.position.set(-5.5 + i * 1.0, ROOM.H - 0.6, -3.5);
    scene.add(cord);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), pendantMat);
    bulb.position.set(-5.5 + i * 1.0, ROOM.H - 1.2, -3.5);
    scene.add(bulb);
    const pl = new THREE.PointLight(0xFFD9A0, 0.6, 4, 1.5);
    pl.position.copy(bulb.position); pl.position.y -= 0.05;
    scene.add(pl);
  }

  // Plant in corner
  const potMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.6 });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.35, 16), potMat);
  pot.position.set(-HALF_W + 0.6, 0.18, HALF_D - 0.6);
  scene.add(pot);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a5e3a, roughness: 0.7, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.9), leafMat);
    leaf.position.set(-HALF_W + 0.6, 0.7, HALF_D - 0.6);
    leaf.rotation.set(Math.random() * 0.5 - 0.2, (i / 7) * Math.PI * 2, Math.random() * 0.4 - 0.2);
    scene.add(leaf);
  }

  // Decor — gold sphere on coffee table
  const decorMat = new THREE.MeshStandardMaterial({ color: 0xC5A572, metalness: 0.85, roughness: 0.2 });
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 24), decorMat);
  orb.position.set(0.6, 0.51, 1.0);
  orb.castShadow = true; scene.add(orb);
  // book stack
  for (let i = 0; i < 3; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 0.22),
      new THREE.MeshStandardMaterial({ color: i === 0 ? 0x2E2127 : i === 1 ? 0x98674C : 0x1E3A5F, roughness: 0.85 })
    );
    book.position.set(0.95, 0.41 + i * 0.04, 0.92);
    scene.add(book);
  }

  /* ───── Player + Controls ───── */
  const controls = new PointerLockControls(camera, canvas);
  scene.add(controls.getObject());
  controls.getObject().position.set(-HALF_W + 2.2, PLAYER.eye, 0);
  controls.getObject().lookAt(HALF_W - 0.4, FRAME_Y, 0);

  enterBtn.addEventListener('click', () => controls.lock());
  canvas.addEventListener('click', () => { if (!controls.isLocked) controls.lock(); });
  controls.addEventListener('lock', () => {
    overlay.classList.add('hidden');
    canvas.classList.add('locked');
  });
  controls.addEventListener('unlock', () => {
    overlay.classList.remove('hidden');
    canvas.classList.remove('locked');
  });

  const keys = {};
  addEventListener('keydown', (e) => { keys[e.code] = true; });
  addEventListener('keyup',   (e) => { keys[e.code] = false; });

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  function tryMove(dx, dz) {
    const next = controls.getObject().position.clone();
    next.x += dx; next.z += dz;
    // wall clamp
    const r = PLAYER.radius;
    next.x = Math.max(-HALF_W + r + 0.1, Math.min(HALF_W - r - 0.1, next.x));
    next.z = Math.max(-HALF_D + r + 0.1, Math.min(HALF_D - r - 0.1, next.z));
    // simple furniture collision (sofa, dining, island, table)
    const COLLIDERS = [
      { x: 0.6, z: -0.4, w: 2.9, d: 1.3 },   // sofa
      { x: 0.6, z:  1.0, w: 1.6, d: 0.9 },   // coffee table
      { x: -3.2, z: 0.6, w: 2.4, d: 1.1 },   // dining
      { x: -5.5, z: -3.5, w: 3.4, d: 1.2 },  // kitchen island
    ];
    for (const c of COLLIDERS) {
      if (next.x > c.x - c.w/2 - r && next.x < c.x + c.w/2 + r &&
          next.z > c.z - c.d/2 - r && next.z < c.z + c.d/2 + r) {
        return; // blocked
      }
    }
    controls.getObject().position.x = next.x;
    controls.getObject().position.z = next.z;
  }

  /* ───── HUD update — nearest frame info ───── */
  function updateHUD() {
    const p = controls.getObject().position;
    hudPos.textContent = `x ${p.x.toFixed(1)} · z ${p.z.toFixed(1)}`;
    let nearest = null, dMin = Infinity;
    for (const fp of framePositions) {
      const d = Math.hypot(fp.x - p.x, fp.z - p.z);
      if (d < dMin) { dMin = d; nearest = fp; }
    }
    if (nearest && dMin < 3.5) {
      const s = nearest.site;
      hudFrame.textContent = `${s.rank} · ${s.name}`;
      fiRank.textContent = `${s.rank} · ★ ${s.score.toFixed(1)} / 10`;
      fiName.textContent = s.name;
      fiTag.textContent = s.tag;
      frameInfo.classList.add('show');
    } else {
      hudFrame.textContent = '— · — · —';
      frameInfo.classList.remove('show');
    }
  }

  /* ───── Resize ───── */
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  addEventListener('resize', resize);

  /* ───── Animation loop ───── */
  let prev = performance.now();
  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const t = performance.now();
    const dt = Math.min(0.05, (t - prev) / 1000);
    prev = t;

    if (controls.isLocked) {
      direction.set(0, 0, 0);
      if (keys.KeyW || keys.ArrowUp)    direction.z -= 1;
      if (keys.KeyS || keys.ArrowDown)  direction.z += 1;
      if (keys.KeyA || keys.ArrowLeft)  direction.x -= 1;
      if (keys.KeyD || keys.ArrowRight) direction.x += 1;
      if (direction.lengthSq() > 0) direction.normalize();

      // forward/right from camera
      const fwd = new THREE.Vector3();
      camera.getWorldDirection(fwd);
      fwd.y = 0; fwd.normalize();
      const right = new THREE.Vector3(fwd.z, 0, -fwd.x);
      const move = new THREE.Vector3()
        .addScaledVector(fwd, -direction.z)
        .addScaledVector(right, direction.x)
        .multiplyScalar(PLAYER.speed * dt);
      tryMove(move.x, move.z);
    }
    updateHUD();
    renderer.render(scene, camera);
  }
  loop();
})();
