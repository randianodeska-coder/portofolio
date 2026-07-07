/**
 * RNVN PORTFOLIO — Premium Script
 * GSAP + ScrollTrigger + tsParticles
 */

/* =========================================================================
   GSAP Registration
   ========================================================================= */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================================
   1. PRELOADER
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const body = document.body;

    const hidePreloader = () => {
        if (!preloader) { initAll(); return; }
        if (typeof gsap !== 'undefined') {
            gsap.to(preloader, {
                opacity: 0, duration: 0.6, ease: 'power2.out',
                onComplete: () => {
                    preloader.style.display = 'none';
                    preloader.setAttribute('aria-hidden', 'true');
                    body.classList.remove('loading');
                    body.classList.add('loaded');
                    initAll();
                }
            });
        } else {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.setAttribute('aria-hidden', 'true');
            body.classList.remove('loading');
            body.classList.add('loaded');
            initAll();
        }
    };

    setTimeout(hidePreloader, 900);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            initAll();
        }
    }, 200);
});

/* =========================================================================
   2. INIT ALL
   ========================================================================= */
let initialized = false;
function initAll() {
    if (initialized) return;
    initialized = true;

    initParticles();
    initReveal();
    initNavbar();
    initCounters();
    initCursor();
    initScrollProgress();
    initBackToTop();
    initModal();
    initContactForm();
    initMobileNav();
    initFilterTabs();
    initLenis();
    initSpotlight();
    initHeroParallax();
    initMagneticButtons();
    initCards3DTilt();
    // Ultra Premium Animation Engine (animations.js)
    if (typeof initUltraPremiumAnimations === 'function') {
        initUltraPremiumAnimations();
    }
}

/* =========================================================================
   3. TSPARTICLES
   ========================================================================= */
async function initParticles() {
    const container = document.getElementById('tsparticles');
    if (!container || typeof tsParticles === 'undefined') {
        document.body.classList.add('no-webgl');
        return;
    }

    const isMobile = window.innerWidth < 768;
    const isTouch  = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Disable particles entirely on mobile for smooth scroll performance
    if (isMobile || isTouch) {
        container.style.display = 'none';
        document.body.classList.add('no-webgl');
        return;
    }

    try {
        await tsParticles.load('tsparticles', {
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
                number: {
                    value: 80,
                    density: { enable: true, area: 900 }
                },
                color: { value: ['#0EA5E9', '#ffffff', '#7C3AED'] },
                opacity: {
                    value: 0.45,
                    random: { enable: true, minimumValue: 0.15 },
                    animation: { enable: true, speed: 0.6, minimumValue: 0.1, sync: false }
                },
                size: { value: { min: 0.5, max: 2 } },
                links: {
                    enable: true, distance: 130,
                    color: '#0EA5E9', opacity: 0.18, width: 0.7
                },
                move: {
                    enable: true,
                    speed: 0.7,
                    direction: 'none', random: true, straight: false, outMode: 'out'
                }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: 'grab' },
                    onClick:  { enable: false }
                },
                modes: {
                    grab: { distance: 140, lineLinked: { opacity: 0.5 } }
                }
            },
            detectRetina: true
        });

        // Particles canvas should not block mouse events
        const canvas = container.querySelector('canvas');
        if (canvas) canvas.style.pointerEvents = 'none';
    } catch (e) {
        console.warn('tsParticles failed:', e);
        document.body.classList.add('no-webgl');
    }
}

/* =========================================================================
   4. REVEAL ANIMATIONS (GSAP)
   ========================================================================= */
function splitTextNodes(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    textNodes.forEach(node => {
        if (!node.nodeValue.trim()) return;
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ' || text[i] === '\n') {
                fragment.appendChild(document.createTextNode(text[i]));
            } else {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = text[i];
                fragment.appendChild(span);
            }
        }
        node.parentNode.replaceChild(fragment, node);
    });
}

