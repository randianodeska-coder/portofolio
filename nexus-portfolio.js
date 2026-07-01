/* SPIDER-MAN PREMIUM THEME JAVASCRIPT */
gsap.registerPlugin(ScrollTrigger);
const $ = id => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* --- PRELOADER --- */
(() => {
  const pre = $('preloader'), fill = $('preFill'), status = $('preStatus');
  if (!pre) return;
  const msgs = ['INITIALIZING SPIDER-SENSE...', 'CALIBRATING WEB-SHOOTERS...', 'CONNECTING TO STARK NETWORK...', 'SUIT POWER 100%'];
  let pct = 0, mi = 0;
  
  const pctText = document.getElementById('prePercent') || document.createElement('div');
  pctText.style.cssText = "font-family: var(--font-head); font-size: 3rem; font-weight: 900; color: var(--red); text-shadow: 0 0 20px var(--red); margin-bottom: 20px;";
  pctText.textContent = "00%";
  // if (fill) fill.parentNode.parentNode.insertBefore(pctText, fill.parentNode);

  const iv = setInterval(() => {
    pct = Math.min(pct + rand(2, 6), 100);
    const intPct = Math.floor(pct);
    if (fill) fill.style.width = intPct + '%';
    pctText.textContent = (intPct < 10 ? '0' : '') + intPct + '%';
    
    if (pct > (mi + 1) * 25 && mi < msgs.length - 1) {
      mi++;
      if (status) status.textContent = msgs[mi];
    }
    
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        gsap.to('.pre-inner', { opacity: 0, scale: 1.1, duration: 0.6, ease: 'power3.inOut' });
        gsap.to('#preloader', {
          yPercent: -100,
          duration: 1.2,
          delay: 0.4,
          ease: 'power4.inOut',
          onComplete: () => {
            pre.style.display = 'none';
            document.body.classList.remove('loading');
            initAll();
            // Trigger Hero reveal
            const titleLine = document.querySelector('.hero-title');
            if (titleLine) titleLine.classList.add('loaded');
          }
        });
      }, 500);
    }
  }, 40);
})();

/* --- INITIALIZATION --- */
function initAll() {
  initCursor();
  initClock();
  initNav();
  initScrollProgress();
  initReveal();
  initCity3D();
  initCounters();
  initFilter();
  initModal();
  initForm();
  initBackToTop();
  initGsap();
  initSoundDesign();
  initImmersivePortfolio();
  initTestiSlider();
  initLenis();
  initScrambleText();
  initIKSpider();
  initEmbers();
  initSymbioteTrail();
  initMassive3D();
  initGlobalParallax();
  if (!isTouch) {
    initMagneticButtons();
    init3DCards();
  }
}

/* --- CUSTOM SPIDER CURSOR --- */
function initCursor() {
  if (isTouch) return;
  const dot = document.createElement('div');
  dot.className = 'cyber-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cyber-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth follow for the ring
  const render = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  document.querySelectorAll('a, button, .portfolio-card, .skill-card, .dock-item, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
}

/* --- CLOCK --- */
function initClock() {
  const el = $('sysTime');
  const tick = () => { if (el) el.textContent = new Date().toLocaleTimeString('id-ID') + ' WIB'; };
  tick(); setInterval(tick, 1000);
}

/* --- NAVIGATION --- */
function initNav() {
  const header = $('header'), toggle = $('menuToggle'), nav = document.querySelector('.desktop-nav');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    }));
  }
}

/* --- SCROLL PROGRESS --- */
function initScrollProgress() {
  const fill = $('scrollFill');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    if (fill) fill.style.width = (window.scrollY / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });
}

