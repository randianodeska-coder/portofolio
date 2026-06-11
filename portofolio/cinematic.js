/**
 * CINEMATIC.JS — Video-like Animation Effects
 * Film grain · Matrix rain · Typewriter · Glitch · Particle flow
 * RNVN PORTFOLIO v5.0
 */

(function () {
    'use strict';

    const isMobile  = window.innerWidth < 768;
    const isTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Wait for DOM ── */
    document.addEventListener('DOMContentLoaded', () => {
        if (isReduced) return;

        injectCinematicOverlays();
        injectLightBeams();
        injectFloatingParticles();
        injectDataStreams();
        injectEnergyRings();
        injectSweepLine();

        if (!isMobile) {
            startMatrixRain();
        }

        initTypewriter();
        initGlitchTitle();
        initVideoParallax();
        initCounterVideo();
    });

    /* =========================================================================
       1. INJECT OVERLAY ELEMENTS
       ========================================================================= */
    function injectCinematicOverlays() {
        // Film grain
        const grain = el('div', 'film-grain');
        grain.setAttribute('aria-hidden', 'true');
        document.body.appendChild(grain);

        // Scanlines
        const scanlines = el('div', 'scanlines');
        scanlines.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scanlines);

        // Vignette
        const vignette = el('div', 'vignette');
        vignette.setAttribute('aria-hidden', 'true');
        document.body.appendChild(vignette);

        // Cinematic letterbox bars
        const lbTop = el('div', 'letterbox-top');
        const lbBot = el('div', 'letterbox-bottom');
        lbTop.setAttribute('aria-hidden', 'true');
        lbBot.setAttribute('aria-hidden', 'true');
        document.body.prepend(lbTop);
        document.body.prepend(lbBot);
    }

    /* =========================================================================
       2. LIGHT BEAMS — Hero section
       ========================================================================= */
    function injectLightBeams() {
        const hero = document.querySelector('#hero');
        if (!hero) return;

        const container = el('div', 'light-beams');
        container.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 4; i++) {
            const beam = el('div', 'light-beam');
            container.appendChild(beam);
        }

        hero.appendChild(container);
    }

    /* =========================================================================
       3. FLOATING PARTICLES — Hero + Skills
       ========================================================================= */
    function injectFloatingParticles() {
        const targets = ['#hero', '#skills'];
        targets.forEach(sel => {
            const section = document.querySelector(sel);
            if (!section) return;

            const container = el('div', 'css-particles');
            container.setAttribute('aria-hidden', 'true');
            const count = isMobile ? 6 : 12;

            for (let i = 0; i < count; i++) {
                const p = el('div', 'cp');
                container.appendChild(p);
            }

            section.appendChild(container);
        });
    }

    /* =========================================================================
       4. DATA STREAMS — Portfolio section
       ========================================================================= */
    function injectDataStreams() {
        const section = document.querySelector('#portfolio');
        if (!section) return;

        const container = el('div', 'data-streams');
        container.setAttribute('aria-hidden', 'true');
        const count = isMobile ? 5 : 10;

        for (let i = 0; i < count; i++) {
            const ds = el('div', 'ds');
            container.appendChild(ds);
        }

        section.appendChild(container);
    }

    /* =========================================================================
       5. ENERGY RINGS — around hero photo
       ========================================================================= */
    function injectEnergyRings() {
        const wrapper = document.querySelector('.hero-image-wrapper');
        if (!wrapper) return;

        for (let i = 0; i < 3; i++) {
            const ring = el('div', 'energy-ring');
            ring.setAttribute('aria-hidden', 'true');
            wrapper.appendChild(ring);
        }
    }

    /* =========================================================================
       6. NEON SWEEP LINE — About section
       ========================================================================= */
    function injectSweepLine() {
        const about = document.querySelector('#about');
        if (!about) return;

        const line = el('div', 'neon-sweep-line');
        line.setAttribute('aria-hidden', 'true');
        about.appendChild(line);
    }

    /* =========================================================================
       7. MATRIX RAIN — Contact section canvas
       ========================================================================= */
    function startMatrixRain() {
        const contact = document.querySelector('#contact');
        if (!contact) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        contact.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let W, H, columns, drops;

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789①②③';
        const fontSize = 13;

        function resize() {
            W = canvas.width  = contact.offsetWidth;
            H = canvas.height = contact.offsetHeight;
            columns = Math.floor(W / fontSize);
            drops = new Array(columns).fill(1);
        }

        function draw() {
            ctx.fillStyle = 'rgba(3,3,3,0.05)';
            ctx.fillRect(0, 0, W, H);

            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                // Alternate between blue and purple
                const isBlue = i % 3 !== 0;
                ctx.fillStyle = isBlue
                    ? `rgba(14,165,233,${Math.random() * 0.6 + 0.4})`
                    : `rgba(124,58,237,${Math.random() * 0.6 + 0.4})`;

                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, y * fontSize);

                if (y * fontSize > H && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        }

        resize();
        window.addEventListener('resize', resize);

        // Only run when in viewport
        let rafId;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const loop = () => { draw(); rafId = requestAnimationFrame(loop); };
                loop();
            } else {
                cancelAnimationFrame(rafId);
            }
        }, { threshold: 0.1 });

        observer.observe(contact);
    }

    /* =========================================================================
       8. TYPEWRITER — Hero tagline
       ========================================================================= */
    function initTypewriter() {
        const tagline = document.querySelector('.hero-tagline');
        if (!tagline) return;

        const originalHTML = tagline.innerHTML;
        const plainText = tagline.textContent.trim();

        // Only run on first load, not after page interaction
        tagline.textContent = '';

        // Create cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.setAttribute('aria-hidden', 'true');

        let i = 0;
        const speed = isMobile ? 28 : 22;

        // Delay start to let other animations play first
        const delay = isMobile ? 800 : 1400;

        setTimeout(() => {
            // Restore any gradient spans carefully — type plain, restore at end
            const interval = setInterval(() => {
                if (i < plainText.length) {
                    tagline.textContent = plainText.slice(0, ++i);
                    tagline.appendChild(cursor);
                } else {
                    clearInterval(interval);
                    // Restore full HTML with gradient
                    tagline.innerHTML = originalHTML;
                    // Cursor blinks for 3s then fades
                    tagline.appendChild(cursor);
                    setTimeout(() => {
                        cursor.style.transition = 'opacity 1s ease';
                        cursor.style.opacity = '0';
                        setTimeout(() => cursor.remove(), 1000);
                    }, 3000);
                }
            }, speed);
        }, delay);
    }

    /* =========================================================================
       9. GLITCH TITLE — Periodic glitch on hero h1
       ========================================================================= */
    function initGlitchTitle() {
        const title = document.querySelector('.hero-title');
        if (!title) return;

        title.classList.add('glitch-text');
        title.setAttribute('data-text', title.textContent);

        // Re-trigger glitch periodically
        setInterval(() => {
            title.classList.remove('glitch-active');
            void title.offsetWidth; // reflow
            title.classList.add('glitch-active');
        }, 8000);
    }

    /* =========================================================================
       10. VIDEO PARALLAX — Scroll-based layer movement
       ========================================================================= */
    function initVideoParallax() {
        if (isTouch && isMobile) return;

        const layers = [
            { selector: '.film-grain',   speed: 0.05, axis: 'y' },
            { selector: '.aurora-1',     speed: 0.08, axis: 'y' },
            { selector: '.aurora-2',     speed: -0.06, axis: 'y' },
            { selector: '.light-beams',  speed: 0.12, axis: 'y' },
        ];

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) return;
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                layers.forEach(({ selector, speed, axis }) => {
                    const el = document.querySelector(selector);
                    if (!el) return;
                    const val = scrollY * speed;
                    el.style.transform = axis === 'y'
                        ? `translateY(${val}px)`
                        : `translateX(${val}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    /* =========================================================================
       11. COUNTER VIDEO EFFECT — Numbers roll like old-school odometer
       ========================================================================= */
    function initCounterVideo() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const increment = target / 60;
                const suffix2 = suffix.trim();

                const roll = () => {
                    current = Math.min(current + increment, target);
                    el.textContent = Math.floor(current) + suffix2;
                    if (current < target) requestAnimationFrame(roll);
                    else el.textContent = target + suffix2;
                };

                roll();
                observer.unobserve(el);
            });
        }, { threshold: 0.6 });

        counters.forEach(c => observer.observe(c));
    }

    /* =========================================================================
       UTILITY
       ========================================================================= */
    function el(tag, cls) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    }

})();
