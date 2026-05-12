/**
 * SENIOR CREATIVE DEVELOPER PORTFOLIO
 * Vanilla JS Scripting: Preloader, Scroll Animations, Modal Logic, and Custom Cursor.
 */

/* =========================================================================
   1. LOADING STATE / PRELOADER
   ========================================================================= */
// Gunakan DOMContentLoaded bukan window.load
// Agar preloader langsung hilang setelah HTML selesai di-parse,
// TIDAK menunggu semua gambar 16MB selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Animasi loading sebentar lalu hilang
        setTimeout(() => {
            preloader.style.opacity    = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.pointerEvents = 'none';
            preloader.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 800);
    }
});

// Safety net: window.load juga memastikan preloader hilang
// Jika DOMContentLoaded sudah handle di atas, ini tidak akan mengubah apa-apa
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.opacity !== '0') {
        preloader.style.opacity    = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
        preloader.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
});


/* =========================================================================
   2. CUSTOM CURSOR (KHUSUS DESKTOP)
   ========================================================================= */
const cursor = document.querySelector('.custom-cursor');
// Elemen-elemen yang jika dihover akan mengubah bentuk cursor
const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, input, textarea');

// Mengubah posisi custom cursor mengikuti mouse
document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Memberikan efek membesar (hover state) pada custom cursor
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
});


/* =========================================================================
   3. SCROLL PROGRESS BAR & HEADER EFFECTS
   ========================================================================= */
const scrollProgress = document.getElementById('scrollProgress');
const header = document.getElementById('header');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    // Menghitung seberapa jauh user telah melakukan scroll (dalam persentase)
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (totalScroll / windowHeight) * 100;

    // Update lebar progress bar
    if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Menambahkan kelas 'scrolled' pada header untuk memicu efek backdrop-filter (blur)
    if (header) {
        if (totalScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Menampilkan tombol Back To Top setelah scroll > 500px
    if (backToTopBtn) {
        if (totalScroll > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

// Smooth scroll untuk tombol Back To Top
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* =========================================================================
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER API)
   ========================================================================= */
// Menyeleksi semua elemen yang memiliki kelas 'reveal'
const revealElements = document.querySelectorAll('.reveal');

// Gunakan rootMargin lebih kecil di mobile agar elemen lebih mudah terreveal
const isMobileReveal = window.matchMedia('(max-width: 768px)').matches;

const revealOptions = {
    threshold: isMobileReveal ? 0.05 : 0.15,
    rootMargin: isMobileReveal ? "0px 0px -10px 0px" : "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// FAILSAFE: Reveal semua elemen setelah 5 detik agar konten tidak pernah
// tetap tersembunyi jika IntersectionObserver tidak trigger di iOS lama
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => {
        el.classList.add('active');
    });
}, 5000);


/* =========================================================================
   5. MODAL / LIGHTBOX LOGIC UNTUK PORTFOLIO
   ========================================================================= */
/**
 * DATABASE PROYEK PORTFOLIO (Dummy JSON)
 * Key/properti (seperti 'luxury') harus sama persis dengan atribut 'data-project' pada HTML.
 * Dengan begini, Anda dapat dengan mudah menambahkan proyek baru tanpa mengubah logika JS.
 */
const projectData = {
    vault: {
        title: "RNVN — web Development",
        desc: "Layanan RNVN Web Developer Web Design Desain website modern, clean, dan premium dengan tampilan yang elegan dan user friendly. Web Development Pembuatan website cepat, aman, responsif, dan berperforma tinggi. Responsive Design Tampilan optimal di desktop, tablet, maupun smartphone. E-Commerce Website Membangun toko online modern lengkap dengan produk, cart, checkout, dan payment gateway. Landing Page Premium  Landing page cinematic untuk promosi brand, produk, event, atau bisnis. Portfolio Website Website personal atau company profile dengan identitas visual profesional. SEO & Speed Optimization Optimasi website agar cepat, ringan, dan mudah ditemukan di Google. Maintenance & Support Perawatan website, update sistem, dan support berkelanjutan. Domain & Hosting Membantu setup domain dan hosting agar website siap online dengan aman dan stabil.",
        imgSrc: "rnvn web.png",
        link: "https://randianodeskaputra.netlify.app/" // Ganti dengan URL project VAULT
    },
    rnvn: {
        title: "RNVN — Streetwear Identity",
        desc: "RNVN is a brand born from controlled aggression. The visual identity fuses brutalist grid systems with editorial typography to create a presence that dominates — online and off. Logo, lookbook, and digital storefront conceived as a singular, cohesive statement.",
        imgSrc: "mockup.png",
        link: "https://rnvnofficial.netlify.app/" // URL RNVN (sudah diperbaiki)
    },
    nexus: {
        title: "RNVN PRINTING",
        desc: "Kami melayani Cetak Undangan Cetak Foto Banner & Poster Sticker & Merchandise Sablon Kaos Branding UMKM Digital Printing Desain & Produksi Visual Dengan kualitas modern dan hasil yang siap meningkatkan identitas visual bisnis maupun personal project Anda.",
        imgSrc: "rnvn printing2.png",
        link: "https://randianodeskaputra.netlify.app/" // Ganti dengan URL project NEXUS
    }
};


// Referensi DOM untuk Modal
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const closeBtn = document.querySelector('.close-modal');
const portfolioCards = document.querySelectorAll('.portfolio-card');

portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const data = projectData[projectId];

        if (data) {
            modalImage.src = data.imgSrc;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            modalLink.href = data.link;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');

            // iOS scroll lock: save position, fix body in place
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add('modal-open');
        }
    });
});