/* --- REVEAL SCROLL ANIMATIONS --- */
function initReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  // Distribute reveal classes
  document.querySelectorAll('.section h2').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.sec-body').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.skill-card').forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; });
  document.querySelectorAll('.portfolio-card').forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; });
  document.querySelectorAll('.tech-cat').forEach((el, i) => { el.classList.add('reveal-scale'); el.style.transitionDelay = `${i * 0.1}s`; });
  document.querySelectorAll('.astat').forEach((el, i) => { el.classList.add('reveal-scale'); el.style.transitionDelay = `${i * 0.1}s`; });
  
  const lefts = document.querySelectorAll('.about-left, .contact-left');
  lefts.forEach(el => el.classList.add('reveal-left'));
  const rights = document.querySelectorAll('.about-right, .contact-right');
  rights.forEach(el => el.classList.add('reveal-right'));

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));
}

/* --- BACK TO TOP --- */
function initBackToTop() {
  const btn = $('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 600), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --- NUMBER COUNTERS --- */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        const dur = 2000, start = performance.now();
        const step = now => {
          const p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 4);
          el.textContent = Number.isInteger(target) ? Math.floor(ease * target) : (ease * target).toFixed(1);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.m-num').forEach(el => obs.observe(el));
}

/* --- 3D SPIDER WEB & PARTICLES (THREE.JS) --- */
function initCity3D() {
  const canvas = $('cityCanvas');
  if (!canvas || typeof THREE === 'undefined') return;
  
  const W = window.innerWidth, H = window.innerHeight;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.008);
  
  const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
  camera.position.set(0, 0, 100);
  
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Custom Spark Texture for realistic particles
  const createSparkTexture = () => {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.1, 'rgba(255, 200, 200, 0.8)');
    grad.addColorStop(0.4, 'rgba(193, 18, 31, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  };
  
  // Procedural Spider Web (Realistic & Interactive)
  const webMaterial = new THREE.LineBasicMaterial({ 
    color: 0xC1121F, 
    transparent: true, 
    opacity: 0.25,
    blending: THREE.AdditiveBlending 
  });
  const webGeometry = new THREE.BufferGeometry();
  const webPoints = [];
  const originalWebPoints = [];
  
  const rings = 12;
  const segments = 24;
  for (let r = 1; r <= rings; r++) {
    const radius = Math.pow(r, 1.2) * 6; // Non-linear spacing for realism
    for (let s = 0; s < segments; s++) {
      const angle1 = (s / segments) * Math.PI * 2 + (r % 2 === 0 ? 0.1 : 0);
      const angle2 = ((s + 1) / segments) * Math.PI * 2 + (r % 2 === 0 ? 0.1 : 0);
      const zOffset1 = Math.sin(r * 0.5 + s) * 8;
      const zOffset2 = Math.sin(r * 0.5 + s + 1) * 8;
      
      const p1 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, zOffset1);
      const p2 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, zOffset2);
      
      webPoints.push(p1, p2);
      originalWebPoints.push(p1.clone(), p2.clone());
      
      if (r < rings) {
        const nextRadius = Math.pow(r + 1, 1.2) * 6;
        const p3 = new THREE.Vector3(Math.cos(angle1) * nextRadius, Math.sin(angle1) * nextRadius, Math.sin((r+1)*0.5 + s)*8);
        webPoints.push(p1, p3);
        originalWebPoints.push(p1.clone(), p3.clone());
      }
    }
  }
  webGeometry.setFromPoints(webPoints);
  const web = new THREE.LineSegments(webGeometry, webMaterial);
  scene.add(web);

  // Floating Embers/Dust Physics
  const pCount = 1500;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pVel = [];
  for (let i = 0; i < pCount; i++) {
    pPos[i*3] = rand(-200, 200);
    pPos[i*3+1] = rand(-200, 200);
    pPos[i*3+2] = rand(-100, 150);
    pVel.push({
      x: rand(-0.1, 0.1),
      y: rand(0.1, 0.4), // Float upwards like embers
      z: rand(-0.1, 0.1)
    });
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  
  const pMat = new THREE.PointsMaterial({ 
    color: 0xff4444, 
    size: 2.5, 
    map: createSparkTexture(),
    transparent: true, 
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending 
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Volumetric Cinematic Lighting
  const ambientLight = new THREE.AmbientLight(0x0a0f1a, 2.5);
  scene.add(ambientLight);
  
  const redLight = new THREE.PointLight(0xC1121F, 4, 300);
  scene.add(redLight);
  
  const blueLight = new THREE.PointLight(0x00B4D8, 1.5, 250);
  blueLight.position.set(-80, -80, 50);
  scene.add(blueLight);

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  
  if (!isTouch) {
    window.addEventListener('mousemove', e => {
      targetX = (e.clientX / W - 0.5) * 2;
      targetY = -(e.clientY / H - 0.5) * 2;
    }, { passive: true });
  }

  // Scroll Parallax via GSAP
  let scrollData = { progress: 0 };
  gsap.to(scrollData, {
    progress: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  const clock = new THREE.Clock();
  const heroImage = document.getElementById('heroImage3D');

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const time = clock.getElapsedTime();

    // Smooth mouse follow
    mouseX += (targetX - mouseX) * 5 * dt;
    mouseY += (targetY - mouseY) * 5 * dt;

    // Cinematic Camera Movement
    camera.position.x = Math.sin(time * 0.1) * 5 + mouseX * 25;
    camera.position.y = Math.cos(time * 0.15) * 5 + mouseY * 25;
    camera.position.z = 100 - (scrollData.progress * 60); // Fly deeper into the web
    camera.lookAt(0, 0, 0);

    // Interactive Web Physics
    const positions = web.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const origX = originalWebPoints[i/3].x;
      const origY = originalWebPoints[i/3].y;
      const origZ = originalWebPoints[i/3].z;
      
      // Calculate distance to mouse (projected to approx Z plane)
      const dx = origX - (mouseX * 120);
      const dy = origY - (mouseY * 120);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 40) {
        const force = (40 - dist) / 40;
        positions[i] += (origX + (dx / dist) * force * 10 - positions[i]) * 0.1;
        positions[i+1] += (origY + (dy / dist) * force * 10 - positions[i+1]) * 0.1;
      } else {
        positions[i] += (origX - positions[i]) * 0.05;
        positions[i+1] += (origY - positions[i+1]) * 0.05;
      }
      
      // Subtle breathing motion
      positions[i+2] = origZ + Math.sin(time * 1.5 + origX) * 2;
    }
    web.geometry.attributes.position.needsUpdate = true;
    web.rotation.z = time * 0.02;

    // Embers/Sparks Physics
    const pPosArr = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      pPosArr[i*3] += pVel[i].x + Math.sin(time + i) * 0.03;
      pPosArr[i*3+1] += pVel[i].y;
      pPosArr[i*3+2] += pVel[i].z + Math.cos(time + i) * 0.03;
      
      // Reset particle if it floats too high
      if (pPosArr[i*3+1] > 200) {
        pPosArr[i*3+1] = -200;
        pPosArr[i*3] = rand(-200, 200);
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    // Dynamic Cinematic Lighting
    redLight.position.set(mouseX * 80, mouseY * 80, camera.position.z - 30);
    redLight.intensity = 4 + Math.sin(time * 8) * 0.5; // Flicker effect like real fire/sparks

    // 3D Image Parallax & Symbiote Pulse
    if (heroImage) {
      const tiltX = mouseY * 15; 
      const tiltY = -mouseX * 15; 
      const moveX = -mouseX * 20; 
      const moveY = -mouseY * 20; 
      const pulse = 1.1 + Math.sin(time * 2) * 0.02; // Breathing scale
      heroImage.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${pulse})`;
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* --- FILTER --- */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  function showCard(card) {
    card.style.display    = 'block';
    card.style.visibility = 'visible';  // fix autoAlpha hidden
    card.style.opacity    = '0';
    gsap.fromTo(card,
      { opacity: 0, scale: 0.88, visibility: 'visible' },
      { opacity: 1, scale: 1, visibility: 'visible', duration: 0.45, ease: 'back.out(1.4)' }
    );
  }

  function hideCard(card) {
    gsap.to(card, {
      opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in',
      onComplete: () => { card.style.display = 'none'; }
    });
  }

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      show ? showCard(card) : hideCard(card);
    });
  }));

  // Ensure all cards visible initially (fix autoAlpha hidden state)
  cards.forEach(card => {
    card.style.visibility = 'visible';
    card.style.opacity    = '1';
  });
}

/* --- MODAL --- */
const projects = {
  vault: {
    title: "RNVN WEB",
    desc: "Layanan RNVN Web Developer. Desain website modern, clean, dan premium dengan tampilan yang elegan dan user friendly. Membangun toko online modern, landing page cinematic, hingga portfolio kelas dunia.",
    imgSrc: "web.png", link: "https://randianodeskaputra.netlify.app"
  },
  rnvn: {
    title: "RNVN STREETWEAR",
    desc: "Brand identity streetwear yang dibangun di atas controlled aggression. Di mana silence berbicara lebih keras dari noise. Visual identity fuses brutalist grid systems with editorial typography.",
    imgSrc: "rnvnwear.png", link: "https://rnvn-brand.vercel.app"
  },
  nexus: {
    title: "RNVN PRINTING",
    desc: "Layanan percetakan modern dengan kualitas premium untuk kebutuhan personal, bisnis, dan brand kreatif. Dari cetak undangan, banner, hingga merchandise eksklusif.",
    imgSrc: "rnvn printing.png", link: "https://rnvn-printing.vercel.app/"
  },
  aiautomation: {
    title: "RNVN AI AUTOMATION",
    desc: "Platform otomasi bisnis berbasis AI yang dirancang untuk membantu bisnis, brand, dan individu mengotomatiskan alur kerja secara cerdas dan efisien.",
    imgSrc: "rnvnaiautomation.png", link: "https://aiautomation-teal.vercel.app/"
  }
};

function initModal() {
  const modal = $('projectModal'), img = $('modalImage'), title = $('modalTitle'), desc = $('modalDesc'), link = $('modalLink'), close = document.querySelector('.close-modal');
  if (!modal) return;
  let savedY = 0;
  
  const open = id => {
    const d = projects[id]; if (!d) return;
    img.src = d.imgSrc; title.textContent = d.title; desc.textContent = d.desc; link.href = d.link;
    modal.classList.add('active');
    savedY = window.scrollY; document.body.style.top = `-${savedY}px`;
    document.body.classList.add('loading');
    
    // Animate Modal Content
    gsap.fromTo('.modal-content', 
      { y: 100, scale: 0.9, opacity: 0, rotateX: 20 }, 
      { y: 0, scale: 1, opacity: 1, rotateX: 0, duration: 0.6, ease: 'power3.out', transformPerspective: 1000 }
    );
  };
  
  const closeM = () => {
    gsap.to('.modal-content', { 
      y: 50, scale: 0.95, opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.classList.remove('loading');
        document.body.style.top = '';
        window.scrollTo(0, savedY);
      }
    });
  };
  
  document.querySelectorAll('.portfolio-card').forEach(c => c.addEventListener('click', () => open(c.dataset.project)));
  if (close) close.addEventListener('click', closeM);
  modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeM(); });
}

/* --- CONTACT FORM --- */
function initForm() {
  const form = $('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('name').value.trim();
    const email = $('email').value.trim();
    const msg = $('message').value.trim();
    if (!name || !email || !msg) return;
    const text = `Halo Randiano! ðŸ‘‹%0ASaya menghubungi via portfolio.%0A%0A*Nama:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Pesan:*%0A${encodeURIComponent(msg)}`;
    window.open(`https://wa.me/628563122123?text=${text}`, '_blank');
    
    const btn = $('submitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'âœ“ TRANSMISSION SENT';
    btn.style.background = '#00FF88'; btn.style.color = '#000';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = ''; btn.style.color = '';
    }, 4000);
  });
}

