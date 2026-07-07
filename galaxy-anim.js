/**
 * GALAXY ANIMATIONS v1 — Per-Section Signature 3D Scroll Animations
 * Requires: GSAP + ScrollTrigger (loaded before this file)
 * Each section has a unique visual identity driven by scroll scrub.
 */

(function () {
'use strict';

/* ─── UTILS ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t) => a + (b - a) * t;

/* ─── CSS INJECT (orbital, glow, split-char styles) ─── */
function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
  /* ── Split chars ── */
  .char-3d {
    display: inline-block;
    transform-style: preserve-3d;
    transition: transform 0.1s linear;
    will-change: transform;
  }

  /* ── Orbital CSS elements ── */
  .orb-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  }
  .orb-planet {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    transform-style: preserve-3d;
  }

  /* ── Mission orbit list ── */
  .mission-orbit-item {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .mission-orbit-item.in-view {
    opacity: 1;
    transform: translateX(0);
  }
  .mission-dot {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid #22d3ee;
    background: rgba(34,211,238,0.15);
    box-shadow: 0 0 12px #22d3ee;
    flex-shrink: 0;
    position: relative;
    animation: mDotPulse 2s ease-in-out infinite;
  }
  .mission-dot::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px solid rgba(34,211,238,0.3);
    animation: mRingExpand 2s ease-in-out infinite;
  }
  @keyframes mDotPulse {
    0%,100% { box-shadow: 0 0 8px #22d3ee; }
    50% { box-shadow: 0 0 20px #22d3ee, 0 0 40px rgba(34,211,238,0.3); }
  }
  @keyframes mRingExpand {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* ── Values cluster ── */
  .val-cluster {
    position: relative;
    width: 420px; height: 420px;
    margin: 0 auto 3rem auto;
    transform-style: preserve-3d;
  }
  .val-planet {
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-family: var(--font-mono, monospace);
    border: 1.5px solid rgba(34,211,238,0.4);
    background: rgba(12, 3, 24, 0.8);
    box-shadow: 0 0 20px rgba(34,211,238,0.15);
    cursor: default;
    transition: box-shadow 0.4s, transform 0.4s;
    will-change: transform;
  }
  .val-planet.focus {
    box-shadow: 0 0 30px #22d3ee, 0 0 60px rgba(34,211,238,0.4);
    transform: scale(1.2) translateZ(30px) !important;
  }
  .val-planet-label {
    font-size: 0.5rem;
    letter-spacing: 0.08em;
    color: rgba(34,211,238,0.7);
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* ── Services depth parallax ── */
  .svc-planet {
    will-change: transform;
    transform-style: preserve-3d;
    transition: box-shadow 0.3s;
  }

  /* ── Quote singularity ── */
  #singularity-core {
    position: fixed;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 20px white, 0 0 60px rgba(255,255,255,0.6);
    pointer-events: none;
    z-index: 5;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: none;
  }
  #singularity-veil {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.97) 100%);
    pointer-events: none;
    z-index: 4;
    opacity: 0;
    display: none;
  }

  /* ── Hero letter depth ── */
  .hero-title-wrap {
    transform-style: preserve-3d;
    perspective: 600px;
  }

  /* ── Finale bloom ── */
  #finale-bloom {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(124,58,237,0.6) 0%, rgba(34,211,238,0.3) 30%, transparent 70%);
    pointer-events: none;
    z-index: 3;
    opacity: 0;
    display: none;
  }
  `;
  document.head.appendChild(style);
}

/* ─── SPLIT TEXT INTO CHARS ─── */
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  return text.split('').map(ch => {
    const span = document.createElement('span');
    span.className = 'char-3d';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
    return span;
  });
}

/* ─── 1. HERO — "GALAXY EMERGENCE" ─── */
function initHeroAnim() {
  const sec = $('#hero');
  if (!sec) return;

  // Split title chars for depth effect
  const titleLines = $$('.title-line', sec);
  const allChars = [];
  titleLines.forEach(line => {
    allChars.push(...splitChars(line));
  });

  // Assign random depth offset to each char
  allChars.forEach((ch, i) => {
    const depth = (Math.random() - 0.5) * 60;
    const rotX  = (Math.random() - 0.5) * 20;
    ch.dataset.depth = depth;
    ch.dataset.rotX  = rotX;
    // Initial: flat
    ch.style.transform = `translateZ(0px) rotateX(0deg)`;
  });

  // Hero sub/tagline start visible
  const sub = $('.hero-sub', sec);
  const tag = $('.hero-tagline', sec);

  // Scrub: as hero scrolls away, chars gain depth and content fades
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress;

        // Chars: depth diverge as we scroll away
        allChars.forEach(ch => {
          const d = parseFloat(ch.dataset.depth) * p * 2;
          const r = parseFloat(ch.dataset.rotX) * p * 1.5;
          const blur = p * Math.abs(parseFloat(ch.dataset.depth)) / 40;
          ch.style.transform = `translateZ(${d}px) rotateX(${r}deg)`;
          ch.style.filter = `blur(${blur.toFixed(2)}px)`;
          ch.style.opacity = `${1 - p * 0.8}`;
        });

        // Hero content scale down as we leave
        if (sub) sub.style.opacity = `${Math.max(0, 1 - p * 2)}`;
        if (tag) tag.style.opacity = `${Math.max(0, 1 - p * 2)}`;

        // Nudge galaxy rotation via S.baseCam breath
        if (window.S) S.idle = p > 0.05 ? 0 : S.idle;
      }
    }
  });
}

/* ─── 2. ABOUT — "PLANET REVEAL & ROTATE" ─── */
function initAboutAnim() {
  const sec = $('#about');
  if (!sec) return;

  const frame = $('.profile-frame', sec);
  const img   = $('.profile-img', sec);
  if (!frame) return;

  // ENTER: planet rises from dark
  gsap.fromTo(frame,
    { scale: 0, opacity: 0, rotateY: -90, filter: 'blur(20px)' },
    {
      scale: 1, opacity: 1, rotateY: 0, filter: 'blur(0px)',
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: sec, start: 'top 75%', end: 'top 25%',
        scrub: 1.5
      }
    }
  );

  // SUSTAIN: continuous rotation (CSS, not scrub-based)
  if (img) {
    img.style.animation = 'none';
    const ring = $('.profile-ring', sec);
    if (ring) {
      ring.style.animation = 'orbitRing 8s linear infinite';
    }
  }

  // EXIT: planet zooms away into depth
  gsap.to(frame, {
    scale: 0.3,
    opacity: 0,
    translateZ: -200,
    filter: 'blur(8px)',
    scrollTrigger: {
      trigger: sec, start: '80% center', end: 'bottom top',
      scrub: 1.2
    }
  });

  // Add orbit ring animation
  const ks = document.createElement('style');
  ks.textContent = `
  @keyframes orbitRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  `;
  document.head.appendChild(ks);
}

/* ─── 3. PHILOSOPHY — "ORBITAL CONVERGENCE" ─── */
function initPhilosophyAnim() {
  const sec = $('#philosophy');
  if (!sec) return;

  // Create floating orbital elements
  const orbWrap = document.createElement('div');
  orbWrap.className = 'orb-wrap';
  sec.insertBefore(orbWrap, sec.firstChild);

  const ORBS = [
    { size: 12, color: '#22d3ee', startX: '10%',  startY: '20%', orbitR: 140, orbitAngle: 0   },
    { size: 8,  color: '#7c3aed', startX: '85%',  startY: '15%', orbitR: 140, orbitAngle: 72  },
    { size: 16, color: '#22d3ee', startX: '90%',  startY: '70%', orbitR: 140, orbitAngle: 144 },
    { size: 10, color: '#a78bfa', startX: '15%',  startY: '80%', orbitR: 140, orbitAngle: 216 },
    { size: 6,  color: '#22d3ee', startX: '50%',  startY: '5%',  orbitR: 140, orbitAngle: 288 },
  ];

  const orbEls = ORBS.map(cfg => {
    const el = document.createElement('div');
    el.className = 'orb-planet';
    el.style.cssText = `
      width:${cfg.size}px; height:${cfg.size}px;
      background:${cfg.color};
      box-shadow: 0 0 ${cfg.size*2}px ${cfg.color};
      left:${cfg.startX}; top:${cfg.startY};
    `;
    orbWrap.appendChild(el);
    return { el, cfg };
  });

  // Central glow
  const center = document.createElement('div');
  center.style.cssText = `
    position:absolute; width:6px; height:6px; border-radius:50%;
    background:white; box-shadow:0 0 40px white,0 0 80px rgba(255,255,255,0.4);
    left:50%; top:50%; transform:translate(-50%,-50%);
    opacity:0; transition:opacity 0.3s;
  `;
  orbWrap.appendChild(center);

  // Scrub: orbits form as user scrolls through section
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec, start: 'top 80%', end: 'bottom 20%',
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress;

        // Center light appears
        center.style.opacity = `${p}`;

        orbEls.forEach(({ el, cfg }) => {
          // Interpolate from scattered position → orbit position
          const targetX = 50 + Math.cos((cfg.orbitAngle * Math.PI / 180) + p * Math.PI * 0.5) * (cfg.orbitR * p);
          const targetY = 50 + Math.sin((cfg.orbitAngle * Math.PI / 180) + p * Math.PI * 0.5) * (cfg.orbitR * p * 0.4);

          const startPctX = parseFloat(cfg.startX);
          const startPctY = parseFloat(cfg.startY);
          const fx = lerp(startPctX, targetX, p);
          const fy = lerp(startPctY, targetY, p);

          el.style.left = `${fx}%`;
          el.style.top  = `${fy}%`;
          el.style.opacity = `${0.3 + p * 0.7}`;
          el.style.transform = `scale(${0.5 + p * 0.8}) rotate(${p * 360}deg)`;
        });
      }
    }
  });

  // Quote box: materialize
  const quoteBox = $('.reveal', sec);
  if (quoteBox) {
    gsap.fromTo(quoteBox,
      { opacity: 0, scale: 0.8, filter: 'blur(12px) brightness(2)' },
      {
        opacity: 1, scale: 1, filter: 'blur(0) brightness(1)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quoteBox, start: 'top 70%', end: 'top 30%',
          scrub: 1.2
        }
      }
    );
  }
}

/* ─── 4. VISION — "DEPTH DIVE" ─── */
function initVisionAnim() {
  const sec = $('#vision-mission');
  if (!sec) return;

  // Create central light beacon
  const beacon = document.createElement('div');
  beacon.style.cssText = `
    position:absolute; width:4px; height:4px; border-radius:50%;
    background:white; pointer-events:none;
    left:50%; top:48%; transform:translate(-50%,-50%);
    box-shadow:0 0 0 white; opacity:0; z-index:2;
  `;
  sec.insertBefore(beacon, sec.firstChild);

  // Vision text enter from center light
  const vLeft  = $('.contact-left', sec);
  const vRight = $('.contact-right', sec);

  gsap.fromTo([vLeft, vRight],
    { opacity: 0, scale: 0.85, filter: 'blur(8px) brightness(3)' },
    {
      opacity: 1, scale: 1, filter: 'blur(0) brightness(1)',
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sec, start: 'top 65%', end: 'center center',
        scrub: 1.5
      }
    }
  );

  // Beacon grows as section enters, shrinks as it exits
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec, start: 'top 80%', end: 'bottom 20%',
      scrub: 1,
      onUpdate(self) {
        const p = self.progress;
        const intensity = Math.sin(p * Math.PI); // peak at center
        beacon.style.opacity = `${intensity * 0.9}`;
        beacon.style.boxShadow = `0 0 ${intensity*60}px white, 0 0 ${intensity*120}px rgba(124,58,237,0.5)`;
        beacon.style.transform = `translate(-50%,-50%) scale(${1 + intensity * 8})`;
      }
    }
  });
}

/* ─── 5. MISSION — "ORBITAL CHECKLIST" (scroll-scrubbed stagger) ─── */
function initMissionAnim() {
  const sec = $('#vision-mission');
  if (!sec) return;

  // Wrap mission list items
  const items = $$('.contact-right li', sec);
  items.forEach((li, i) => {
    li.classList.add('mission-orbit-item');
    // Insert a mission dot
    const dot = document.createElement('div');
    dot.className = 'mission-dot';
    li.insertBefore(dot, li.firstChild);
  });

  // Scrub-stagger: each item reveals at its own scroll threshold
  items.forEach((li, i) => {
    gsap.fromTo(li,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sec,
          start: `top+=${i * 60} 70%`,
          end:   `top+=${i * 60 + 120} 60%`,
          scrub: 1
        }
      }
    );
  });
}

/* ─── 6. NILAI BRAND — "ORBITAL CLUSTER ROTATE" ─── */
function initValuesAnim() {
  const sec = $('#skills');
  if (!sec) return;

  const inner = $('.sec-inner', sec);
  if (!inner) return;

  // Get existing skill cards
  const cards = $$('.skill-card', sec);

  // Build CSS cluster
  const cluster = document.createElement('div');
  cluster.className = 'val-cluster';

  const positions = [
    { top: '10%',  left: '50%', tx: '-50%' },   // top center
    { top: '38%',  left: '88%', tx: '-50%' },   // right
    { top: '78%',  left: '73%', tx: '-50%' },   // bottom right
    { top: '78%',  left: '27%', tx: '-50%' },   // bottom left
    { top: '38%',  left: '12%', tx: '-50%' },   // left
  ];

  const valData = [
    { icon: '👁', label: 'Vision',     color: '#22d3ee' },
    { icon: '✦', label: 'Creativity', color: '#7c3aed' },
    { icon: '⚡', label: 'Innovation', color: '#22d3ee' },
    { icon: '💎', label: 'Quality',    color: '#a78bfa' },
    { icon: '🛡', label: 'Integrity',  color: '#22d3ee' },
  ];

  const planetEls = valData.map((v, i) => {
    const pos = positions[i];
    const p = document.createElement('div');
    p.className = 'val-planet';
    p.style.cssText = `
      top:${pos.top}; left:${pos.left};
      transform:translate(${pos.tx}, -50%);
      border-color:${v.color}40;
    `;
    p.innerHTML = `<span style="font-size:1.6rem">${v.icon}</span><span class="val-planet-label">${v.label}</span>`;
    cluster.appendChild(p);
    return p;
  });

  // Replace grid with cluster (keep grid hidden via data, show cluster)
  const grid = $('.skills-grid', sec);
  if (grid) grid.style.display = 'none';
  inner.appendChild(cluster);

  // Scrub: rotate entire cluster with scroll
  let clusterRot = 0;
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec, start: 'top 80%', end: 'bottom 20%',
      scrub: 1.8,
      onUpdate(self) {
        const p = self.progress;
        clusterRot = p * 360;
        cluster.style.transform = `rotate(${clusterRot}deg)`;

        // Counter-rotate each planet so it stays upright
        planetEls.forEach((planet, i) => {
          planet.style.transform = `translate(-50%, -50%) rotate(${-clusterRot}deg)`;

          // Determine which planet faces "forward" (toward top of cluster)
          const planetAngle = (i * 72 + clusterRot) % 360;
          const isFocused = planetAngle > 300 || planetAngle < 60;
          planet.classList.toggle('focus', isFocused);
        });
      }
    }
  });

  // ENTER animation for cluster
  gsap.fromTo(cluster,
    { scale: 0, opacity: 0, filter: 'blur(20px)' },
    {
      scale: 1, opacity: 1, filter: 'blur(0)',
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: sec, start: 'top 75%', end: 'top 30%',
        scrub: 1.5
      }
    }
  );
}

/* ─── 7. LAYANAN — "PLANET FIELD PARALLAX" ─── */
function initServicesAnim() {
  const sec = $('#portfolio');
  if (!sec) return;

  const cards = $$('.portfolio-card', sec);

  // Assign depth layers — each card gets a different parallax speed
  const depths = [1.8, 1.2, 0.8, 0.4]; // closer = faster

  cards.forEach((card, i) => {
    card.classList.add('svc-planet');
    card.style.transition = 'transform 0.15s linear, box-shadow 0.3s';

    const speed = depths[i] || 1;

    gsap.to({}, {
      scrollTrigger: {
        trigger: sec, start: 'top 80%', end: 'bottom 20%',
        scrub: 1,
        onUpdate(self) {
          const p = self.progress;
          const shift = (p - 0.5) * 80 * speed;
          const sway  = Math.sin(p * Math.PI * 2 + i) * 5 * speed;
          card.style.transform = `translateY(${shift}px) translateX(${sway}px) translateZ(${speed * 20}px)`;
        }
      }
    });

    // ENTER
    gsap.fromTo(card,
      { opacity: 0, scale: 0.7, filter: `blur(${i * 2 + 4}px)` },
      {
        opacity: 1, scale: 1, filter: 'blur(0)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card, start: 'top 85%', end: 'top 50%',
          scrub: 1
        }
      }
    );
  });
}

/* ─── 8. MENGAPA MEMILIH — "GALAXY PULLBACK REVEAL" ─── */
function initWhyUsAnim() {
  const sec = $('#why-choose-us');
  if (!sec) return;

  const inner = $('.sec-inner', sec);
  
  // Camera pullback is already handled by galaxy-scroll.js spline
  // We just fade in the text with a majestic reveal
  gsap.fromTo(inner,
    { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
    {
      opacity: 1, scale: 1, filter: 'blur(0)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sec, start: 'top 70%', end: 'top 30%',
        scrub: 1.5
      }
    }
  );
}

/* ─── 9. QUOTE — "SINGULARITY FOCUS" ─── */
function initQuoteAnim() {
  const sec = $('#quote-section');
  if (!sec) return;

  // Use pre-injected elements
  const core = document.createElement('div');
  core.id = 'singularity-core';
  core.style.display = 'block';
  
  const veil = document.createElement('div');
  veil.id = 'singularity-veil';
  veil.style.display = 'block';
  
  document.body.appendChild(veil);
  document.body.appendChild(core);

  const text = $('#singularity-quote', sec);

  // Full-bleed fade to dark
  gsap.to(veil, {
    scrollTrigger: {
      trigger: sec, start: 'top 90%', end: 'bottom 10%',
      scrub: 1,
      onUpdate(self) {
        // Peak darkness in center of section
        const p = self.progress;
        const intensity = Math.sin(p * Math.PI);
        veil.style.opacity = `${intensity}`;
      }
    }
  });

  // Singularity pulse & text reveal
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec, start: 'top 75%', end: 'bottom 25%',
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress;
        const intensity = Math.sin(p * Math.PI);
        
        // Pulse effect
        const pulse = 1 + Math.sin(p * Math.PI * 10) * 0.5 * intensity;
        core.style.transform = `translate(-50%, -50%) scale(${intensity * 3 * pulse})`;
        core.style.opacity = `${intensity}`;
        
        // Text emerge from singularity
        if (text) {
          text.style.opacity = `${intensity}`;
          text.style.transform = `scale(${0.8 + intensity * 0.2})`;
          text.style.filter = `blur(${(1 - intensity) * 10}px)`;
        }
      }
    }
  });
}

/* ─── 10. CONTACT/JOIN — "GRAND FINALE EXPANSION" ─── */
function initContactAnim() {
  const sec = $('#contact');
  if (!sec) return;

  // Create finale bloom overlay
  const bloom = document.createElement('div');
  bloom.id = 'finale-bloom';
  bloom.style.display = 'block';
  document.body.appendChild(bloom);

  // Main content enters elegantly
  const cLeft  = $('.contact-left', sec);
  const cRight = $('.contact-right', sec);

  if (cLeft) {
    gsap.fromTo(cLeft,
      { opacity: 0, x: -60, rotateY: -25 },
      {
        opacity: 1, x: 0, rotateY: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec, start: 'top 70%', end: 'center center',
          scrub: 1.5
        }
      }
    );
  }
  if (cRight) {
    gsap.fromTo(cRight,
      { opacity: 0, x: 60, rotateY: 25 },
      {
        opacity: 1, x: 0, rotateY: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec, start: 'top 70%', end: 'center center',
          scrub: 1.5,
        }
      }
    );
  }

  // GRAND FINALE BLOOM — triggered when reaching bottom of page
  gsap.to({}, {
    scrollTrigger: {
      trigger: sec, start: '60% center', end: 'bottom bottom',
      scrub: 2,
      onUpdate(self) {
        const p = self.progress;
        bloom.style.opacity = `${p * 0.6}`;

        // Also push Three.js bloom
        if (window.bloomPass && !window.S?.lowPerf) {
          bloomPass.strength = 1.0 + p * 3;
        }
      },
      onLeave() {
        // Peak climax flash
        gsap.to(bloom, { opacity: 0.9, duration: 0.3, yoyo: true, repeat: 1 });
        if (window.bloomPass) {
          gsap.to(bloomPass, { strength: 5, duration: 0.3, yoyo: true, repeat: 1 });
        }
      }
    }
  });
}

/* ─── HEADER SCROLL EFFECT ─── */
function initHeaderScroll() {
  const hdr = $('header');
  if (!hdr) return;

  ScrollTrigger.create({
    start: 'top -80',
    end: 'max',
    onUpdate(self) {
      hdr.classList.toggle('scrolled', self.scroll() > 80);
    }
  });
}

/* ─── MASTER INIT ─── */
function init() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('[RNVN-Anim] GSAP or ScrollTrigger not loaded yet, retrying...');
    setTimeout(init, 300);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Give ScrollTrigger the scroller
  ScrollTrigger.defaults({ scroller: window });

  injectCSS();

  // Init per-section animations
  initHeroAnim();
  initAboutAnim();
  initPhilosophyAnim();
  initVisionAnim();
  initMissionAnim();
  initValuesAnim();
  initServicesAnim();
  initWhyUsAnim();
  initQuoteAnim();
  initContactAnim();
  initHeaderScroll();

  // Refresh after all layout is settled
  setTimeout(() => ScrollTrigger.refresh(), 800);

  console.log('[RNVN-Anim] All section signature animations initialized ✦');
}

// Bootstrap — wait for DOM + other scripts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 800));
} else {
  setTimeout(init, 800);
}

})();
