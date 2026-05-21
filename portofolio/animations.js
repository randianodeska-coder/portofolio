/**
 * RNVN PORTFOLIO — Ultra Premium Animation Engine v3.0
 * Cinematic scroll-driven section enter/exit animations
 * Requires: GSAP 3 + ScrollTrigger (loaded in index.html)
 */

/* =========================================================================
   MAIN ENTRY — called from initAll() in script.js
   ========================================================================= */
function initUltraPremiumAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[Anim] GSAP or ScrollTrigger not found, skipping premium animations.');
        return;
    }

    const isMobile  = window.innerWidth < 768;
    const isTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) return;

    // Inject section entry lines
    injectSectionEntryLines();

    // Section bg enter/exit (scrub-based)
    initHeroExitParallax(isMobile);
    initAboutBgAnimation(isMobile);
    initSkillsBgAnimation(isMobile);
    initPortfolioBgAnimation(isMobile);
    initContactBgAnimation(isMobile);

    // Advanced text & element reveals
    initAdvancedTextReveals(isMobile);
    initSectionEntryLineAnim();
    initBentoShimmer();
    initStatCountingEffect();
    initAboutParaReveal(isMobile);

    // Desktop-only extras
    if (!isMobile && !isTouch) {
        initDesktopParallaxLayers();
        initCursorTrail();
    }
}

/* =========================================================================
   SECTION ENTRY LINES — glowing horizontal sweep on enter
   ========================================================================= */
function injectSectionEntryLines() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.querySelector('.section-entry-line')) return;
        const line = document.createElement('div');
        line.className = 'section-entry-line';
        line.setAttribute('aria-hidden', 'true');
        section.prepend(line);
    });
}

function initSectionEntryLineAnim() {
    const lines = document.querySelectorAll('.section-entry-line');
    lines.forEach(line => {
        ScrollTrigger.create({
            trigger: line.parentElement,
            start: 'top 80%',
            onEnter: () => line.classList.add('active'),
            onLeaveBack: () => line.classList.remove('active'),
        });
    });
}

/* =========================================================================
   HERO — exit parallax (content floats up as user scrolls down)
   ========================================================================= */
function initHeroExitParallax(isMobile) {
    // Hero text column fades + lifts on scroll-out
    const heroTextCol = document.querySelector('.hero-text-col');
    if (heroTextCol) {
        gsap.to(heroTextCol, {
            y: isMobile ? -40 : -100,
            opacity: 0.15,
            scale: 0.97,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'center top',
                end: 'bottom top',
                scrub: isMobile ? 0.4 : 0.9,
            }
        });
    }

    // Orbs drift away on scroll
    const orb1 = document.querySelector('.orb-1');
    if (orb1 && !isMobile) {
        gsap.to(orb1, {
            y: -180, x: 40, scale: 1.15, opacity: 0.5,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 2,
            }
        });
    }

    // Ring decoration rotates and fades on scroll
    const ring = document.querySelector('.hero-ring-deco');
    if (ring && !isMobile) {
        gsap.to(ring, {
            y: -120, rotation: 50, opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    }

    // Hero photo col — slower parallax upward
    const heroImg = document.querySelector('.hero-photo-col');
    if (heroImg) {
        gsap.to(heroImg, {
            y: isMobile ? -20 : -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: isMobile ? 0.5 : 1.5,
            }
        });
    }

    // Hero badge reveals with dramatic entry
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge && !isMobile) {
        gsap.fromTo(heroBadge,
            { y: -30, opacity: 0, rotationX: -90 },
            {
                y: 0, opacity: 1, rotationX: 0,
                duration: 1.2, delay: 0.2,
                ease: 'power4.out',
            }
        );
    }
}

/* =========================================================================
   ABOUT — background enter + exit
   ========================================================================= */
function initAboutBgAnimation(isMobile) {
    const aboutBg = document.querySelector('#about .about-bg');
    if (!aboutBg) return;

    const scrubVal = isMobile ? 0.6 : 1.2;

    // Enter: scale from 1.08 → 1, fade in
    gsap.fromTo(aboutBg,
        { opacity: 0, scale: 1.08, y: 40 },
        {
            opacity: 1, scale: 1, y: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'top 90%',
                end: 'top 15%',
                scrub: scrubVal,
            }
        }
    );

    // Exit: scale down + fade
    gsap.fromTo(aboutBg,
        { opacity: 1, scale: 1, y: 0 },
        {
            opacity: 0, scale: 0.94, y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'bottom 65%',
                end: 'bottom top',
                scrub: scrubVal,
            }
        }
    );

    // Ambient lights parallax
    const ambientLights = document.querySelector('.about-ambient-lights');
    if (ambientLights) {
        gsap.to(ambientLights, {
            y: isMobile ? -25 : -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
            }
        });
    }
}

