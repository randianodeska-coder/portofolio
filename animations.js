/**
 * RNVN PORTFOLIO — Ultra Premium Animation Engine v5.0
 * Cinematic | Scroll-Driven | Mobile-Optimized + Super Anim
 * Requires: GSAP 3 + ScrollTrigger
 */

/* =========================================================================
   MAIN ENTRY
   ========================================================================= */
function initUltraPremiumAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[Anim] GSAP not found.');
        return;
    }

    const isMobile  = window.innerWidth < 768;
    const isTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) { document.body.classList.add('reduced-motion'); return; }

    // Inject utilities
    injectSectionEntryLines();

    // ── Background parallax layers
    initHeroExitParallax(isMobile);
    initAboutBgAnimation(isMobile);
    initSkillsBgAnimation(isMobile);
    initPortfolioBgAnimation(isMobile);
    initContactBgAnimation(isMobile);

    // ── Text & element reveals
    initHeroCinematicEntry(isMobile);
    initAdvancedTextReveals(isMobile);
    initSectionEntryLineAnim();
    initSectionTitleLines();      // NEW: neon underline trigger
    initBentoShimmer(isMobile);
    initStatCountingEffect();
    initAboutParaReveal(isMobile);
    initTechStackReveal(isMobile);
    initPortfolioCardsReveal(isMobile);
    initFooterReveal(isMobile);
    initScrollProgressGlow();     // NEW: scroll bar pulse

    // ── Mobile ripple touch feedback
    initMobileRipple();

    // ── Desktop extras
    if (!isMobile && !isTouch) {
        initDesktopParallaxLayers();
        initCursorTrail();
        initPortfolioCardTilt();
    }
}

/* =========================================================================
   SECTION TITLE — Trigger CSS neon underline via class
   ========================================================================= */
function initSectionTitleLines() {
    document.querySelectorAll('.section-title').forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: 'top 88%',
            onEnter: () => title.classList.add('line-reveal'),
        });
    });
}

/* =========================================================================
   SCROLL PROGRESS — pulsing glow on milestone %
   ========================================================================= */
function initScrollProgressGlow() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    // Already handled by CSS animation — just ensure it's visible
    bar.style.transition = 'width 0.1s linear';
}

/* =========================================================================
   MOBILE RIPPLE — Tactile press feedback
   ========================================================================= */
