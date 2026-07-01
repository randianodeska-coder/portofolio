/* ============================================================
   ULTRA 3D — Next-Level Cinematic Animations
   Mobile-adaptive, 60fps, WebGL + Canvas
   ============================================================ */
(function () {
  'use strict';

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 2 : 2);
  const isMobile = window.innerWidth < 768;

  /* ── Quality Tiers ── */
  const Q = isMobile
    ? { particles: 600, rings: 6, segments: 16, starCount: 400, fps: 30 }
    : { particles: 1800, rings: 12, segments: 32, starCount: 1200, fps: 60 };

  /* ── Wait for body ready ── */
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(() => {
    initGalaxy3D();
    initAuroraCanvas();
    initDepthParticles();
    initMobileGyro();
  });

  /* ============================================================
     1. THREE.JS GALAXY VORTEX — Hero Background
     ============================================================ */
  function initGalaxy3D() {
    const canvas = document.getElementById('cityCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = window.innerWidth, H = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020409, 0.003);

    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 2000);
    camera.position.set(0, 30, 120);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      });
    } catch (e) { return; }

    renderer.setSize(W, H);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    /* ── Spiral Galaxy Arms ── */
    const galaxyGeo = new THREE.BufferGeometry();
    const N = Q.particles;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const arms = 3;

    for (let i = 0; i < N; i++) {
      const arm = (i % arms) * ((Math.PI * 2) / arms);
      const t = Math.pow(Math.random(), 0.6);
      const radius = t * 90 + 5;
      const spin = radius * 0.04;
      const angle = arm + spin + (Math.random() - 0.5) * 0.6;
      const scatter = Math.random() * 8 * (1 - t);

      pos[i * 3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 * (1 - t * 0.8);
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;

      /* colour: core=cyan, mid=white, outer=red */
      const r2 = radius / 90;
      col[i * 3]     = 0.4 + r2 * 0.6;
      col[i * 3 + 1] = 0.8 - r2 * 0.3;
      col[i * 3 + 2] = 1.0 - r2 * 0.5;

      sizes[i] = isMobile ? (0.8 + Math.random() * 1.6) : (0.5 + Math.random() * 2.2);
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    galaxyGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    /* Custom shader for glowing round stars */
    const galaxyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uPixelRatio:{ value: dpr }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          float pulse = 1.0 + 0.15 * sin(uTime * 2.0 + position.x * 0.3 + position.z * 0.2);
          gl_PointSize = size * uPixelRatio * pulse * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float strength = 1.0 - (d * 2.0);
          strength = pow(strength, 2.0);
          gl_FragColor = vec4(vColor, strength * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxy);

    /* ── Spider Web Rings (interactive) ── */
    const webGroup = new THREE.Group();
    scene.add(webGroup);
    const webMat = new THREE.LineBasicMaterial({
      color: 0xC1121F, transparent: true, opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    const ringCount = Q.rings;
    const seg = Q.segments;
    const webOrigPts = [];

    for (let r = 1; r <= ringCount; r++) {
      const rad = Math.pow(r, 1.15) * 7;
      const pts = [];
      for (let s = 0; s <= seg; s++) {
        const a = (s / seg) * Math.PI * 2;
        const jitter = r > 1 ? (Math.random() - 0.5) * 2 : 0;
        const v = new THREE.Vector3(
          Math.cos(a) * rad + jitter,
          Math.sin(r * 0.4) * 3,
          Math.sin(a) * rad + jitter
        );
        pts.push(v);
        webOrigPts.push(v.clone());
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      webGroup.add(new THREE.Line(geo, webMat));
    }

    /* Spokes */
    for (let s = 0; s < seg; s++) {
      const a = (s / seg) * Math.PI * 2;
      const inner = new THREE.Vector3(Math.cos(a) * 4, 0, Math.sin(a) * 4);
      const outer = new THREE.Vector3(
        Math.cos(a) * Math.pow(ringCount, 1.15) * 7,
        0,
        Math.sin(a) * Math.pow(ringCount, 1.15) * 7
      );
      const geo = new THREE.BufferGeometry().setFromPoints([inner, outer]);
      webGroup.add(new THREE.Line(geo, webMat.clone()));
    }

    /* ── Central Glow Orb ── */
    const orbGeo = new THREE.SphereGeometry(4, 32, 32);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    const orbGlow = new THREE.PointLight(0x00D4FF, 3, 120);
    scene.add(orbGlow);
    const redLight = new THREE.PointLight(0xC1121F, 2, 200);
    scene.add(redLight);

    /* ── Mouse / Touch tracking ── */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = e => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      tmx = (x / window.innerWidth  - 0.5) * 2;
      tmy = -(y / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    /* ── Scroll depth ── */
    let scrollProg = 0;
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProg = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let frameId;
    let lastFrame = 0;
    const fpsInterval = 1000 / Q.fps;

    function animate(timestamp) {
      frameId = requestAnimationFrame(animate);
      const elapsed = timestamp - lastFrame;
      if (elapsed < fpsInterval) return;
      lastFrame = timestamp - (elapsed % fpsInterval);

      const t  = clock.getElapsedTime();
      const dt = clock.getDelta();

      mx += (tmx - mx) * 4 * Math.min(dt, 0.05);
      my += (tmy - my) * 4 * Math.min(dt, 0.05);

      galaxyMat.uniforms.uTime.value = t;

      /* Slow galaxy spin + mouse tilt */
      galaxy.rotation.y = t * 0.04 + mx * 0.15;
      galaxy.rotation.x = my * 0.08;

      /* Web pulse and mouse distortion */
      webGroup.rotation.y = t * 0.06 + mx * 0.2;
      webGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + my * 0.1;
      webGroup.children.forEach((line, li) => {
        const geo = line.geometry;
        if (!geo.attributes.position) return;
        const arr = geo.attributes.position.array;
        for (let k = 0; k < arr.length; k += 3) {
          arr[k + 1] += Math.sin(t * 1.5 + li * 0.8 + k) * 0.02;
        }
        geo.attributes.position.needsUpdate = true;
      });

      /* Camera cinematic orbit */
      camera.position.x = Math.sin(t * 0.08) * 20 + mx * 30;
      camera.position.y = 30 + my * 20 + Math.cos(t * 0.06) * 8;
      camera.position.z = 120 - scrollProg * 80;
      camera.lookAt(0, 0, 0);

      /* Orb breathing */
      const pulse = 1 + Math.sin(t * 2) * 0.2;
      orb.scale.setScalar(pulse);
      orbGlow.intensity = 2 + Math.sin(t * 3) * 0.8;
      orbGlow.position.set(Math.sin(t) * 10, Math.cos(t * 0.7) * 5, 0);
      redLight.position.set(mx * 80, my * 60, 50);
      redLight.intensity = 2 + Math.sin(t * 7) * 0.5;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  /* ============================================================
     2. AURORA / PLASMA CANVAS — Full-screen background
     ============================================================ */
  function initAuroraCanvas() {
    const existing = document.getElementById('auroraCanvas');
    if (existing) return;

    const cv = document.createElement('canvas');
    cv.id = 'auroraCanvas';
    cv.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:0',
      'opacity:0.55', 'mix-blend-mode:screen'
    ].join(';');
    document.body.prepend(cv);

    const ctx = cv.getContext('2d');
    let W = cv.width = window.innerWidth;
    let H = cv.height = window.innerHeight;

    window.addEventListener('resize', () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    }, { passive: true });

    const blobs = Array.from({ length: isMobile ? 4 : 7 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (isMobile ? 160 : 280) + Math.random() * (isMobile ? 120 : 220),
      vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
      vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
      hue: [220, 190, 350, 280, 200, 160, 320][i % 7],
      phase: Math.random() * Math.PI * 2
    }));

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      blobs.forEach(b => {
        b.x += b.vx + Math.sin(t + b.phase) * 0.3;
        b.y += b.vy + Math.cos(t * 0.7 + b.phase) * 0.25;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;

        const pulse = 1 + 0.15 * Math.sin(t * 2 + b.phase);
        const rad = b.r * pulse;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
        const alpha = isMobile ? 0.13 : 0.1;
        g.addColorStop(0,   `hsla(${b.hue},100%,70%,${alpha})`);
        g.addColorStop(0.5, `hsla(${b.hue + 30},80%,50%,${alpha * 0.5})`);
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
     3. DEPTH STAR FIELD — Parallax 3D stars (pure canvas)
     ============================================================ */
  function initDepthParticles() {
    const existing = document.getElementById('starCanvas');
    if (existing) return;

    const cv = document.createElement('canvas');
    cv.id = 'starCanvas';
    cv.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:0', 'opacity:0.7'
    ].join(';');
    document.body.prepend(cv);

    const ctx = cv.getContext('2d');
    let W = cv.width = window.innerWidth;
    let H = cv.height = window.innerHeight;

    const N = Q.starCount;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),          // depth 0..1 (1=close)
      size: 0.3 + Math.random() * 1.6,
      speed: 0.04 + Math.random() * 0.12,
      twinkle: Math.random() * Math.PI * 2,
      color: Math.random() < 0.15
        ? `hsl(${200 + Math.random() * 60},100%,85%)`
        : `hsl(${350 + Math.random() * 20},80%,85%)`
    }));

    let mx = 0, my = 0;
    if (!isTouch) {
      window.addEventListener('mousemove', e => {
        mx = (e.clientX / W - 0.5);
        my = (e.clientY / H - 0.5);
      }, { passive: true });
    }

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        /* subtle parallax based on depth */
        const px = s.x + mx * s.z * 18;
        const py = s.y + my * s.z * 12;

        const twinkle = 0.5 + 0.5 * Math.sin(t * 2.5 + s.twinkle);
        const r = s.size * (0.7 + 0.5 * twinkle * s.z);
        const alpha = (0.3 + 0.7 * twinkle) * s.z;

        if (r < 0.2) return;

        /* glow */
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        grd.addColorStop(0, s.color.replace(')', `,${alpha * 0.8})`).replace('hsl', 'hsla'));
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* core */
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(')', `,${alpha})`).replace('hsl', 'hsla');
        ctx.fill();
      });
    }
    draw();

    window.addEventListener('resize', () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    }, { passive: true });
  }

  /* ============================================================
     4. MOBILE GYROSCOPE PARALLAX — tilt to pan galaxy
     ============================================================ */
  function initMobileGyro() {
    if (!isTouch) return;

    const cityCanvas = document.getElementById('cityCanvas');
    if (!cityCanvas) return;

    let lastGamma = 0, lastBeta = 0;

    function request() {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(r => { if (r === 'granted') listen(); })
          .catch(() => {});
      } else {
        listen();
      }
    }

    function listen() {
      window.addEventListener('deviceorientation', e => {
        const gamma = Math.max(-25, Math.min(25, e.gamma || 0));
        const beta  = Math.max(-25, Math.min(25, (e.beta  || 0) - 45));
        lastGamma += (gamma - lastGamma) * 0.08;
        lastBeta  += (beta  - lastBeta)  * 0.08;

        /* Shift city canvas for tactile parallax feel */
        cityCanvas.style.transform =
          `translate(${lastGamma * 0.6}px, ${lastBeta * 0.4}px) scale(1.04)`;
      }, { passive: true });
    }

    /* trigger on first touch */
    document.addEventListener('touchstart', request, { once: true });
  }

  /* ============================================================
     5. HERO IMAGE — Cinematic 3D Tilt on Mobile (touch)
     ============================================================ */
  (function initHeroImageTilt() {
    const img = document.getElementById('heroImage3D');
    if (!img) return;

    if (isTouch) {
      /* Use touch drag for tilt */
      let startX, startY;
      document.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      document.addEventListener('touchmove', e => {
        if (!startX) return;
        const dx = (e.touches[0].clientX - startX) / window.innerWidth;
        const dy = (e.touches[0].clientY - startY) / window.innerHeight;
        img.style.transform = `perspective(800px) rotateY(${dx * 20}deg) rotateX(${-dy * 14}deg) scale(1.05)`;
        img.style.transition = 'transform 0.1s ease';
      }, { passive: true });

      document.addEventListener('touchend', () => {
        img.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        img.style.transition = 'transform 0.8s cubic-bezier(0.23,1,0.32,1)';
      }, { passive: true });
    }
  })();

  /* ============================================================
     6. SECTION BACKGROUND — Animated gradient mesh per section
     ============================================================ */
  (function initSectionMesh() {
    const sections = document.querySelectorAll('.sec-dark');
    sections.forEach(sec => {
      if (sec.querySelector('.mesh-bg')) return;
      const mesh = document.createElement('div');
      mesh.className = 'mesh-bg';
      mesh.style.cssText = [
        'position:absolute', 'inset:0', 'pointer-events:none', 'z-index:0',
        'background:radial-gradient(ellipse at 20% 30%,rgba(0,212,255,0.04) 0%,transparent 60%),' +
        'radial-gradient(ellipse at 80% 70%,rgba(193,18,31,0.06) 0%,transparent 55%)',
        'animation:meshPulse 8s ease-in-out infinite alternate'
      ].join(';');
      if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      sec.prepend(mesh);
    });

    /* Inject keyframes once */
    if (!document.getElementById('meshStyle')) {
      const s = document.createElement('style');
      s.id = 'meshStyle';
      s.textContent = `
        @keyframes meshPulse {
          0%   { opacity:0.6; transform:scale(1) rotate(0deg); }
          50%  { opacity:1;   transform:scale(1.05) rotate(1deg); }
          100% { opacity:0.7; transform:scale(0.98) rotate(-1deg); }
        }
        /* ── Glowing city canvas on mobile ── */
        @media (max-width:768px) {
          #cityCanvas {
            transition: transform 0.3s ease;
            will-change: transform;
          }
        }
        /* ── Star / Aurora canvas ordering ── */
        #starCanvas   { z-index: 0 !important; }
        #auroraCanvas { z-index: 0 !important; }
        #cityCanvas   { z-index: 2 !important; }
      `;
      document.head.appendChild(s);
    }
  })();

})();
