/**
 * GALAXY SCROLL ENGINE v1
 * Scroll-driven cinematic 3D camera path
 * Uses Catmull-Rom spline interpolation for smooth fly-through
 */

(function() {
'use strict';

/* ─── SECTION DEFINITIONS ─── */
const SECTIONS = [
  { id: 'hero',           label: 'Home',        sector: 'X-01' },
  { id: 'about',          label: 'Nation',       sector: 'N-07' },
  { id: 'philosophy',     label: 'Philosophy',   sector: 'P-12' },
  { id: 'vision-mission', label: 'Direction',    sector: 'D-22' },
  { id: 'skills',         label: 'Values',       sector: 'V-33' },
  { id: 'portfolio',      label: 'Services',     sector: 'S-44' },
  { id: 'why-choose-us',  label: 'Why Us',       sector: 'W-77' },
  { id: 'quote-section',  label: 'Quote',        sector: 'Q-88' },
  { id: 'contact',        label: 'Join',         sector: 'J-99' },
];

/* ─── CAMERA WAYPOINTS (Catmull-Rom control points) ─── */
// Each: [x, y, z, lookAtX, lookAtY, lookAtZ]
const CAM_WAYPOINTS = [
  [   0, 150, 400,    0,   0,   0 ],  // Hero: far view of full galaxy
  [  80,  40, 220,    0,  20,   0 ],  // About: orbit main identity planet
  [-120,  10, 150,    0,   0,  60 ],  // Philosophy: inside orbital system
  [  60,  80,  80,    0,  20,   0 ],  // Vision-Mission: sweeping orbit path
  [ -80, -30,  50,    0,   0,   0 ],  // Values: circling the 5-planet cluster
  [   0, 200,  50,    0,   0,   0 ],  // Services: floating between planets
  [   0, 300, 600,    0,   0,   0 ],  // Why Us: pullback to show all planets (pullback reveal)
  [   0,  10,   5,    0,   0,   0 ],  // Quote: zoom deep into singularity
  [  50, -20, 120,    0,   0,   0 ],  // Contact: signal transmission point
];

/* ─── CATMULL-ROM SPLINE ─── */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2*p0 - 5*p1 + 4*p2 - p3) * t2 +
    (-p0 + 3*p1 - 3*p2 + p3) * t3
  );
}

function sampleSpline(waypoints, t) {
  const n = waypoints.length;
  // Clamp
  if (t <= 0) return [...waypoints[0]];
  if (t >= 1) return [...waypoints[n-1]];

  const scaledT = t * (n - 1);
  const idx = Math.floor(scaledT);
  const localT = scaledT - idx;

  const i0 = Math.max(0, idx - 1);
  const i1 = idx;
  const i2 = Math.min(n - 1, idx + 1);
  const i3 = Math.min(n - 1, idx + 2);

  const result = [];
  for (let j = 0; j < waypoints[0].length; j++) {
    result.push(catmullRom(
      waypoints[i0][j], waypoints[i1][j],
      waypoints[i2][j], waypoints[i3][j],
      localT
    ));
  }
  return result;
}

/* ─── PRECOMPUTED SPLINE CACHE ─── */
const SPLINE_RES = 1000;
const splineCache = [];
for (let i = 0; i <= SPLINE_RES; i++) {
  splineCache.push(sampleSpline(CAM_WAYPOINTS, i / SPLINE_RES));
}

function getCameraAtProgress(t) {
  const idx = Math.min(SPLINE_RES, Math.round(t * SPLINE_RES));
  return splineCache[idx];
}

/* ─── STATE ─── */
let scrollY = 0;
let targetScrollProg = 0;
let smoothScrollProg = 0;
let activeSection = 0;
let lastScrollTime = 0;
let scrollVelocity = 0;
let prevScrollY = 0;
let breathPhase = 0;
const LERP_STRENGTH = 0.05;  // Lower = smoother but slower
const MOBILE_LERP = 0.04;
let isMobile = window.innerWidth <= 768;

/* ─── DOT NAVIGATION ─── */
let dotNav = null;