/* =========================================================================
   SKILLS — background enter + exit with shape movements
   ========================================================================= */
function initSkillsBgAnimation(isMobile) {
    const skillsBg = document.querySelector('#skills .skills-bg');
    const shape1   = document.querySelector('.skills-abstract-shape-1');
    const shape2   = document.querySelector('.skills-abstract-shape-2');

    const scrubVal = isMobile ? 0.5 : 1.1;

    // Bg enter from right
    if (skillsBg) {
        gsap.fromTo(skillsBg,
            { opacity: 0, x: isMobile ? 30 : 70, scale: 1.06 },
            {
                opacity: 1, x: 0, scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 90%',
                    end: 'top 20%',
                    scrub: scrubVal,
                }
            }
        );

        // Exit to left
        gsap.fromTo(skillsBg,
            { opacity: 1, x: 0, scale: 1 },
            {
                opacity: 0, x: isMobile ? -20 : -50, scale: 0.96,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'bottom 65%',
                    end: 'bottom top',
                    scrub: scrubVal,
                }
            }
        );
    }

    // Shape 1 sweeps in from top-left
    if (shape1 && !isMobile) {
        gsap.fromTo(shape1,
            { x: -120, y: -60, opacity: 0, rotation: -20 },
            {
                x: 0, y: 0, opacity: 1, rotation: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 90%',
                    end: 'top 25%',
                    scrub: 1.8,
                }
            }
        );
    }

    // Shape 2 sweeps in from bottom-right
    if (shape2 && !isMobile) {
        gsap.fromTo(shape2,
            { x: 120, y: 60, opacity: 0, rotation: 20 },
            {
                x: 0, y: 0, opacity: 1, rotation: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 90%',
                    end: 'top 25%',
                    scrub: 1.8,
                }
            }
        );
    }
}

/* =========================================================================
   PORTFOLIO — cinematic grid & glow enter + exit
   ========================================================================= */
function initPortfolioBgAnimation(isMobile) {
    const portfolioBg  = document.querySelector('#portfolio .portfolio-bg');
    const gridEl       = document.querySelector('.portfolio-futuristic-grid');
    const glowEl       = document.querySelector('.portfolio-cinematic-glow');

    const scrubVal = isMobile ? 0.5 : 1.1;

    // Bg fades in with scale
    if (portfolioBg) {
        gsap.fromTo(portfolioBg,
            { opacity: 0, scale: 1.10, y: isMobile ? 20 : 50 },
            {
                opacity: 1, scale: 1, y: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#portfolio',
                    start: 'top 90%',
                    end: 'top 15%',
                    scrub: scrubVal,
                }
            }
        );

        // Exit: fade + float up
        gsap.fromTo(portfolioBg,
            { opacity: 1, scale: 1, y: 0 },
            {
                opacity: 0, scale: 0.95, y: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#portfolio',
                    start: 'bottom 60%',
                    end: 'bottom top',
                    scrub: scrubVal,
                }
            }
        );
    }

    // Grid reveals with a slower scrub
    if (gridEl && !isMobile) {
        gsap.fromTo(gridEl,
            { opacity: 0, scale: 0.88 },
            {
                opacity: 1, scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#portfolio',
                    start: 'top 85%',
                    end: 'top 30%',
                    scrub: 1.6,
                }
            }
        );
    }

    // Cinematic glow pulses in from center
    if (glowEl) {
        gsap.fromTo(glowEl,
            { opacity: 0, scale: 0.5 },
            {
                opacity: 1, scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#portfolio',
                    start: 'top 80%',
                    end: 'top 10%',
                    scrub: 2,
                }
            }
        );
    }

    // Portfolio cards — dramatic staggered entrance
    const cards = document.querySelectorAll('.portfolio-card');
    if (cards.length) {
        gsap.fromTo(cards,
            { opacity: 0, y: isMobile ? 30 : 60, scale: 0.94 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.9,
                stagger: isMobile ? 0.1 : 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#portfolioGrid',
                    start: isMobile ? 'top 90%' : 'top 82%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }
}

/* =========================================================================
   CONTACT — luxury gradient sweeps in diagonally
   ========================================================================= */
function initContactBgAnimation(isMobile) {
    const contactBg      = document.querySelector('#contact .contact-bg');
    const luxuryGradient = document.querySelector('.contact-luxury-gradient');
    const particles      = document.querySelector('.contact-particles');

    const scrubVal = isMobile ? 0.5 : 1.1;

    // Bg enters from bottom-right diagonal
    if (contactBg) {
        gsap.fromTo(contactBg,
            { opacity: 0, x: isMobile ? 20 : 60, y: isMobile ? 20 : 50, scale: 1.08 },
            {
                opacity: 1, x: 0, y: 0, scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 90%',
                    end: 'top 15%',
                    scrub: scrubVal,
                }
            }
        );
    }

    // Luxury gradient sweeps in
    if (luxuryGradient && !isMobile) {
        gsap.fromTo(luxuryGradient,
            { opacity: 0, x: -80, scale: 1.18, rotation: -5 },
            {
                opacity: 1, x: 0, scale: 1, rotation: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 88%',
                    end: 'top 25%',
                    scrub: 2,
                }
            }
        );
    }

    // Particles rise from below
    if (particles) {
        gsap.fromTo(particles,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 85%',
                    end: 'top 20%',
                    scrub: isMobile ? 0.8 : 1.5,
                }
            }
        );
    }
}