/* --- UI SOUND DESIGN --- */
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playHoverSound() {
  try {
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05); 
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch(e) {}
}

function initSoundDesign() {
  if(isTouch) return; // Disable on mobile to prevent audio spam
  document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .social-icon, .dock-item, .nav-links a').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
  });
}

/* --- GSAP ANIMATIONS --- */
function initGsap() {
  if (typeof gsap === 'undefined') return;

  // Animate hero text elements individually
  const textLines = document.querySelectorAll('.title-line');
  textLines.forEach(line => {
    const text = line.innerHTML;
    line.innerHTML = `<span class="title-line-inner">${text}</span>`;
  });

  gsap.fromTo('.hero-eyebrow', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });
  gsap.fromTo('.hero-tagline', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 1.2, ease: 'power3.out' });
  gsap.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 1.4, ease: 'power2.out' });
  gsap.fromTo('.hero-actions', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, delay: 1.6, ease: 'back.out(1.5)' });
  gsap.fromTo('.hud-tl, .hud-tr, .hud-bl, .hud-br', { opacity: 0 }, { opacity: 0.6, duration: 2, delay: 1.5 });
  
  // Parallax elements on scroll
  gsap.utils.toArray('.hero-content').forEach(layer => {
    gsap.to(layer, {
      y: 150,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/* --- SCROLL REVEAL & GLITCH --- */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  // Force-show all portfolio/skill cards immediately (prevent visibility:hidden bug)
  document.querySelectorAll('.portfolio-card, .skill-card, .tech-cat, .astat').forEach(el => {
    el.style.visibility = 'visible';
    el.style.opacity    = '1';
  });

  reveals.forEach(el => {
    // Skip cards — they're handled above to avoid GSAP autoAlpha conflict
    if (el.closest('.portfolio-card') || el.closest('.skill-card')) return;

    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          onEnter: () => {
            el.classList.add('active', 'is-glitching');
            setTimeout(() => el.classList.remove('is-glitching'), 500);
          }
        }
      }
    );
  });

  // Staggered reveal for portfolio cards
  const pCards = document.querySelectorAll('.portfolio-card');
  if (pCards.length) {
    gsap.fromTo(pCards,
      { opacity: 0, y: 50, scale: 0.94 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '#portfolioGrid',
          start: 'top 88%',
          toggleActions: 'play none none none',
          onEnter: () => pCards.forEach(c => { c.style.visibility='visible'; c.classList.add('active'); })
        }
      }
    );
  }

  // Staggered reveal for skill cards
  const sCards = document.querySelectorAll('.skill-card');
  if (sCards.length) {
    gsap.fromTo(sCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 88%',
          toggleActions: 'play none none none',
          onEnter: () => sCards.forEach(c => { c.style.visibility='visible'; c.classList.add('active'); })
        }
      }
    );
  }

  // Mobile fallback — force-show all after 2.5s in case ScrollTrigger misses
  if (window.innerWidth < 900) {
    setTimeout(() => {
      document.querySelectorAll('.reveal, .portfolio-card, .skill-card, .tech-cat, .astat').forEach(el => {
        el.style.opacity    = '1';
        el.style.visibility = 'visible';
        el.style.transform  = 'none';
        el.classList.add('active');
      });
    }, 2500);
  }
}