function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const isMobile = window.innerWidth < 768;
    
    // Split text for titles before animating
    const splitTargets = document.querySelectorAll('.hero-title, .section-title');
    splitTargets.forEach(el => splitTextNodes(el));

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Reveal elements
        elements.forEach(el => {
            const isTitle = el.classList.contains('hero-title') || el.classList.contains('section-title');
            const target = isTitle ? el.querySelectorAll('.char') : el;
            
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.95) {
                const delay = parseFloat(el.style.animationDelay) ||
                    (el.classList.contains('delay-1') ? 0.15 :
                     el.classList.contains('delay-2') ? 0.3  :
                     el.classList.contains('delay-3') ? 0.45 : 0);

                gsap.fromTo(target,
                    { opacity: 0, y: isMobile ? 20 : 32 },
                    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out', stagger: isTitle ? 0.03 : 0,
                      onComplete: () => el.classList.add('active') }
                );
            } else {
                // Off-screen: use ScrollTrigger
                const delay = el.classList.contains('delay-1') ? 0.1 :
                              el.classList.contains('delay-2') ? 0.2 :
                              el.classList.contains('delay-3') ? 0.3 : 0;
                gsap.fromTo(target,
                    { opacity: 0, y: isMobile ? 20 : 32 },
                    {
                        opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out', stagger: isTitle ? 0.03 : 0,
                        scrollTrigger: {
                            trigger: el,
                            start: isMobile ? 'top 95%' : 'top 88%',
                            toggleActions: 'play none none none',
                            once: true
                        },
                        onComplete: () => el.classList.add('active')
                    }
                );
            }
        });

        // Stagger bento items
        const bentoItems = document.querySelectorAll('.bento-item');
        if (bentoItems.length) {
            gsap.fromTo(bentoItems,
                { opacity: 0, y: 30, scale: 0.97 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.7,
                    stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.bento-grid', start: 'top 85%',
                        toggleActions: 'play none none none', once: true
                    }
                }
            );
        }

    } else {
        // Fallback without GSAP
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                o.unobserve(entry.target);
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 20px 0px' });

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) el.classList.add('active');
            else obs.observe(el);
        });

        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.active)').forEach(el => el.classList.add('active'));
        }, 1200);
    }
}

/* =========================================================================
   5. NAVBAR
   ========================================================================= */
function initNavbar() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (header) {
            header.classList.toggle('scrolled', scrollY > 60);
            
            // Hide/Show logic
            if (scrollY > lastScroll && scrollY > 100) {
                // Scrolling down
                header.classList.add('nav-hidden');
            } else {
                // Scrolling up
                header.classList.remove('nav-hidden');
            }
        }
        
        if (scrollProgress) {
            const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = `${(scrollY / total) * 100}%`;
        }
        
        lastScroll = scrollY;
    }, { passive: true });
}

/* =========================================================================
   6. MOBILE NAV
   ========================================================================= */
function initMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav') || document.querySelector('.desktop-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            nav.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        });
    });
}

/* =========================================================================
   7. SCROLL PROGRESS + ACTIVE NAV
   ========================================================================= */
function initScrollProgress() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(a => {
                a.classList.toggle('active-link', a.getAttribute('href') === '#' + entry.target.id);
            });
        });
    }, { threshold: 0.3 });

    sections.forEach(s => obs.observe(s));
}

/* =========================================================================
   8. CUSTOM CURSOR (Desktop)
   ========================================================================= */
function initCursor() {
    if ('ontouchstart' in window || window.innerWidth < 1025) return;

    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    });

    (function animFollower() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        if (follower) {
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
        }
        requestAnimationFrame(animFollower);
    })();

    document.querySelectorAll('a, button, .portfolio-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); if(follower) follower.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); if(follower) follower.classList.remove('hover'); });
    });
}

/* =========================================================================
   9. NUMBER COUNTERS
   ========================================================================= */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const dur = 1600;
            const start = performance.now();

            function step(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
}

/* =========================================================================
   10. BACK TO TOP
   ========================================================================= */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =========================================================================
   11. MODAL
   ========================================================================= */
