/**
 * PORTFOLIO — FILTER, MAGNETIC CURSOR & ACCESSIBILITY MODULE
 * - Portfolio category filter: All Works / Web Dev / Branding / Digital
 * - Magnetic cursor effect on CTAs and cards
 * - Keyboard accessibility for portfolio cards
 * - Modal focus trap
 */

/* =========================================================================
   1. PORTFOLIO FILTER (All / Web / Design)
   ========================================================================= */
(function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.portfolio-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button state + ARIA
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter cards with staggered fade animation
            cards.forEach((card, i) => {
                const category = card.dataset.category;
                const matches  = filter === 'all' || category === filter;

                // Reset then animate
                card.style.transition = 'none';
                card.style.opacity    = '0';
                card.style.transform  = 'translateY(20px) scale(0.97)';

                setTimeout(() => {
                    if (matches) {
                        card.style.display = 'block';
                        requestAnimationFrame(() => {
                            card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s cubic-bezier(0.25,1,0.5,1) ${i * 0.08}s`;
                            card.style.opacity    = '1';
                            card.style.transform  = 'translateY(0) scale(1)';
                        });
                    } else {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity    = '0';
                        card.style.transform  = 'translateY(10px) scale(0.95)';
                        setTimeout(() => { card.style.display = 'none'; }, 320);
                    }
                }, 20);
            });
        });
    });
})();


/* =========================================================================
   2. MAGNETIC CURSOR EFFECT
   ========================================================================= */
(function initMagneticCursor() {
    // Only on desktop
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const MAGNETIC_RADIUS = 80;   // px — detection radius
    const PULL_STRENGTH   = 0.35; // 0–1 how strong the pull is

    const magneticTargets = document.querySelectorAll(
        '.cta-button, .portfolio-card, .submit-btn, .back-to-top, .filter-btn'
    );

    magneticTargets.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = e.clientX - cx;
            const dy   = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAGNETIC_RADIUS) {
                const pull = (1 - dist / MAGNETIC_RADIUS) * PULL_STRENGTH;
                el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            el.style.transform  = 'translate(0, 0)';
            // Reset transition to default after snap-back
            setTimeout(() => { el.style.transition = ''; }, 500);
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease';
        });
    });
})();


/* =========================================================================
   3. MODAL FOCUS TRAP + ARIA MANAGEMENT
   ========================================================================= */
(function initFocusTrap() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    // All focusable elements inside modal
    const getFocusable = () => Array.from(
        modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => !el.hasAttribute('aria-hidden'));

    // When modal opens — managed by script.js which adds .active class
    const observer = new MutationObserver(() => {
        const isOpen = modal.classList.contains('active');

        // Set aria-hidden correctly
        modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        if (isOpen) {
            // Focus the close button immediately
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) setTimeout(() => closeBtn.focus(), 100);

            // Trap focus inside modal
            modal.addEventListener('keydown', trapFocus);
        } else {
            modal.removeEventListener('keydown', trapFocus);
        }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = getFocusable();
        if (!focusable.length) { e.preventDefault(); return; }

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
            // Shift+Tab — going backwards
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab — going forwards
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
})();


/* =========================================================================
   4. KEYBOARD ACTIVATION FOR PORTFOLIO CARDS (Enter / Space)
   ========================================================================= */
(function initKeyboardCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click(); // triggers modal open from script.js
            }
        });
    });
})();


/* =========================================================================
   5. SCROLL-TRIGGERED REVEAL — re-observe new filter results
   ========================================================================= */
(function initRevealOnFilter() {
    const cards = document.querySelectorAll('.portfolio-card');

    // Ensure cards start visible (filter-only, no scroll-reveal needed on cards)
    cards.forEach(card => {
        card.style.opacity   = '1';
        card.style.transform = 'none';
    });
})();