function initMobileRipple() {
    const targets = document.querySelectorAll('.portfolio-card, .cta-button, .cta-secondary, .filter-btn, .tech-tag, .bento-item');

    targets.forEach(el => {
        el.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const rect  = this.getBoundingClientRect();
            const x     = touch.clientX - rect.left;
            const y     = touch.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'touch-ripple';
            ripple.style.cssText = `
                position:absolute;
                left:${x}px;top:${y}px;
                width:4px;height:4px;
                border-radius:50%;
                background:rgba(14,165,233,0.6);
                transform:translate(-50%,-50%) scale(0);
                animation:rippleExpand 0.6s ease forwards;
                pointer-events:none;
                z-index:100;
            `;

            // Ensure parent is relative
            const pos = getComputedStyle(this).position;
            if (pos === 'static') this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        }, { passive: true });
    });

    // Inject ripple keyframe once
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
            @keyframes rippleExpand {
                0%   { transform: translate(-50%,-50%) scale(0);   opacity:0.8; }
                100% { transform: translate(-50%,-50%) scale(60);  opacity:0; }
            }
        `;
        document.head.appendChild(style);
    }
}


/* =========================================================================
   SECTION ENTRY LINES
   ========================================================================= */
function injectSectionEntryLines() {
    document.querySelectorAll('.section').forEach(section => {
        if (section.querySelector('.section-entry-line')) return;
        const line = document.createElement('div');
        line.className = 'section-entry-line';
        line.setAttribute('aria-hidden', 'true');
        section.prepend(line);
    });
}

function initSectionEntryLineAnim() {
    document.querySelectorAll('.section-entry-line').forEach(line => {
        ScrollTrigger.create({
            trigger: line.parentElement,
            start: 'top 82%',
            onEnter: () => line.classList.add('active'),
            onLeaveBack: () => line.classList.remove('active'),
        });
    });
}

/* =========================================================================
   HERO — Cinematic sequential entry
   ========================================================================= */
function initHeroCinematicEntry(isMobile) {
    const badge    = document.querySelector('.hero-badge');
    const title    = document.querySelector('.hero-title');
    const tagline  = document.querySelector('.hero-tagline');
    const desc     = document.querySelector('.hero-desc');
    const ctaGroup = document.querySelector('.hero-cta-group');
    const photo    = document.querySelector('.hero-image-wrapper');

    const tl = gsap.timeline({ delay: 0.3 });

    if (badge) {
        tl.fromTo(badge,
            { y: -24, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }
        );
    }
    if (title) {
        const chars = title.querySelectorAll('.char');
        if (chars.length) {
            tl.fromTo(chars,
                { y: 60, opacity: 0, rotationX: -45 },
                { y: 0, opacity: 1, rotationX: 0, stagger: 0.025, duration: 0.8, ease: 'power4.out' },
                '-=0.3'
            );
        } else {
            tl.fromTo(title,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
                '-=0.3'
            );
        }
    }
    if (tagline) {
        tl.fromTo(tagline,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            '-=0.4'
        );
    }
    if (desc) {
        tl.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' },
            '-=0.35'
        );
    }
    if (ctaGroup) {
        tl.fromTo(ctaGroup,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );
    }
    if (photo) {
        tl.fromTo(photo,
            { x: isMobile ? 0 : 60, opacity: 0, scale: 0.9 },
            { x: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' },
            isMobile ? '-=1.0' : 0.2
        );
    }
}

/* =========================================================================
   HERO — Exit parallax as user scrolls down
   ========================================================================= */
function initHeroExitParallax(isMobile) {
    const heroTextCol = document.querySelector('.hero-text-col');
    if (heroTextCol) {
        gsap.to(heroTextCol, {
            y: isMobile ? -30 : -80,
            opacity: 0.1,
            scale: 0.96,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'center top',
                end: 'bottom top',
                scrub: isMobile ? 0.5 : 1.0,
            }
        });
    }

    const heroImg = document.querySelector('.hero-photo-col');
    if (heroImg) {
        gsap.to(heroImg, {
            y: isMobile ? -15 : -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: isMobile ? 0.5 : 1.5,
            }
        });
    }

    const ring = document.querySelector('.hero-ring-deco');
    if (ring && !isMobile) {
        gsap.to(ring, {
            y: -100, rotation: 40, opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    }

    // Orbs drift
    ['.orb-1', '.orb-2', '.orb-3'].forEach((sel, i) => {
        const orb = document.querySelector(sel);
        if (orb && !isMobile) {
            gsap.to(orb, {
                y: -150 - i * 30,
                x: (i % 2 === 0 ? 1 : -1) * 40,
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.8 + i * 0.3,
                }
            });
        }
    });
}

/* =========================================================================
   ABOUT — BG enter / exit
   ========================================================================= */
function initAboutBgAnimation(isMobile) {
    const aboutBg = document.querySelector('#about .about-bg');
    if (!aboutBg) return;

    gsap.fromTo(aboutBg,
        { opacity: 0, scale: 1.06, y: 40 },
        {
            opacity: 1, scale: 1, y: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'top 92%',
                end: 'top 15%',
                scrub: isMobile ? 0.5 : 1.2,
            }
        }
    );

    gsap.fromTo(aboutBg,
        { opacity: 1, scale: 1, y: 0 },
        {
            opacity: 0, scale: 0.94, y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'bottom 65%',
                end: 'bottom top',
                scrub: isMobile ? 0.5 : 1.2,
            }
        }
    );

    const ambientLights = document.querySelector('.about-ambient-lights');
    if (ambientLights) {
        gsap.to(ambientLights, {
            y: isMobile ? -20 : -60,
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
   SKILLS — BG enter/exit with shape sweep
   ========================================================================= */
function initSkillsBgAnimation(isMobile) {
    const skillsBg = document.querySelector('#skills .skills-bg');
    const shape1   = document.querySelector('.skills-abstract-shape-1');
    const shape2   = document.querySelector('.skills-abstract-shape-2');

    if (skillsBg) {
        gsap.fromTo(skillsBg,
            { opacity: 0, x: isMobile ? 20 : 60, scale: 1.06 },
            {
                opacity: 1, x: 0, scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: '#skills', start: 'top 90%', end: 'top 20%', scrub: isMobile ? 0.5 : 1.1 }
            }
        );
        gsap.fromTo(skillsBg,
            { opacity: 1, x: 0, scale: 1 },
            {
                opacity: 0, x: isMobile ? -15 : -40, scale: 0.96,
                ease: 'none',
                scrollTrigger: { trigger: '#skills', start: 'bottom 65%', end: 'bottom top', scrub: isMobile ? 0.5 : 1.1 }
            }
        );
    }

    if (shape1 && !isMobile) {
        gsap.fromTo(shape1,
            { x: -120, y: -60, opacity: 0 },
            { x: 0, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#skills', start: 'top 90%', end: 'top 25%', scrub: 1.8 } }
        );
    }
    if (shape2 && !isMobile) {
        gsap.fromTo(shape2,
            { x: 120, y: 60, opacity: 0 },
            { x: 0, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#skills', start: 'top 90%', end: 'top 25%', scrub: 1.8 } }
        );
    }
}

/* =========================================================================
   PORTFOLIO — cinematic enter
   ========================================================================= */
function initPortfolioBgAnimation(isMobile) {
    const portfolioBg = document.querySelector('#portfolio .portfolio-bg');
    const glowEl      = document.querySelector('.portfolio-cinematic-glow');

    if (portfolioBg) {
        gsap.fromTo(portfolioBg,
            { opacity: 0, scale: 1.10, y: isMobile ? 15 : 40 },
            {
                opacity: 1, scale: 1, y: 0,
                ease: 'none',
                scrollTrigger: { trigger: '#portfolio', start: 'top 90%', end: 'top 15%', scrub: isMobile ? 0.5 : 1.1 }
            }
        );
        gsap.fromTo(portfolioBg,
            { opacity: 1, scale: 1, y: 0 },
            {
                opacity: 0, scale: 0.95, y: -25,
                ease: 'none',
                scrollTrigger: { trigger: '#portfolio', start: 'bottom 60%', end: 'bottom top', scrub: isMobile ? 0.5 : 1.1 }
            }
        );
    }

    if (glowEl) {
        gsap.fromTo(glowEl,
            { opacity: 0, scale: 0.6 },
            {
                opacity: 1, scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: '#portfolio', start: 'top 85%', end: 'top 10%', scrub: 2 }
            }
        );
    }
}

/* =========================================================================
   PORTFOLIO CARDS — staggered pop-in
   ========================================================================= */
function initPortfolioCardsReveal(isMobile) {
    const cards = document.querySelectorAll('.portfolio-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
        { opacity: 0, y: isMobile ? 40 : 70, scale: 0.93 },
        {
            opacity: 1, y: 0, scale: 1,
            duration: isMobile ? 0.7 : 0.9,
            stagger: isMobile ? 0.1 : 0.14,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#portfolioGrid',
                start: isMobile ? 'top 92%' : 'top 84%',
                toggleActions: 'play none none none',
            }
        }
    );

    // Card image parallax (desktop only)
    if (!isMobile) {
        cards.forEach(card => {
            const img = card.querySelector('.portfolio-image');
            if (!img) return;
            gsap.to(img, {
                y: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                }
            });
        });
    }
}

/* =========================================================================
   CONTACT — BG enter
   ========================================================================= */
function initContactBgAnimation(isMobile) {
    const contactBg      = document.querySelector('#contact .contact-bg');
    const luxuryGradient = document.querySelector('.contact-luxury-gradient');
    const particles      = document.querySelector('.contact-particles');

    if (contactBg) {
        gsap.fromTo(contactBg,
            { opacity: 0, x: isMobile ? 15 : 50, y: isMobile ? 15 : 40, scale: 1.06 },
            {
                opacity: 1, x: 0, y: 0, scale: 1,
                ease: 'none',
                scrollTrigger: { trigger: '#contact', start: 'top 90%', end: 'top 15%', scrub: isMobile ? 0.5 : 1.1 }
            }
        );
    }

    if (luxuryGradient && !isMobile) {
        gsap.fromTo(luxuryGradient,
            { opacity: 0, x: -60, scale: 1.15, rotation: -4 },
            {
                opacity: 1, x: 0, scale: 1, rotation: 0,
                ease: 'none',
                scrollTrigger: { trigger: '#contact', start: 'top 88%', end: 'top 25%', scrub: 2 }
            }
        );
    }

    if (particles) {
        gsap.fromTo(particles,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1,
                ease: 'none',
                scrollTrigger: { trigger: '#contact', start: 'top 88%', end: 'top 22%', scrub: isMobile ? 0.8 : 1.5 }
            }
        );
    }

    // Contact form fields stagger
    const fields = document.querySelectorAll('.contact-form .input-group');
    if (fields.length) {
        gsap.fromTo(fields,
            { opacity: 0, x: isMobile ? -20 : -40 },
            {
                opacity: 1, x: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: isMobile ? 'top 92%' : 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }

    // Submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        gsap.fromTo(submitBtn,
            { opacity: 0, y: 20, scale: 0.96 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: '.form-actions',
                    start: isMobile ? 'top 92%' : 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }
}

/* =========================================================================
   SECTION TITLE — clip-path wipe up + word stagger
   ========================================================================= */
function initAdvancedTextReveals(isMobile) {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        if (title.closest('#hero')) return;

        // Wipe-up with clip-path
        gsap.fromTo(title,
            { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 20, opacity: 0 },
            {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                y: 0, opacity: 1, duration: 1.0, ease: 'power4.out',
                scrollTrigger: {
                    trigger: title,
                    start: isMobile ? 'top 93%' : 'top 87%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // Subtitles fade-up
    document.querySelectorAll('.section-sub, .portfolio-subtitle, .contact-subtitle, .about-lead').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 24 },
            {
                opacity: 1, y: 0, duration: 0.85, delay: 0.18, ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 94%' : 'top 89%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });
}

/* =========================================================================
   ABOUT PARAGRAPHS — slide from left
   ========================================================================= */
function initAboutParaReveal(isMobile) {
    const paras = document.querySelectorAll('.about-text p');
    if (!paras.length) return;

    gsap.fromTo(paras,
        { opacity: 0, x: isMobile ? -18 : -36 },
        {
            opacity: 1, x: 0, duration: 0.8, stagger: 0.14, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-text',
                start: isMobile ? 'top 92%' : 'top 83%',
                toggleActions: 'play none none none',
            }
        }
    );

    // Stats — pop in one by one
    const stats = document.querySelectorAll('.stat-item');
    if (stats.length) {
        gsap.fromTo(stats,
            { opacity: 0, y: 30, scale: 0.88 },
            {
                opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(1.8)',
                scrollTrigger: {
                    trigger: '.about-stats',
                    start: isMobile ? 'top 93%' : 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }
}

/* =========================================================================
   BENTO GRID — wave stagger entry with shimmer
   ========================================================================= */
function initBentoShimmer(isMobile) {
    const items = document.querySelectorAll('.bento-item');
    if (!items.length) return;

    // Wave stagger from left
    gsap.fromTo(items,
        { opacity: 0, y: isMobile ? 28 : 44, scale: 0.92 },
        {
            opacity: 1, y: 0, scale: 1,
            stagger: { each: 0.09, from: 'start' },
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.bento-grid',
                start: isMobile ? 'top 92%' : 'top 85%',
                toggleActions: 'play none none none',
            }
        }
    );

    // Shimmer on entry
    items.forEach((item, i) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 88%',
            onEnter: () => setTimeout(() => item.classList.add('anim-shimmer'), i * 80),
        });
    });
}

/* =========================================================================
   TECH STACK — category cards wave + tag pop-in
   ========================================================================= */
function initTechStackReveal(isMobile) {
    const categories = document.querySelectorAll('.tech-category');
    if (!categories.length) return;

    // Categories sweep in from bottom
    gsap.fromTo(categories,
        { opacity: 0, y: isMobile ? 30 : 50, scale: 0.93 },
        {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.tech-stack-grid',
                start: isMobile ? 'top 93%' : 'top 87%',
                toggleActions: 'play none none none',
            }
        }
    );

    // Tech tags — wave pop-in after cards appear
    const tags = document.querySelectorAll('.tech-tag');
    if (tags.length) {
        gsap.fromTo(tags,
            { opacity: 0, scale: 0.7, y: 10 },
            {
                opacity: 1, scale: 1, y: 0,
                stagger: { each: 0.05, from: 'start' },
                duration: 0.45,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: '.tech-stack-grid',
                    start: isMobile ? 'top 90%' : 'top 85%',
                    toggleActions: 'play none none none',
                },
                delay: 0.35
            }
        );
    }
}

/* =========================================================================
   FOOTER — reveal
   ========================================================================= */
function initFooterReveal(isMobile) {
    const footer = document.querySelector('.footer-container');
    if (!footer) return;

    const children = footer.children;
    if (children.length) {
        gsap.fromTo(children,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                stagger: 0.1,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }

    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length) {
        gsap.fromTo(socialLinks,
            { opacity: 0, scale: 0.5 },
            {
                opacity: 1, scale: 1,
                stagger: 0.08,
                duration: 0.5,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: '.social-links',
                    start: 'top 92%',
                    toggleActions: 'play none none none',
                },
                delay: 0.3
            }
        );
    }
}

/* =========================================================================
   STAT COUNTING — glow ring
   ========================================================================= */
function initStatCountingEffect() {
    document.querySelectorAll('.stat-item').forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 86%',
            onEnter: () => {
                item.classList.add('counting');
                setTimeout(() => item.classList.remove('counting'), 2000);
            }
        });
    });
}

/* =========================================================================
   DESKTOP PARALLAX LAYERS — Aurora blobs
   ========================================================================= */
function initDesktopParallaxLayers() {
    const aurora1 = document.querySelector('.aurora-1');
    const aurora2 = document.querySelector('.aurora-2');
    const aurora3 = document.querySelector('.aurora-3');

    if (aurora1) gsap.to(aurora1, { y: -120, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: '40% top', scrub: 3 } });
    if (aurora2) gsap.to(aurora2, { y: 80, x: -40, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: '60% top', scrub: 4 } });
    if (aurora3) gsap.to(aurora3, { y: -60, x: 40, ease: 'none', scrollTrigger: { trigger: 'body', start: '20% top', end: '80% top', scrub: 3.5 } });
}

/* =========================================================================
   PORTFOLIO CARD — 3D Tilt (desktop only)
   ========================================================================= */
function initPortfolioCardTilt() {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const cx    = rect.left + rect.width / 2;
            const cy    = rect.top + rect.height / 2;
            const dx    = (e.clientX - cx) / (rect.width / 2);
            const dy    = (e.clientY - cy) / (rect.height / 2);
            const rotX  = -dy * 7;
            const rotY  = dx * 7;

            gsap.to(card, {
                rotationX: rotX, rotationY: rotY,
                transformPerspective: 800,
                scale: 1.03,
                duration: 0.35,
                ease: 'power2.out',
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0, rotationY: 0,
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.4)',
            });
        });
    });
}

/* =========================================================================
   CURSOR TRAIL
   ========================================================================= */
function initCursorTrail() {
    if ('ontouchstart' in window) return;
    let lastTime = 0;

    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTime < 35) return;
        lastTime = now;

        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        const size = Math.random() * 4 + 3;
        dot.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 500);
    }, { passive: true });
}

/* =========================================================================
   EXPOSE
   ========================================================================= */
window.initUltraPremiumAnimations = initUltraPremiumAnimations;
