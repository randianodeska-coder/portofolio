/* ============================================================
   GALAXY 3D — Realistic Cosmic Space Engine
   Three.js WebGL + Canvas nebula + star field
   ============================================================ */
(function () {
  'use strict';

  const isMobile = window.innerWidth < 768;
  const isTouch  = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dpr      = Math.min(window.devicePixelRatio || 1, 2);

  const Q = isMobile
    ? { stars: 8000,  nebulaBlobs: 5,  galaxyPts: 25000, arms: 4 }
    : { stars: 20000, nebulaBlobs: 9,  galaxyPts: 80000, arms: 5 };

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(() => {
    replaceGalaxy3D();
    initNebulaCanvas();
    initStarField();
    updatePreloaderText();
  });

  /* ============================================================
     UPDATE PRELOADER TEXT — space themed
  ============================================================ */
  function updatePreloaderText() {
    const status = document.getElementById('preStatus');
    const msgs = [
      'SCANNING COSMOS...',
      'CALIBRATING WARP DRIVE...',
      'MAPPING STELLAR OBJECTS...',
      'ENTERING DEEP SPACE...',
      'GALAXY INITIALIZED ✦'
    ];
    if (!status) return;
    let i = 0;
    const iv = setInterval(() => {
      status.textContent = msgs[i++ % msgs.length];
    }, 600);
    setTimeout(() => clearInterval(iv), 4000);
  }

  /* ============================================================
     1. THREE.JS GALAXY — Realistic Milky Way Spiral
  ============================================================ */
  function replaceGalaxy3D() {
    const canvas = document.getElementById('cityCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = window.innerWidth, H = window.innerHeight;
    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x000008, isMobile ? 0.0015 : 0.0008);

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 80, 220);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      });
    } catch (e) { return; }

    renderer.setSize(W, H);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    /* ── Spiral Galaxy Arms ── */
    const N    = Q.galaxyPts;
    const arms = Q.arms;
    const pos  = new Float32Array(N * 3);
    const col  = new Float32Array(N * 3);
    const sz   = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const arm      = (i % arms) * ((Math.PI * 2) / arms);
      const t        = Math.pow(Math.random(), 0.5);
      const radius   = t * 160 + 2;
      const spin     = radius * 0.055;
      const angle    = arm + spin + (Math.random() - 0.5) * 0.9;
      const scatter  = Math.random() * 12 * (1 - t * 0.7);
      const heightSc = Math.random() * 10 * (1 - t * 0.9);

      pos[i * 3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * heightSc;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;

      /* Realistic star colours: core=blue-white, mid=yellow, outer=red-orange */
      const r2 = radius / 160;
      if (r2 < 0.1) {
        // core: bright blue-white
        col[i * 3] = 0.85; col[i * 3 + 1] = 0.9; col[i * 3 + 2] = 1.0;
      } else if (r2 < 0.4) {
        // inner arms: violet/blue
        col[i * 3] = 0.55 + r2 * 0.3; col[i * 3 + 1] = 0.4; col[i * 3 + 2] = 1.0 - r2 * 0.3;
      } else if (r2 < 0.7) {
        // mid: white-cyan
        col[i * 3] = 0.7; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 1.0;
      } else {
        // outer: pink/red
        col[i * 3] = 0.9 + r2 * 0.1; col[i * 3 + 1] = 0.4 - r2 * 0.2; col[i * 3 + 2] = 0.6;
      }

      sz[i] = isMobile
        ? (0.6 + Math.random() * 1.8) * (1.5 - t)
        : (0.3 + Math.random() * 2.5) * (1.8 - t);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sz,  1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uPixelRatio: { value: dpr }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDist;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDist = length(position.xz) / 160.0;
          float twinkle = 1.0 + 0.2 * sin(uTime * 3.0 + position.x * 0.5 + position.z * 0.3);
          gl_PointSize = size * uPixelRatio * twinkle * (180.0 / -mvPos.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDist;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          float core  = 1.0 - smoothstep(0.0, 0.15, d);
          float halo  = 1.0 - smoothstep(0.1, 0.5, d);
          float alpha = core * 0.95 + halo * 0.4;
          vec3 finalColor = vColor + core * 0.4;
          gl_FragColor = vec4(finalColor, alpha * (0.6 + vDist * 0.4));
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      vertexColors: true
    });

    const galaxy = new THREE.Points(geo, mat);
    scene.add(galaxy);

    /* ── Dust lanes — dark absorption ── */
    const dustN   = isMobile ? 3000 : 10000;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      const arm   = (i % arms) * ((Math.PI * 2) / arms) + 0.2;
      const t     = Math.pow(Math.random(), 0.7);
      const r     = t * 120 + 5;
      const spin  = r * 0.05;
      const angle = arm + spin + (Math.random() - 0.5) * 0.5;
      dustPos[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * 15;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 15;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x220033, size: isMobile ? 4 : 6,
      transparent: true, opacity: 0.08,
      depthWrite: false, blending: THREE.NormalBlending
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    /* ── Background star field ── */
    const bgN   = isMobile ? 3000 : 8000;
    const bgPos = new Float32Array(bgN * 3);
    const bgCol = new Float32Array(bgN * 3);
    const bgSz  = new Float32Array(bgN);
    for (let i = 0; i < bgN; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 400 + Math.random() * 600;
      bgPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i * 3 + 2] = r * Math.cos(phi);
      const starType = Math.random();
      if (starType < 0.1) { bgCol[i*3]=0.6; bgCol[i*3+1]=0.7; bgCol[i*3+2]=1.0; }      // blue
      else if (starType < 0.3) { bgCol[i*3]=1.0; bgCol[i*3+1]=0.95; bgCol[i*3+2]=0.85; } // warm white
      else if (starType < 0.5) { bgCol[i*3]=1.0; bgCol[i*3+1]=0.8; bgCol[i*3+2]=0.5; }  // yellow
      else { bgCol[i*3]=0.9; bgCol[i*3+1]=0.9; bgCol[i*3+2]=1.0; }                       // cool white
      bgSz[i] = 0.2 + Math.random() * 1.2;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute('color',    new THREE.BufferAttribute(bgCol, 3));
    bgGeo.setAttribute('size',     new THREE.BufferAttribute(bgSz,  1));
    const bgMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: dpr } },
      vertexShader: `
        attribute float size; attribute vec3 color; varying vec3 vColor;
        uniform float uTime; uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          float tw = 1.0 + 0.3 * sin(uTime * 2.0 + position.x * 0.02 + position.y * 0.01);
          gl_PointSize = size * uPixelRatio * tw * (300.0 / -mvPos.z);
          gl_PointSize = clamp(gl_PointSize, 0.3, 6.0);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float a = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(vColor, a * 0.85);
        }
      `,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, vertexColors: true
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    /* ── Central Black Hole / Galactic Core ── */
    const coreGeo = new THREE.SphereGeometry(3, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const coreOrb = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreOrb);

    /* Accretion disk glow */
    const diskGeo = new THREE.TorusGeometry(8, 3, 8, 80);
    const diskMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 2.2;
    scene.add(disk);

    /* ── Lights ── */
    const coreLight  = new THREE.PointLight(0x8B5CF6, isMobile ? 3 : 5, 300);
    const cyanLight  = new THREE.PointLight(0x00D4FF, isMobile ? 1.5 : 2.5, 250);
    cyanLight.position.set(-60, 30, -80);
    const pinkLight  = new THREE.PointLight(0xEC4899, 1, 200);
    pinkLight.position.set(80, -30, 60);
    scene.add(coreLight, cyanLight, pinkLight);

    /* ── Mouse / Gyro ── */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = e => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      tmx = (x / window.innerWidth  - 0.5) * 2;
      tmy = -(y / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    /* ── Scroll ── */
    let scrollP = 0;
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });

    /* ── Animate ── */
    const clock = new THREE.Clock();
    const fpsInterval = 1000 / (isMobile ? 30 : 60);
    let lastFrame = 0;

    function animate(ts) {
      requestAnimationFrame(animate);
      if (ts - lastFrame < fpsInterval) return;
      lastFrame = ts;

      const t  = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      mx += (tmx - mx) * 3 * dt;
      my += (tmy - my) * 3 * dt;

      mat.uniforms.uTime.value   = t;
      bgMat.uniforms.uTime.value = t;

      /* Galaxy slow rotation */
      galaxy.rotation.y = t * 0.018 + mx * 0.12;
      galaxy.rotation.x = 0.15 + my * 0.06;

      /* Background stars counter-rotate slightly */
      bgStars.rotation.y = t * 0.003;

      /* Accretion disk spin */
      disk.rotation.z = t * 0.3;
      diskMat.opacity = 0.08 + Math.sin(t * 2) * 0.04;

      /* Core pulse */
      const pulse = 1 + Math.sin(t * 1.5) * 0.3;
      coreOrb.scale.setScalar(pulse);
      coreLight.intensity = (isMobile ? 3 : 5) + Math.sin(t * 2.5) * 1.5;
      coreLight.position.set(Math.sin(t * 0.4) * 5, Math.cos(t * 0.3) * 3, 0);

      /* Cinematic camera orbit */
      const camR = 220 - scrollP * 120;
      camera.position.x = Math.sin(t * 0.06) * 30 + mx * 40;
      camera.position.y = 80 + my * 25 + Math.cos(t * 0.05) * 15;
      camera.position.z = camR;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    /* Resize */
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  /* ============================================================
     2. NEBULA CANVAS — Volumetric gas clouds
  ============================================================ */
  function initNebulaCanvas() {
    const existing = document.getElementById('nebulaCanvas');
    if (existing) return;

    const cv = document.createElement('canvas');
    cv.id = 'nebulaCanvas';
    cv.style.cssText = [
      'position:fixed','inset:0','width:100%','height:100%',
      'pointer-events:none','z-index:1',
      'opacity:0.45','mix-blend-mode:screen'
    ].join(';');
    document.body.prepend(cv);

    const ctx = cv.getContext('2d');
    let W = cv.width = window.innerWidth;
    let H = cv.height = window.innerHeight;
    window.addEventListener('resize', () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; });

    /* Nebula blobs — rich cosmic colors */
    const blobs = [
      { x: W*0.2, y: H*0.3, r: 350, hue: 270, sat: 90, phase: 0,    vx:0.08, vy:0.05 }, // violet
      { x: W*0.7, y: H*0.6, r: 280, hue: 200, sat: 100,phase: 1.5,  vx:-0.06,vy:0.08 }, // cyan
      { x: W*0.5, y: H*0.8, r: 400, hue: 320, sat: 80, phase: 3,    vx:0.05, vy:-0.07}, // pink
      { x: W*0.1, y: H*0.7, r: 250, hue: 240, sat: 90, phase: 0.8,  vx:0.09, vy:0.04 }, // blue
      { x: W*0.85,y: H*0.2, r: 300, hue: 290, sat: 70, phase: 2.2,  vx:-0.07,vy:0.06 }, // purple
    ].slice(0, Q.nebulaBlobs);

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      t += 0.005;
      ctx.clearRect(0, 0, W, H);

      blobs.forEach(b => {
        b.x += b.vx + Math.sin(t * 0.5 + b.phase) * 0.4;
        b.y += b.vy + Math.cos(t * 0.4 + b.phase) * 0.3;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;

        const pulse = 1 + 0.12 * Math.sin(t * 1.5 + b.phase);
        const rad = b.r * pulse;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
        const a = isMobile ? 0.08 : 0.06;
        g.addColorStop(0,   `hsla(${b.hue},${b.sat}%,65%,${a})`);
        g.addColorStop(0.4, `hsla(${b.hue+20},${b.sat-10}%,45%,${a*0.5})`);
        g.addColorStop(1,   'hsla(0,0%,0%,0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    }
    draw();
  }

  /* ============================================================
     3. STAR FIELD — 2D twinkling parallax background
  ============================================================ */
  function initStarField() {
    const existing = document.getElementById('cosmicStarField');
    if (existing) return;

    const cv = document.createElement('canvas');
    cv.id = 'cosmicStarField';
    cv.style.cssText = [
      'position:fixed','inset:0','width:100%','height:100%',
      'pointer-events:none','z-index:0','opacity:0.8'
    ].join(';');
    document.body.prepend(cv);

    const ctx = cv.getContext('2d');
    let W = cv.width = window.innerWidth;
    let H = cv.height = window.innerHeight;
    window.addEventListener('resize', () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; });

    const colors = ['255,255,255','200,210,255','255,240,200','200,240,255','255,200,240'];
    const N = Q.stars;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      size: 0.2 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let mx = 0, my = 0;
    if (!isTouch) {
      window.addEventListener('mousemove', e => {
        mx = e.clientX / W - 0.5;
        my = e.clientY / H - 0.5;
      }, { passive: true });
    }

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        const px = s.x + mx * s.z * 20;
        const py = s.y + my * s.z * 14;
        const tw = 0.5 + 0.5 * Math.sin(t * 2 + s.phase);
        const r  = s.size * (0.6 + 0.5 * tw * s.z);
        const a  = (0.2 + 0.8 * tw) * s.z;
        if (r < 0.15) return;

        /* Glow halo */
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        grd.addColorStop(0, `rgba(${s.color},${(a * 0.6).toFixed(3)})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* Star core */
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${a.toFixed(3)})`;
        ctx.fill();
      });
    }
    draw();
  }

})();