// Store scroll position for restore on close
const closeModal = () => {
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        // Restore scroll position after unlocking body
        const scrollY = parseFloat(document.body.style.top || '0') * -1;
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
    }
};

// Event listener untuk tombol 'X'
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// UX: Tutup modal jika user meng-klik area gelap (backdrop) di luar konten modal
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// UX: Tutup modal saat user menekan tombol 'Escape' di keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});


/* =========================================================================
   6. CONTACT FORM → WHATSAPP INTEGRATION
   ========================================================================= */

// ⚠️ GANTI dengan nomor WhatsApp kamu (format internasional, tanpa +)
// Contoh: Indonesia 08123456789 → 628123456789
const WA_NUMBER = '6285159223964'; // <-- GANTI INI

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn       = contactForm.querySelector('button');
        const nameVal   = document.getElementById('name').value.trim();
        const emailVal  = document.getElementById('email').value.trim();
        const msgVal    = document.getElementById('message').value.trim();

        if (!nameVal || !emailVal || !msgVal) return;

        // Loading state
        const originalText    = btn.textContent;
        btn.textContent       = 'Opening WhatsApp...';
        btn.style.opacity     = '0.7';
        btn.style.pointerEvents = 'none';

        // Buat pesan WhatsApp yang sudah diformat
        const waMessage = `Halo Randiano Deska Putra! 👋%0A%0ASaya menghubungi kamu melalui portfolio website.%0A%0A*Nama:* ${encodeURIComponent(nameVal)}%0A*Email:* ${encodeURIComponent(emailVal)}%0A%0A*Pesan:*%0A${encodeURIComponent(msgVal)}`;

        const waURL = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;
        // Save full innerHTML including SVG icon before we overwrite it
        const originalHTML = btn.innerHTML;

        setTimeout(() => {
            window.open(waURL, '_blank', 'noopener,noreferrer');

            btn.textContent              = '✓ Redirected to WhatsApp!';
            btn.style.backgroundColor    = 'var(--accent-blue)';
            btn.style.color              = 'var(--bg-dark)';
            btn.style.opacity            = '1';

            contactForm.reset();

            // Restore button with original icon after 4 seconds
            setTimeout(() => {
                btn.innerHTML                = originalHTML;
                btn.style.backgroundColor    = 'transparent';
                btn.style.color              = 'var(--text-light)';
                btn.style.pointerEvents      = 'auto';
            }, 4000);

        }, 800);
    });
}


/* =========================================================================
   7. MOBILE NAVIGATION TOGGLE
   ========================================================================= */
const menuToggle = document.getElementById('menuToggle');
const desktopNav = document.querySelector('.desktop-nav');

