/**
 * PORTFOLIO — 3D ANIMATIONS MODULE
 * - Three.js floating particle network in Hero
 * - CSS 3D Tilt effect on Bento cards
 * - Mouse parallax on Hero elements
 * - Animated number counters
 */

/* =========================================================================
   1. THREE.JS — PARTICLE NETWORK (HERO BACKGROUND)
   ========================================================================= */
(function initThreeScene() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;
    // Skip heavy WebGL on mobile/touch — huge battery & performance gain
    if (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
        canvas.style.display = 'none';
        return;
    }

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.position.z = 5;

    /* ---- Create particle dots ---- */
    const PARTICLE_COUNT = window.innerWidth > 1200 ? 180 : 90;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds    = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 18;  // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;   // z
        speeds.push({
            x: (Math.random() - 0.5) * 0.003,
            y: (Math.random() - 0.5) * 0.003,
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00A3FF,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ---- Create connecting lines between near particles ---- */
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00A3FF,
        transparent: true,
        opacity: 0.12,
    });

    const lineGroup = new THREE.Group();
    scene.add(lineGroup);

    function rebuildLines() {
        // Clear old lines
        while (lineGroup.children.length) {
            lineGroup.remove(lineGroup.children[0]);
        }
        const pos = geometry.attributes.position.array;
        const CONNECT_DIST = 3.5;

        for (let a = 0; a < PARTICLE_COUNT; a++) {
            for (let b = a + 1; b < PARTICLE_COUNT; b++) {
                const dx = pos[a * 3]     - pos[b * 3];
                const dy = pos[a * 3 + 1] - pos[b * 3 + 1];
                const dz = pos[a * 3 + 2] - pos[b * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < CONNECT_DIST) {
                    const lineGeo = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]),
                        new THREE.Vector3(pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]),
                    ]);
                    lineGroup.add(new THREE.Line(lineGeo, lineMat));
                }
            }
        }
    }

    /* ---- Mouse influence ---- */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    /* ---- Animate ---- */
    let frame = 0;
    function animate() {
        requestAnimationFrame(animate);
        frame++;

        const pos = geometry.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3]     += speeds[i].x;
            pos[i * 3 + 1] += speeds[i].y;

            // Wrap around bounds
            if (pos[i * 3]     >  9)  pos[i * 3]     = -9;
            if (pos[i * 3]     < -9)  pos[i * 3]     =  9;
            if (pos[i * 3 + 1] >  5)  pos[i * 3 + 1] = -5;
            if (pos[i * 3 + 1] < -5)  pos[i * 3 + 1] =  5;
        }
        geometry.attributes.position.needsUpdate = true;

        // Rebuild lines every 8 frames (performance balance)
        if (frame % 8 === 0) rebuildLines();

        // Gentle camera drift following mouse
        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    /* ---- Resize handler ---- */
    window.addEventListener('resize', () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
})();


/* =========================================================================
   2. 3D TILT EFFECT — BENTO CARDS
   ========================================================================= */
(function initTilt() {
    // Disable 3D tilt on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    const cards = document.querySelectorAll('.tilt-card');
    const MAX_TILT   = 15;  // degrees
    const SCALE_UP   = 1.03;
    const PERSPECTIVE = '800px';

    cards.forEach(card => {
        card.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease';

        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;   // mouse x within card
            const y      = e.clientY - rect.top;    // mouse y within card
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;

            const rotateY =  ((x - cx) / cx) * MAX_TILT;
            const rotateX = -((y - cy) / cy) * MAX_TILT;

            card.style.transform = `perspective(${PERSPECTIVE}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE_UP}, ${SCALE_UP}, ${SCALE_UP})`;

            // Move the radial glow to follow cursor
            const glow = card.querySelector('.bento-glow');
            if (glow) {
                const xPct = (x / rect.width)  * 100;
                const yPct = (y / rect.height) * 100;
                glow.style.left = xPct + '%';
                glow.style.top  = yPct + '%';
                glow.style.transform = 'translate(-50%, -50%)';
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(${PERSPECTIVE}) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const glow = card.querySelector('.bento-glow');
            if (glow) glow.style.opacity = '0';
        });
    });
})();


/* =========================================================================
   3. HERO PARALLAX — Elements drift slightly on mouse move
   ========================================================================= */
(function initHeroParallax() {
    // Disable parallax on mobile/touch (uses gyro differently, causes jank)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    const cube     = document.querySelector('.cube-3d');
    const orb1     = document.querySelector('.orb-1');
    const orb2     = document.querySelector('.orb-2');
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    document.addEventListener('mousemove', (e) => {
        // Only apply inside hero viewport height
        if (window.scrollY > window.innerHeight) return;

        const xFrac = (e.clientX / window.innerWidth  - 0.5);
        const yFrac = (e.clientY / window.innerHeight - 0.5);

        if (cube) {
            cube.style.transform = `rotateX(${yFrac * 20}deg) rotateY(${xFrac * 20}deg)`;
        }
        if (orb1) {
            orb1.style.transform = `translate(${xFrac * 30}px, ${yFrac * 20}px)`;
        }
        if (orb2) {
            orb2.style.transform = `translate(${-xFrac * 20}px, ${-yFrac * 15}px)`;
        }
    });
})();


/* =========================================================================
   4. ANIMATED NUMBER COUNTER (for stat items)
   ========================================================================= */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1800; // ms
            const start    = performance.now();

            function step(now) {
                const elapsed  = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased    = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, observerOptions);

    counters.forEach(el => observer.observe(el));
})();


/* =========================================================================
   5. FLOATING GEOMETRIC RINGS — About & Skills Sections
   ========================================================================= */
(function initFloatingRings() {
    const sections = [
        document.getElementById('about'),
        document.getElementById('skills'),
    ];

    sections.forEach((sec, idx) => {
        if (!sec) return;
        sec.style.position = 'relative';
        sec.style.overflow = 'hidden';

        const sizes   = [300, 500, 200];
        const offsets = [
            { top: '-80px', right: '-80px' },
            { bottom: '-120px', left: '-120px' },
            { top: '40%', right: '10%' },
        ];

        sizes.forEach((size, i) => {
            const ring = document.createElement('div');
            ring.className = 'ring-deco';
            ring.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${18 + i * 5}s;
                animation-direction: ${i % 2 === 0 ? 'normal' : 'reverse'};
                opacity: ${0.6 - i * 0.15};
            `;
            Object.assign(ring.style, offsets[i] || {});
            sec.appendChild(ring);
        });
    });
})();