function buildDotNav() {
  // Remove existing if any
  const existing = document.getElementById('scrollDotNav');
  if (existing) existing.remove();

  dotNav = document.createElement('nav');
  dotNav.id = 'scrollDotNav';
  dotNav.setAttribute('aria-label', 'Section navigation');
  dotNav.innerHTML = SECTIONS.map((sec, i) => `
    <button class="scroll-dot${i === 0 ? ' active' : ''}" 
            data-idx="${i}" 
            data-id="${sec.id}"
            title="${sec.label}"
            aria-label="Go to ${sec.label}">
      <span class="dot-inner"></span>
      <span class="dot-label">${sec.label}</span>
    </button>
  `).join('');

  document.body.appendChild(dotNav);

  // Click to jump to section
  dotNav.querySelectorAll('.scroll-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      scrollToSection(idx);
    });
  });
}

function updateDotNav(sectionIdx) {
  if (!dotNav) return;
  dotNav.querySelectorAll('.scroll-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === sectionIdx);
  });
}

/* ─── SCROLL TO SECTION (smooth camera travel) ─── */
function scrollToSection(idx) {
  const pageH = document.documentElement.scrollHeight - window.innerHeight;
  const sectionH = pageH / (SECTIONS.length - 1);
  const targetY = idx * sectionH;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

/* ─── SECTION REVEAL LOGIC ─── */
const revealedSections = new Set();

function revealSection(idx) {
  const sec = document.getElementById(SECTIONS[idx].id);
  if (!sec || revealedSections.has(idx)) return;
  revealedSections.add(idx);
  sec.classList.add('scroll-active');

  const revEls = sec.querySelectorAll('.reveal');
  revEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), 80 + i * 90);
  });
}

function unrevealSection(idx) {
  const sec = document.getElementById(SECTIONS[idx].id);
  if (!sec) return;
  revealedSections.delete(idx);
  sec.classList.remove('scroll-active');
  sec.querySelectorAll('.reveal').forEach(el => el.classList.remove('active'));
}

/* ─── HUD UPDATE ─── */
function updateHUD(prog, idx) {
  const sec = SECTIONS[idx];
  const hudSector = document.getElementById('hudSector');
  const hudDepth  = document.getElementById('hudDepth');
  if (hudSector) hudSector.innerText = `SECTOR: ${sec.sector}`;
  if (hudDepth)  hudDepth.innerText  = `DEPTH: ${(prog * 99.9).toFixed(1)} LY`;

  // Scroll fill bar
  const fill = document.getElementById('scrollFill');
  if (fill) fill.style.width = (prog * 100) + '%';
}

/* ─── MAIN SCROLL HANDLER ─── */
let rafId = null;