if (menuToggle && desktopNav) {
    const toggleIcon = menuToggle.querySelector('span') || menuToggle;
    menuToggle.addEventListener('click', () => {
        const isOpen = desktopNav.classList.toggle('open');
        toggleIcon.innerHTML = isOpen ? '&times;' : '&#9776;';
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    desktopNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            desktopNav.classList.remove('open');
            toggleIcon.innerHTML = '&#9776;';
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

/* =========================================================================
   8. CURSOR TRAIL EFFECT (Desktop only)
   ========================================================================= */
(function initCursorTrail() {
    if (window.innerWidth < 1025) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    const TRAIL_COUNT = 6;
    const trails = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = document.createElement('div');
        const size = 4 - i * 0.5;
        dot.style.cssText = `position:fixed;top:0;left:0;width:${size}px;height:${size}px;border-radius:50%;background:rgba(14,165,233,${0.55 - i * 0.08});pointer-events:none;z-index:9997;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
        document.body.appendChild(dot);
        trails.push({ el: dot, x: 0, y: 0 });
    }
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateTrail() {
        let lx = mx, ly = my;
        trails.forEach((t, i) => {
            const delay = 0.18 + i * 0.06;
            t.x += (lx - t.x) * delay;
            t.y += (ly - t.y) * delay;
            t.el.style.left = t.x + 'px';
            t.el.style.top  = t.y + 'px';
            lx = t.x; ly = t.y;
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
})();

/* =========================================================================
   9. ACTIVE NAV HIGHLIGHT ON SCROLL
   ========================================================================= */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    // Lower threshold on mobile so section detection triggers sooner
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(a => {
                a.style.color = '';
                if (a.getAttribute('href') === '#' + entry.target.id) {
                    a.style.color = 'var(--accent-blue)';
                }
            });
        });
    }, { threshold: isMobile ? 0.2 : 0.4 });
    sections.forEach(sec => observer.observe(sec));
})();

/* =========================================================================
   10. PORTFOLIO CARD MAGNETIC HOVER (desktop only)
   ========================================================================= */
(function initCardMagnetic() {
    // Disable on touch/mobile — prevents transform conflicts with filter animation
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) * 0.035;
            const dy = (e.clientY - cy) * 0.035;
            card.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        });
    });
})();

/* =========================================================================
   11. SWIPE DOWN TO CLOSE MODAL (mobile)
   ========================================================================= */
(function initSwipeToCloseModal() {
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;

    let startY = 0;
    let isDragging = false;

    modalContent.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    modalContent.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - startY;
        // Only allow downward swipe
        if (deltaY > 0) {
            modalContent.style.transform = `translateY(${deltaY}px)`;
            modalContent.style.transition = 'none';
        }
    }, { passive: true });

    modalContent.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        const deltaY = e.changedTouches[0].clientY - startY;
        // Close if swiped down more than 120px
        if (deltaY > 120) {
            closeModal();
        } else {
            // Snap back
            modalContent.style.transform = '';
            modalContent.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }, { passive: true });
})();

/* =========================================================================
   12. TOUCH ACTIVE STATES — visual tap feedback on cards
   ========================================================================= */
(function initTouchFeedback() {
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;

    // Portfolio cards — scale down on tap
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
            card.style.transform  = 'scale(0.97)';
            card.style.opacity    = '0.85';
        }, { passive: true });

        const resetCard = () => {
            card.style.transform = 'scale(1)';
            card.style.opacity   = '1';
            setTimeout(() => {
                card.style.transform = '';
                card.style.opacity   = '';
                card.style.transition = '';
            }, 200);
        };
        card.addEventListener('touchend',    resetCard, { passive: true });
        card.addEventListener('touchcancel', resetCard, { passive: true });
    });

    // Filter buttons — pulse on tap
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('touchstart', () => {
            btn.style.transition = 'transform 0.1s ease';
            btn.style.transform  = 'scale(0.94)';
        }, { passive: true });
        const resetBtn = () => {
            btn.style.transform = 'scale(1)';
            setTimeout(() => {
                btn.style.transform  = '';
                btn.style.transition = '';
            }, 150);
        };
        btn.addEventListener('touchend',    resetBtn, { passive: true });
        btn.addEventListener('touchcancel', resetBtn, { passive: true });
    });

    // CTA buttons
    document.querySelectorAll('.cta-button, .submit-btn, .cta-secondary').forEach(btn => {
        btn.addEventListener('touchstart', () => {
            btn.style.transition = 'opacity 0.1s ease';
            btn.style.opacity    = '0.75';
        }, { passive: true });
        const resetBtn = () => {
            btn.style.opacity    = '1';
            setTimeout(() => {
                btn.style.opacity    = '';
                btn.style.transition = '';
            }, 150);
        };
        btn.addEventListener('touchend',    resetBtn, { passive: true });
        btn.addEventListener('touchcancel', resetBtn, { passive: true });
    });
})();