/* =========================================================================
   ADVANCED TEXT REVEALS — clip-path + word stagger
   ========================================================================= */
function initAdvancedTextReveals(isMobile) {
    // Section titles — clip-path slide up from below
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        // Skip if GSAP already handled it in script.js reveal
        if (title.closest('#hero')) return;

        gsap.fromTo(title,
            {
                clipPath: 'polygon(0% 110%, 100% 110%, 100% 110%, 0% 110%)',
                y: 30,
                opacity: 0,
            },
            {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 110%, 0% 110%)',
                y: 0,
                opacity: 1,
                duration: 1.1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: title,
                    start: isMobile ? 'top 92%' : 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // Section subtitles — fade slide up with delay
    const sectionSubs = document.querySelectorAll('.section-sub, .portfolio-subtitle');
    sectionSubs.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.9,
                delay: 0.25,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 94%' : 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });
}

/* =========================================================================
   ABOUT PARAGRAPHS — staggered slide from left
   ========================================================================= */
function initAboutParaReveal(isMobile) {
    const paras = document.querySelectorAll('.about-text p');
    if (!paras.length) return;

    gsap.fromTo(paras,
        { opacity: 0, x: isMobile ? -20 : -40 },
        {
            opacity: 1, x: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-text',
                start: isMobile ? 'top 90%' : 'top 82%',
                toggleActions: 'play none none none',
            }
        }
    );
}

/* =========================================================================
   BENTO GRID — shimmer on entry
   ========================================================================= */
function initBentoShimmer() {
    const items = document.querySelectorAll('.bento-item');
    if (!items.length) return;

    items.forEach((item, i) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            onEnter: () => {
                setTimeout(() => {
                    item.classList.add('anim-shimmer');
                }, i * 80);
            }
        });
    });
}

/* =========================================================================
   STAT COUNTING — counting glow effect
   ========================================================================= */
function initStatCountingEffect() {
    const statItems = document.querySelectorAll('.stat-item');
    if (!statItems.length) return;

    statItems.forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            onEnter: () => {
                item.classList.add('counting');
                setTimeout(() => item.classList.remove('counting'), 2000);
            }
        });
    });
}

/* =========================================================================
   DESKTOP PARALLAX LAYERS — aurora & bg move at different speeds
   ========================================================================= */
function initDesktopParallaxLayers() {
    // Aurora blobs move slowly while scrolling
    const aurora1 = document.querySelector('.aurora-1');
    const aurora2 = document.querySelector('.aurora-2');
    const aurora3 = document.querySelector('.aurora-3');

    if (aurora1) {
        gsap.to(aurora1, {
            y: -120,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '40% top',
                scrub: 3,
            }
        });
    }

    if (aurora2) {
        gsap.to(aurora2, {
            y: 80, x: -40,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '60% top',
                scrub: 4,
            }
        });
    }

    if (aurora3) {
        gsap.to(aurora3, {
            y: -60, x: 40,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: '20% top',
                end: '80% top',
                scrub: 3.5,
            }
        });
    }
}

/* =========================================================================
   CURSOR TRAIL — premium particle trail on desktop
   ========================================================================= */
function initCursorTrail() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let lastTrailTime = 0;
    const TRAIL_INTERVAL = 40; // ms between each dot

    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTrailTime < TRAIL_INTERVAL) return;
        lastTrailTime = now;

        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';

        // Randomize size slightly
        const size = Math.random() * 4 + 3;
        dot.style.width  = size + 'px';
        dot.style.height = size + 'px';

        document.body.appendChild(dot);

        // Remove after animation
        setTimeout(() => dot.remove(), 500);
    }, { passive: true });
}

/* =========================================================================
   EXPOSE GLOBALLY — called from initAll() in script.js
   ========================================================================= */
window.initUltraPremiumAnimations = initUltraPremiumAnimations;