/* --- MAGNETIC BUTTONS --- */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-ghost, .dock-item, .filter-btn, .footer-social a').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

/* --- 3D CARDS TILT --- */
function init3DCards() {
  document.querySelectorAll('.portfolio-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * 10;
      const tiltY = -(x / (rect.width / 2)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

/* --- PROCEDURAL IK CRAWLING SPIDER --- */
function initIKSpider() {
  if (isTouch) return; // Disable on touch devices for performance
  
  const canvas = document.createElement('canvas');
  canvas.id = 'ikSpiderCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none'; // Ensure clicks pass through
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  let mouseX = W / 2, mouseY = H / 2; 
  let isMovingMouse = false;
  
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMovingMouse = true;
  }, { passive: true });

  class Spider {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI / 2;
      this.legs = [];
      this.speed = 5;
      
      const legLengths = [75, 95, 90, 70];
      const legAngles = [-0.8, -0.3, 0.3, 0.8]; 
      
      for (let i = 0; i < 4; i++) {
        this.legs.push(new SpiderLeg(this, legAngles[i], legLengths[i], -1, i)); 
        this.legs.push(new SpiderLeg(this, legAngles[i], legLengths[i], 1, i));  
      }
    }

    update(tx, ty) {
      if (!isMovingMouse) return;

      const dx = tx - this.x;
      const dy = ty - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist > 150) {
        // Chase mouse slowly
        const moveSpeed = Math.min(this.speed, dist * 0.03);
        this.x += (dx / dist) * moveSpeed;
        this.y += (dy / dist) * moveSpeed;
        
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.15;
      } else if (dist < 80) {
        // Flee from mouse if too close
        this.x -= (dx / dist) * this.speed * 1.5;
        this.y -= (dy / dist) * this.speed * 1.5;
        
        const targetAngle = Math.atan2(-dy, -dx);
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.2;
      }
      
      for (const leg of this.legs) leg.update(this.angle);
    }

    draw(ctx) {
      for (const leg of this.legs) leg.draw(ctx);
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      // Shadow
      ctx.beginPath();
      ctx.ellipse(-15, 8, 28, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.filter = 'none';
      
      // Abdomen
      ctx.beginPath();
      ctx.ellipse(-20, 0, 25, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1a1a1a';
      ctx.stroke();
      
      // Venom mark
      ctx.beginPath();
      ctx.moveTo(-25, -6);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-25, 6);
      ctx.lineTo(-32, 0);
      ctx.closePath();
      ctx.fillStyle = '#C1121F';
      ctx.shadowColor = '#C1121F';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0; 
      
      // Cephalothorax
      ctx.beginPath();
      ctx.ellipse(8, 0, 14, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      
      // Glowing Eyes
      ctx.fillStyle = '#ff0000';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(16, -5, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(16, 5, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, -2, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, 2, 1.5, 0, Math.PI*2); ctx.fill();
      
      ctx.restore();
    }
  }

  class SpiderLeg {
    constructor(spider, angle, length, side, index) {
      this.spider = spider;
      this.angle = angle;
      this.length = length;
      this.side = side;
      this.index = index;
      
      this.x = spider.x;
      this.y = spider.y;
      this.tx = this.x;
      this.ty = this.y;
      this.stepProgress = 1;
      this.stepStartX = this.x;
      this.stepStartY = this.y;
    }
    
    update(forwardAngle) {
      const idealX = this.spider.x + Math.cos(forwardAngle + this.angle * this.side) * this.length;
      const idealY = this.spider.y + Math.sin(forwardAngle + this.angle * this.side) * this.length;
      
      const dx = idealX - this.x;
      const dy = idealY - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Alternating tripod gait
      const gaitGroup = (this.index % 2 === 0 && this.side === -1) || (this.index % 2 === 1 && this.side === 1) ? 0 : 1;
      let oppGroupIsStepping = false;
      
      for (const leg of this.spider.legs) {
        const otherGroup = (leg.index % 2 === 0 && leg.side === -1) || (leg.index % 2 === 1 && leg.side === 1) ? 0 : 1;
        if (otherGroup !== gaitGroup && leg.stepProgress < 1) oppGroupIsStepping = true;
      }

      if (this.stepProgress >= 1 && dist > this.length * 0.4 && !oppGroupIsStepping) {
        this.stepProgress = 0;
        this.stepStartX = this.x;
        this.stepStartY = this.y;
        
        const moveDx = Math.cos(forwardAngle) * this.spider.speed * 12;
        const moveDy = Math.sin(forwardAngle) * this.spider.speed * 12;
        
        this.tx = idealX + moveDx;
        this.ty = idealY + moveDy;
      }
      
      if (this.stepProgress < 1) {
        this.stepProgress += 0.18; 
        if (this.stepProgress > 1) this.stepProgress = 1;
        const ease = Math.sin(this.stepProgress * Math.PI / 2);
        this.x = this.stepStartX + (this.tx - this.stepStartX) * ease;
        this.y = this.stepStartY + (this.ty - this.stepStartY) * ease;
      }
    }
    
    draw(ctx) {
      const attachOffsetX = Math.cos(this.spider.angle + Math.PI/2 * this.side) * 8 + Math.cos(this.spider.angle) * 5;
      const attachOffsetY = Math.sin(this.spider.angle + Math.PI/2 * this.side) * 8 + Math.sin(this.spider.angle) * 5;
      
      const startX = this.spider.x + attachOffsetX;
      const startY = this.spider.y + attachOffsetY;
      
      const midX = (startX + this.x) / 2;
      const midY = (startY + this.y) / 2;
      
      const dx = this.x - startX;
      const dy = this.y - startY;
      const angle = Math.atan2(dy, dx);
      
      const kneeDist = this.length * 0.6;
      const kneeOffset = this.side * Math.PI / 4;
      const lift = Math.sin(this.stepProgress * Math.PI) * 35; 
      
      const kneeX = midX + Math.cos(angle - kneeOffset) * kneeDist;
      const kneeY = midY + Math.sin(angle - kneeOffset) * kneeDist - lift;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(kneeX, kneeY+20, this.x, this.y);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 5;
      ctx.filter = 'blur(2px)';
      ctx.stroke();
      ctx.filter = 'none';

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(kneeX, kneeY, this.x, this.y);
      
      const grad = ctx.createLinearGradient(startX, startY, this.x, this.y);
      grad.addColorStop(0, '#111');
      grad.addColorStop(0.5, '#444');
      grad.addColorStop(1, '#050505');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(kneeX, kneeY, 3, 0, Math.PI*2);
      ctx.fillStyle = '#222';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
      ctx.fillStyle = '#C1121F';
      ctx.shadowColor = '#C1121F';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const spider = new Spider(W + 100, H + 100);

  function animate() {
    ctx.clearRect(0, 0, W, H);
    
    // Retreat off-screen if scrolled past Hero
    if (window.scrollY > window.innerHeight * 0.8) {
      spider.update(W + 200, -200);
    } else {
      spider.update(mouseX, mouseY);
    }
    
    ctx.globalAlpha = 0.4; // Make spider semi-transparent to be less intrusive
    spider.draw(ctx);
    ctx.globalAlpha = 1.0;
    
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- IMMERSIVE PORTFOLIO SHOWCASE --- */
function initImmersivePortfolio() {
  if (isTouch) return;
  const immersiveBg = document.getElementById('immersiveBg');
  const cityCanvas = document.getElementById('cityCanvas');
  if (!immersiveBg) return;

  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.card-img img');
      if (img && img.src) {
        immersiveBg.style.backgroundImage = `url(${img.src})`;
        immersiveBg.classList.add('active');
        if(cityCanvas) cityCanvas.style.opacity = '0.05';
      }
    });
    card.addEventListener('mouseleave', () => {
      immersiveBg.classList.remove('active');
      if(cityCanvas) cityCanvas.style.opacity = '1';
    });
  });
}

/* --- DRAGGABLE TESTIMONIAL SLIDER --- */
function initTestiSlider() {
  const slider = document.querySelector('.testi-container');
  if(!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; 
    slider.scrollLeft = scrollLeft - walk;
  });
}

/* --- LENIS SMOOTH SCROLL --- */
function initLenis() {
  if (typeof Lenis === 'undefined' || isTouch) return;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* --- HACKER TEXT SCRAMBLE --- */
function initScrambleText() {
  const chars = '!<>-_\\\\/[]{}—=+*^?#________';
  const elements = document.querySelectorAll('.sec-tag, .hud-label, .card-tag');
  
  elements.forEach(el => {
    const originalText = el.innerText;
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      onEnter: () => scramble(el, originalText)
    });

    if(el.classList.contains('card-tag')) {
      el.addEventListener('mouseenter', () => scramble(el, originalText));
    }
  });

  function scramble(el, text) {
    let iteration = 0;
    clearInterval(el.scrambleInt);
    el.scrambleInt = setInterval(() => {
      el.innerText = text
        .split('')
        .map((letter, index) => {
          if (index < iteration) return text[index];
          if (letter === ' ' || letter === '\n') return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iteration >= text.length) clearInterval(el.scrambleInt);
      iteration += 1 / 3;
    }, 30);
  }
}