const projectData = {
    vault: {
        title: "RNVN — web Development",
        desc: "Layanan RNVN Web Developer Web Design Desain website modern, clean, dan premium dengan tampilan yang elegan dan user friendly. Web Development Pembuatan website cepat, aman, responsif, dan berperforma tinggi. Responsive Design Tampilan optimal di desktop, tablet, maupun smartphone. E-Commerce Website Membangun toko online modern lengkap dengan produk, cart, checkout, dan payment gateway. Landing Page Premium Landing page cinematic untuk promosi brand, produk, event, atau bisnis. Portfolio Website Website personal atau company profile dengan identitas visual profesional. SEO & Speed Optimization Optimasi website agar cepat, ringan, dan mudah ditemukan di Google. Maintenance & Support Perawatan website, update sistem, dan support berkelanjutan. Domain & Hosting Membantu setup domain dan hosting agar website siap online dengan aman dan stabil.",
        imgSrc: "rnvn web.png",
        link: "https://randianodeskaputra.netlify.app"
    },
    rnvn: {
        title: "RNVN — Streetwear Identity",
        desc: "RNVN is a brand born from controlled aggression. The visual identity fuses brutalist grid systems with editorial typography to create a presence that dominates — online and off. Logo, lookbook, and digital storefront conceived as a singular, cohesive statement.",
        imgSrc: "mockup.png",
        link: "https://rnvn-brand.vercel.app"
    },
    nexus: {
        title: "RNVN PRINTING",
        desc: "Kami melayani Cetak Undangan Cetak Foto Banner & Poster Sticker & Merchandise Sablon Kaos Branding UMKM Digital Printing Desain & Produksi Visual Dengan kualitas modern dan hasil yang siap meningkatkan identitas visual bisnis maupun personal project Anda.",
        imgSrc: "rnvn printing2.png",
        link: "https://rnvn-printing.vercel.app"
    },
    aiautomation: {
        title: "RNVN AI Automation",
        desc: "Platform otomasi bisnis berbasis AI yang dirancang untuk membantu bisnis, brand, dan individu mengotomatiskan alur kerja secara cerdas. Mulai dari otomasi pemasaran, manajemen leads, hingga integrasi sistem — semua dalam satu platform modern yang efisien dan berorientasi pada hasil nyata.",
        imgSrc: "rnvnaiautomation.png",
        link: "https://aiautomation-teal.vercel.app"
    },
    nexusplatform: {
        title: "NEXUS — Cyberpunk Observability Platform",
        desc: "Futuristic observability platform dengan 3D city visualization menggunakan Three.js + WebGL. Menampilkan mission-control cockpit interface, autonomous AI monitoring agents, real-time alert feed, animated dashboard, dan GSAP ScrollTrigger animations. Dibangun dengan dark-mode cyberpunk aesthetic, HUD overlays, dan immersive sci-fi storytelling.",
        imgSrc: "rnvnaiautomation.png",
        link: "https://aiautomation-teal.vercel.app"
    }
};

function initModal() {
    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalLink = document.getElementById('modalLink');
    const closeBtn = document.querySelector('.close-modal');
    if (!modal) return;

    let _savedScrollY = 0;

    const openModal = (projectId) => {
        const data = projectData[projectId];
        if (!data) return;
        modalImage.src = data.imgSrc;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalLink.setAttribute('href', data.link);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Save scroll position before locking
        _savedScrollY = window.scrollY || window.pageYOffset;
        document.body.style.top = `-${_savedScrollY}px`;
        document.body.classList.add('modal-open');

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal.querySelector('.modal-content'),
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
            );
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        // Restore scroll — use both methods for Android compatibility
        window.scrollTo({ top: _savedScrollY, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = _savedScrollY;
    };

    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.project));
        card.addEventListener('touchstart', () => {}, { passive: true });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Swipe to close
    const content = modal.querySelector('.modal-content');
    if (content) {
        let startY = 0;
        content.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
        content.addEventListener('touchend', e => {
            if (e.changedTouches[0].clientY - startY > 100) closeModal();
        }, { passive: true });
    }

    // iOS modal link fix
    if (modalLink) {
        modalLink.addEventListener('touchend', function(e) {
            e.preventDefault();
            const href = this.href;
            if (href && href !== '#') window.open(href, '_blank', 'noopener,noreferrer');
        }, { passive: false });
    }
}

