/* =========================================================
   SPIDER-MAN FX — Interactive Web + Cinematic 3D Effects
   ========================================================= */
(function () {
  'use strict';
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* -------------------------------------------------------
     1. INTERACTIVE SPIDER WEB CANVAS
  ------------------------------------------------------- */
  function initSpiderWeb() {
    const canvas = document.createElement('canvas');
    canvas.id = 'spiderWebCanvas';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const COUNT = isTouch ? 35 : 70;
    const DIST  = isTouch ? 120 : 170;
    const mouse = { x: W / 2, y: H / 2, active: false };
    let nodes = [];
    let t = 0;

    function makeNode() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.8,
        phase: Math.random() * Math.PI * 2
      };
    }

    function reset() { nodes = Array.from({ length: COUNT }, makeNode); }
    reset();

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, { passive: true });

    if (!isTouch) {
      window.addEventListener('mousemove', e => {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      }, { passive: true });
      window.addEventListener('mouseleave', () => { mouse.active = false; });
    }

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      t += 0.006;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        // Mouse soft attraction
        if (mouse.active) {
          const dx = mouse.x - a.x, dy = mouse.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 240) { a.x += dx * 0.003; a.y += dy * 0.003; }
        }

        // Glowing node
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.5 + a.phase);
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 4);
        grad.addColorStop(0, 'rgba(193,18,31,' + (0.9 * pulse) + ')');
        grad.addColorStop(1, 'rgba(193,18,31,0)');
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,80,80,' + (0.7 + 0.3 * pulse) + ')';
        ctx.fill();

        // Web threads between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const alpha = (1 - d / DIST) * 0.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const cx = (a.x + b.x) / 2 + Math.sin(t + i) * 12;
            const cy = (a.y + b.y) / 2 + Math.cos(t + j) * 12;
            ctx.quadraticCurveTo(cx, cy, b.x, b.y);
            ctx.strokeStyle = 'rgba(193,18,31,' + alpha + ')';
            ctx.lineWidth = (1 - d / DIST) * 1.0;
            ctx.stroke();
          }
        }

        // Bright thread to mouse cursor
        if (mouse.active) {
          const dx = mouse.x - a.x, dy = mouse.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(230,57,70,' + (1 - d / 180) * 0.6 + ')';
            ctx.lineWidth = (1 - d / 180) * 1.5;
            ctx.stroke();
          }
        }
      }

      // Glowing aura at mouse
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 22);
        g.addColorStop(0, 'rgba(193,18,31,0.7)');
        g.addColorStop(1, 'rgba(193,18,31,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }
    draw();
  }

  /* -------------------------------------------------------
     2. FLOATING AMBIENT RED ORBS
  ------------------------------------------------------- */
  function initFloatingOrbs() {
    const defs = [
      { s: 350, x: '-8%',  y: '5%',   dur: '13s', dl: '0s',   op: 0.07 },
      { s: 250, x: '82%',  y: '55%',  dur: '17s', dl: '-5s',  op: 0.05 },
      { s: 180, x: '38%',  y: '78%',  dur: '11s', dl: '-2s',  op: 0.08 },
      { s: 420, x: '65%',  y: '-8%',  dur: '21s', dl: '-9s',  op: 0.04 },
      { s: 120, x: '15%',  y: '45%',  dur: '9s',  dl: '-3s',  op: 0.06 },
    ];
    defs.forEach((o, i) => {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:fixed',
        'width:' + o.s + 'px', 'height:' + o.s + 'px',
        'left:' + o.x, 'top:' + o.y,
        'border-radius:50%',
        'background:radial-gradient(circle,rgba(193,18,31,' + o.op + ') 0%,transparent 70%)',
        'pointer-events:none', 'z-index:1',
        'animation:spOrb' + i + ' ' + o.dur + ' ease-in-out infinite alternate',
        'animation-delay:' + o.dl,
        'will-change:transform'
      ].join(';');
      document.body.appendChild(el);

      const r1x = (Math.random() - 0.5) * 40, r1y = (Math.random() - 0.5) * 30;
      const r2x = (Math.random() - 0.5) * 40, r2y = (Math.random() - 0.5) * 30;
      const s = document.createElement('style');
      s.textContent = '@keyframes spOrb' + i + '{0%{transform:translate(0,0) scale(1)}' +
        '50%{transform:translate(' + r1x + 'px,' + r1y + 'px) scale(1.08)}' +
        '100%{transform:translate(' + r2x + 'px,' + r2y + 'px) scale(0.95)}}';
      document.head.appendChild(s);
    });
  }

  /* -------------------------------------------------------
     3. MARQUEE TICKER BAND
  ------------------------------------------------------- */
  function initMarquee() {
    // Thin marquee removed to achieve a more minimalist aesthetic without overlapping.
  }

  /* -------------------------------------------------------
     4. GSAP CLIP-PATH & 3D SECTION REVEALS
  ------------------------------------------------------- */
  function initAdvancedReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // About title — 3D rotate-Y flip
    gsap.fromTo('#about .sec-title',
      { rotateY: -60, opacity: 0, transformPerspective: 800, x: -40 },
      { rotateY: 0, opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 78%' } });

    // Skills tag — clip-path wipe left→right
    gsap.fromTo('#skills .sec-tag',
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#skills', start: 'top 80%' } });

    // Skills title — blur + scale zoom-out reveal
    gsap.fromTo('#skills .sec-title',
      { filter: 'blur(16px)', scale: 1.12, opacity: 0 },
      { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: '#skills', start: 'top 75%' } });

    // Portfolio title — skew + slide
    gsap.fromTo('#portfolio .sec-title',
      { skewX: -12, opacity: 0, x: -60 },
      { skewX: 0, opacity: 1, x: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '#portfolio', start: 'top 80%' } });

    // Contact — rotateX flip from bottom
    gsap.fromTo('#contact .sec-title',
      { rotateX: 45, opacity: 0, y: 60, transformPerspective: 600 },
      { rotateX: 0, opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#contact', start: 'top 78%' } });

    // Skill card stagger — scale + rotate subtle
    gsap.fromTo('.skill-card',
      { y: 80, opacity: 0, rotateZ: -3, scale: 0.9 },
      { y: 0, opacity: 1, rotateZ: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '#skills .skills-grid', start: 'top 85%' } });

    // Tech tags pop
    gsap.fromTo('.tech-tags span',
      { scale: 0, opacity: 0, rotateZ: -10 },
      { scale: 1, opacity: 1, rotateZ: 0, duration: 0.35, stagger: 0.05, ease: 'back.out(2)',
        scrollTrigger: { trigger: '.tech-grid', start: 'top 88%' } });

    // Portfolio card stagger — slide up + fade
    gsap.fromTo('.portfolio-card',
      { y: 100, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out',
        scrollTrigger: { trigger: '#portfolio .portfolio-grid', start: 'top 85%' } });

    // Contact info items — slide right one by one
    gsap.fromTo('.cinfo',
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-info', start: 'top 85%' } });

    // Contact form — slide left
    gsap.fromTo('.contact-form',
      { x: 80, opacity: 0, scale: 0.96 },
      { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' } });

    // About stats — bounce up
    gsap.fromTo('.astat',
      { y: 50, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)',
        scrollTrigger: { trigger: '.about-stats', start: 'top 88%' } });

    // Hero parallax for 3D canvas
    gsap.to('#cityCanvas',
      { yPercent: 40, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }

  /* -------------------------------------------------------
     5. RED LIGHT SWEEP ON SECTION ENTER
  ------------------------------------------------------- */
  function initLightSweep() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('#about, #skills, #portfolio, #contact').forEach(sec => {
      const sweep = document.createElement('div');
      sweep.style.cssText = 'position:absolute;top:0;left:-80%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(193,18,31,0.05),transparent);pointer-events:none;z-index:5;';
      if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      sec.appendChild(sweep);
      ScrollTrigger.create({
        trigger: sec, start: 'top 72%', once: true,
        onEnter: () => gsap.to(sweep, { left: '150%', duration: 1.8, ease: 'power2.inOut' })
      });
    });
  }

  /* -------------------------------------------------------
     6. SPIDER-SENSE PULSE on hover (cards only, desktop)
  ------------------------------------------------------- */
  function initSpiderSensePulse() {
    if (isTouch) return;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spiderPulse {
        0%   { box-shadow: 0 0 0 0 rgba(193,18,31,0.4); }
        70%  { box-shadow: 0 0 0 20px rgba(193,18,31,0); }
        100% { box-shadow: 0 0 0 0 rgba(193,18,31,0); }
      }
      .portfolio-card:hover { animation: spiderPulse 0.8s ease-out; }
    `;
    document.head.appendChild(style);
  }

  /* -------------------------------------------------------
     INIT — wait for preloader to finish
  ------------------------------------------------------- */
  function run() {
    initSpiderWeb();
    initFloatingOrbs();
    initMarquee();
    initSpiderSensePulse();
    setTimeout(() => {
      initAdvancedReveals();
      initLightSweep();
    }, 600);
  }

  const checkReady = setInterval(() => {
    if (!document.body.classList.contains('loading')) {
      clearInterval(checkReady);
      run();
    }
  }, 200);

  // Fallback: if loading class never removed
  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(checkReady);
      if (!document.getElementById('spiderWebCanvas')) run();
    }, 2500);
  });
})();