function onScroll() {
  const now = performance.now();
  const rawScrollY = window.scrollY;
  scrollVelocity = rawScrollY - prevScrollY;
  prevScrollY = rawScrollY;
  lastScrollTime = now;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetScrollProg = maxScroll > 0 ? Math.max(0, Math.min(1, rawScrollY / maxScroll)) : 0;
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── ANIMATION TICK ─── */
function tick() {
  rafId = requestAnimationFrame(tick);

  const lerpStr = isMobile ? MOBILE_LERP : LERP_STRENGTH;
  smoothScrollProg += (targetScrollProg - smoothScrollProg) * lerpStr;

  // Camera breathing (idle sway)
  breathPhase += 0.008;
  const breathX = Math.sin(breathPhase) * 3;
  const breathY = Math.cos(breathPhase * 0.7) * 2;

  // Get camera position from spline
  const cam = getCameraAtProgress(smoothScrollProg);
  const [cx, cy, cz, lx, ly, lz] = cam;

  // Apply to galaxy engine (if available)
  if (window.S && window.S.baseCam) {
    S.baseCam.x = cx + breathX;
    S.baseCam.y = cy + breathY;
    S.baseCam.z = cz;
  }

  // Update camera lookAt (if camera exists globally)
  if (window.camera) {
    // Let engine handle lookAt via its lerp loop
    // We just steer the target
  }

  // Determine active section based on scroll progress
  const newSection = Math.min(
    SECTIONS.length - 1,
    Math.round(smoothScrollProg * (SECTIONS.length - 1))
  );

  if (newSection !== activeSection) {
    // Fade out old section content
    const oldEl = document.getElementById(SECTIONS[activeSection].id);
    if (oldEl) {
      oldEl.style.transition = 'opacity 0.4s ease';
      oldEl.style.opacity = '0.0';
      setTimeout(() => {
        if (oldEl) oldEl.style.opacity = '';
        unrevealSection(activeSection);
      }, 400);
    }
    activeSection = newSection;
    updateDotNav(newSection);
  }

  // Reveal active section
  revealSection(activeSection);

  // Reveal adjacent (pre-load)
  if (activeSection + 1 < SECTIONS.length) {
    const nextEl = document.getElementById(SECTIONS[activeSection + 1].id);
    if (nextEl) nextEl.classList.add('scroll-visible');
  }

  // Motion blur / time-distortion on fast scroll
  const absVelocity = Math.abs(scrollVelocity);
  if (window.bloomPass && !window.S?.lowPerf) {
    const targetBloom = 1.0 + Math.min(absVelocity * 0.08, 2.0);
    bloomPass.strength += (targetBloom - bloomPass.strength) * 0.15;
  }

  updateHUD(smoothScrollProg, activeSection);
}

/* ─── NAVBAR ANCHOR LINKS: intercept for smooth scroll ─── */
function initNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').replace('#', '');
      const idx = SECTIONS.findIndex(s => s.id === id);

      // Close mobile menu if open
      const mt = document.getElementById('menuToggle');
      const mn = document.getElementById('mainNav');
      const hdr = document.getElementById('header');
      if (mt && mt.classList.contains('open')) {
        mt.classList.remove('open');
        if (mn) mn.classList.remove('open');
        if (hdr) hdr.classList.remove('menu-open');
        document.body.style.overflow = '';
      }

      if (idx !== -1) {
        e.preventDefault();
        scrollToSection(idx);
      }
      // If not a section link (e.g. external), let it pass
    });
  });
}

/* ─── BACK TO TOP ─── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── RESIZE HANDLER ─── */
window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 768;
});

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const mt = document.getElementById('menuToggle');
  const mn = document.getElementById('mainNav');
  const hdr = document.getElementById('header');
  if (!mt) return;
  mt.addEventListener('click', () => {
    const isOpen = mt.classList.toggle('open');
    if (mn) mn.classList.toggle('open');
    if (hdr) hdr.classList.toggle('menu-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('fname')?.value || '';
    const m = document.getElementById('fmsg')?.value || '';
    window.open(`https://wa.me/628563122123?text=${encodeURIComponent('Halo, saya ' + n + '. ' + m)}`, '_blank');
  });
}

/* ─── FILTER TABS ─── */
function initFilterTabs() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ─── AUDIO TOGGLE ─── */
function initAudioToggle() {
  const btn = document.getElementById('audioToggle');
  if (btn && window.toggleAudio) {
    btn.addEventListener('click', toggleAudio);
  }
}

/* ─── BOOTSTRAP ─── */
function init() {
  // Build dot nav
  buildDotNav();

  // Start tick loop
  tick();

  // Intercept nav links
  initNavLinks();
  initBackToTop();
  initMobileMenu();
  initContactForm();
  initFilterTabs();
  initAudioToggle();

  // Show hero on init
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    heroEl.classList.add('scroll-active');
    heroEl.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('active'), 200 + i * 100);
    });
    revealedSections.add(0);
  }

  // Animate counters in hero
  document.querySelectorAll('.m-num[data-target]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const t = +el.getAttribute('data-target');
    let c = 0;
    const upd = () => {
      c += t / 40;
      if (c < t) { el.innerText = Math.ceil(c); requestAnimationFrame(upd); }
      else el.innerText = t;
    };
    setTimeout(upd, 600);
  });

  console.log('[RNVN] Scroll-driven galaxy journey initialized ✦');
}

// Wait for engine to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
} else {
  setTimeout(init, 500);
}

// Expose for debugging
window.scrollToSection = scrollToSection;
window.RNVN_SCROLL = { getCameraAtProgress, SECTIONS, scrollToSection };

})();