/* =========================================================================
   12. CONTACT FORM → WHATSAPP
   ========================================================================= */
function initContactForm() {
    const WA = '628563122123';
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const msg = document.getElementById('message').value.trim();
        if (!name || !email || !msg) return;

        const text = `Halo RNVN! 👋%0A%0ASaya menghubungi Anda melalui website.%0A%0A*Nama:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A%0A*Pesan:*%0A${encodeURIComponent(msg)}`;
        const url = `https://wa.me/${WA}?text=${text}`;

        const waWin = window.open(url, '_blank', 'noopener,noreferrer');
        if (!waWin) window.location.href = url;

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.textContent = '✓ Redirected to WhatsApp!';
        btn.style.opacity = '0.8';
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.style.opacity = '1'; }, 4000);
    });
}

/* =========================================================================
   13. FILTER TABS
   ========================================================================= */
function initFilterTabs() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (typeof gsap !== 'undefined') {
                    if (show) {
                        card.style.display = '';
                        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                    } else {
                        gsap.to(card, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
                            onComplete: () => { card.style.display = 'none'; }
                        });
                    }
                } else {
                    card.style.display = show ? '' : 'none';
                }
            });
        });
    });
}

/* =========================================================================
   14. IOS TOUCH FIX
   ========================================================================= */
(function() {
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;
    document.querySelectorAll('a, button, .portfolio-card, .filter-btn, .modal-link, .close-modal').forEach(el => {
        el.style.pointerEvents = 'auto';
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
})();

/* =========================================================================
   15. LENIS SMOOTH SCROLLING
   ========================================================================= */
function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const isTouch  = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // ANDROID/iOS FIX: Disable Lenis entirely on touch devices.
    // Native browser scroll is smoother and more reliable on mobile.
    // Lenis interferes with Android Chrome's native momentum scrolling.
    if (isTouch) {
        // Ensure html/body can scroll natively
        document.documentElement.style.overflowY = '';
        document.body.style.overflowY = '';
        // Still update GSAP ScrollTrigger on native scroll
        if (typeof ScrollTrigger !== 'undefined') {
            window.addEventListener('scroll', ScrollTrigger.update, { passive: true });
        }
        return;
    }

    const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), // expo-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,   // keep native touch on mobile
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.1,            // lower = smoother but more lag; 0.1 is ideal
    });

    // CRITICAL FIX: Use ONLY ONE animation loop.
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(500, 33); // allow up to 33ms frames before lag correction
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Fix anchor links to use Lenis scroll (smooth animated jump)
    document.querySelectorAll('a[href^="#"]:not(#modalLink)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            }
        });
    });

    window._lenis = lenis;
}

/* =========================================================================
   16. PORTFOLIO SPOTLIGHT GLOW
   ========================================================================= */
function initSpotlight() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* =========================================================================
   17. HERO IMAGE PARALLAX
   ========================================================================= */
function initHeroParallax() {
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroImageWrapper || !heroImage) return;
    
    // Desktop Parallax
    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            // Move wrapper slightly opposite to mouse
            gsap.to(heroImageWrapper, {
                x: -x * 1.5,
                y: -y * 1.5,
                duration: 1.5,
                ease: 'power2.out'
            });
            
            // Move image slightly more to create 3D depth
            gsap.to(heroImage, {
                x: -x * 0.5,
                y: -y * 0.5,
                rotationY: x * 1.5,
                rotationX: -y * 1.5,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }
}

/* =========================================================================
   18. MAGNETIC BUTTONS
   ========================================================================= */
function initMagneticButtons() {
    if (window.innerWidth <= 1024) return; // Desktop only
    
    const magneticElements = document.querySelectorAll('.cta-button, .cta-secondary, .filter-btn');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

/* =========================================================================
   19. CARDS 3D TILT
   ========================================================================= */
function initCards3DTilt() {
    document.querySelectorAll('.portfolio-card, .skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / (rect.height / 2)) * 8;
            const tiltY = -(x / (rect.width / 2)) * 8;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
        
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.15s ease-out';
    });
}