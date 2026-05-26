/**
 * KISANS VILLA HOMESTAY - LUXURY ENGINE
 * Core Javascript logic for elite, responsive interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       HERO ROTATING WORD (baseline-safe)
       ========================================== */
    const initHeroRotatingWord = () => {
        const wrappers = document.querySelectorAll('.hero-rotating-word[data-words]');
        if (!wrappers.length) return;

        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        wrappers.forEach((wrapper) => {
            const words = (wrapper.dataset.words || '')
                .split(',')
                .map(w => w.trim())
                .filter(Boolean);

            if (words.length < 2) return;

            const currentText = wrapper.textContent.trim();
            let index = words.indexOf(currentText);
            if (index < 0) index = 0;

            // Lock width by maximum letter count ("same letters" feel).
            const maxLen = words.reduce((m, w) => Math.max(m, w.length), 0);
            wrapper.style.setProperty('--rot-min-width', `${maxLen}ch`);
            wrapper.textContent = words[index];

            const intervalMs = 2000;
            const animMs = 420;
            let isAnimating = false;

            window.setInterval(() => {
                index = (index + 1) % words.length;

                if (prefersReducedMotion) {
                    wrapper.textContent = words[index];
                    return;
                }

                if (isAnimating) return;
                isAnimating = true;

                wrapper.classList.remove('rot-enter');
                wrapper.classList.add('rot-exit');

                window.setTimeout(() => {
                    wrapper.classList.remove('rot-exit');
                    wrapper.textContent = words[index];
                    wrapper.classList.add('rot-enter');

                    window.setTimeout(() => {
                        wrapper.classList.remove('rot-enter');
                        isAnimating = false;
                    }, animMs + 30);
                }, animMs + 30);
            }, intervalMs);
        });
    };
    initHeroRotatingWord();

    /* ==========================================
       1. AMBIENT BACKGROUND GLOW BUBBLES
       ========================================== */
    const initAmbientBubbles = () => {
        const bubblesContainer = document.querySelector('.bubbles-container');
        if (!bubblesContainer) return;

        const bubbleCount = 22;
        const colors = [
            {
                glow: 'rgba(200, 169, 106, 0.4)', // Warm Metallic Gold
                base: 'rgba(200, 169, 106, 0.12)',
                border: 'rgba(200, 169, 106, 0.25)'
            },
            {
                glow: 'rgba(245, 241, 232, 0.3)', // Warm Linen
                base: 'rgba(245, 241, 232, 0.08)',
                border: 'rgba(245, 241, 232, 0.15)'
            },
            {
                glow: 'rgba(110, 230, 218, 0.35)', // Ambient Soft Teal
                base: 'rgba(110, 230, 218, 0.1)',
                border: 'rgba(110, 230, 218, 0.2)'
            },
            {
                glow: 'rgba(224, 164, 255, 0.35)', // Amethyst Purple
                base: 'rgba(224, 164, 255, 0.1)',
                border: 'rgba(224, 164, 255, 0.2)'
            }
        ];

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');

            const size = Math.random() * 65 + 20; // 20px to 85px
            const left = Math.random() * 100;
            const duration = Math.random() * 20 + 12; // 12s to 32s
            // Start at a mid-animation progress so bubbles are visible immediately.
            // (If progress is too close to 0, bubbles begin below the viewport.)
            const progress = 0.08 + Math.random() * 0.52; // 8%..60%
            const delay = progress * duration;
            const opacity = Math.random() * 0.12 + 0.08;
            const wobble = Math.random() * 80 - 40; // -40px to 40px lateral sway

            const scheme = colors[Math.floor(Math.random() * colors.length)];

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.bottom = `-${size + 40}px`;
            bubble.style.animationDelay = `-${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.setProperty('--bubble-opacity', opacity);
            bubble.style.setProperty('--wobble-offset', `${wobble}px`);

            bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(242, 236, 224, 0.5) 0%, ${scheme.base} 40%, rgba(0,0,0,0) 75%, ${scheme.glow} 100%)`;
            bubble.style.boxShadow = `0 6px 20px rgba(0,0,0,0.2), inset 0 2px 6px rgba(242, 236, 224, 0.35), inset 0 -3px 8px ${scheme.glow}`;
            bubble.style.borderColor = scheme.border;

            if (Math.random() > 0.55) {
                bubble.style.filter = `blur(${Math.random() * 3 + 1}px)`;
            }

            bubblesContainer.appendChild(bubble);
        }
    };
    initAmbientBubbles();

    /* ==========================================
       2. HEADER SCROLL & MOBILE NAVIGATION DRAWER
       ========================================== */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('open');
            // Toggle body scroll locking when mobile menu is active
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close drawer on click of links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================
       3. INTERACTIVE HORIZONTAL SCROLL & DRAG SYSTEM (ATTRACTIONS)
       ========================================== */
    const attractionsGrid = document.getElementById('attractions-track');
    const scrollFill = document.getElementById('attractions-progress');
    const prevBtn = document.getElementById('attractions-prev');
    const nextBtn = document.getElementById('attractions-next');

    if (attractionsGrid) {

        // --- Auto Scroll (slow drift left) ---
        let autoScrollInterval = null;
        const SCROLL_SPEED = 0.8; // px per frame

        function startAutoScroll() {
            if (autoScrollInterval) return;
            autoScrollInterval = setInterval(() => {
                const maxScroll = attractionsGrid.scrollWidth - attractionsGrid.clientWidth;
                if (attractionsGrid.scrollLeft >= maxScroll) {
                    attractionsGrid.scrollLeft = 0; // loop back
                } else {
                    attractionsGrid.scrollLeft += SCROLL_SPEED;
                }
                updateScrollProgress();
            }, 16); // ~60fps
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }

        startAutoScroll();

        // Pause on hover
        attractionsGrid.addEventListener('mouseenter', stopAutoScroll);
        attractionsGrid.addEventListener('mouseleave', startAutoScroll);

        // Track Scroll Progression Width
        const updateScrollProgress = () => {
            if (!scrollFill) return;
            const maxScroll = attractionsGrid.scrollWidth - attractionsGrid.clientWidth;
            if (maxScroll <= 0) return;
            const percentage = (attractionsGrid.scrollLeft / maxScroll) * 100;
            scrollFill.style.width = `${Math.max(5, Math.min(percentage, 100))}%`;
        };

        attractionsGrid.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.addEventListener('resize', updateScrollProgress, { passive: true });

        // Arrow Buttons
        const CARD_SCROLL = 430; // approx card width + gap

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoScroll();
                attractionsGrid.scrollBy({ left: -CARD_SCROLL, behavior: 'smooth' });
                setTimeout(startAutoScroll, 3000); // resume after 3s
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoScroll();
                attractionsGrid.scrollBy({ left: CARD_SCROLL, behavior: 'smooth' });
                setTimeout(startAutoScroll, 3000);
            });
        }

        // Pointer / Touch drag scrolling (desktop + mobile)
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const pointerDown = (pageX) => {
            isDown = true;
            stopAutoScroll();
            attractionsGrid.classList.add('active');
            startX = pageX - attractionsGrid.getBoundingClientRect().left;
            scrollLeft = attractionsGrid.scrollLeft;
        };

        const pointerMove = (pageX, prevent) => {
            if (!isDown) return;
            if (prevent) prevent.preventDefault();
            const x = pageX - attractionsGrid.getBoundingClientRect().left;
            const walk = (x - startX) * 2; // multiplier gives a nicer drag feel
            attractionsGrid.scrollLeft = scrollLeft - walk;
            updateScrollProgress();
        };

        const pointerUp = () => {
            isDown = false;
            attractionsGrid.classList.remove('active');
            setTimeout(startAutoScroll, 2000);
        };

        // Mouse events
        attractionsGrid.addEventListener('mousedown', (e) => pointerDown(e.pageX));
        window.addEventListener('mouseup', pointerUp);
        window.addEventListener('mousemove', (e) => pointerMove(e.pageX, e));

        // Touch: prefer native scrolling on mobile. Stop auto-scroll while user interacts, resume after idle.
        let userResumeTimer = null;
        const scheduleResume = (delay = 3000) => {
            clearTimeout(userResumeTimer);
            userResumeTimer = setTimeout(() => {
                startAutoScroll();
            }, delay);
        };

        attractionsGrid.addEventListener('touchstart', () => {
            stopAutoScroll();
            // let the browser handle the touch scrolling natively
            clearTimeout(userResumeTimer);
        }, { passive: true });

        attractionsGrid.addEventListener('touchmove', () => {
            // update progress while user scrolls
            updateScrollProgress();
            clearTimeout(userResumeTimer);
            scheduleResume(2500);
        }, { passive: true });

        attractionsGrid.addEventListener('touchend', () => {
            scheduleResume(2000);
        }, { passive: true });

        // Wheel / mouse wheel should also pause auto-scroll briefly
        attractionsGrid.addEventListener('wheel', (e) => {
            stopAutoScroll();
            clearTimeout(userResumeTimer);
            scheduleResume(2000);
        }, { passive: true });

        // Ensure progress is correct on init
        updateScrollProgress();
    }

    /* ==========================================
       4. LUXURY GALLERY LIGHTBOX SYSTEM
       ========================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let activeGalleryIndex = 0;
    const galleryAssets = [];

    // Parse assets from current DOM gallery elements
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-info h3')?.textContent || 'Gallery View';
        const tag = item.querySelector('.gallery-tag')?.textContent || 'Kisans Villa';

        if (img) {
            galleryAssets.push({
                src: img.getAttribute('src') || img.src,
                caption: `${title} — <span style="color:#C8A96A;">${tag}</span>`
            });

            // Assign dynamic attributes for mapping click triggers
            item.setAttribute('data-gallery-idx', index);

            item.addEventListener('click', (e) => {
                e.preventDefault();
                activeGalleryIndex = index;
                openLightbox();
            });
        }
    });

    const openLightbox = () => {
        if (!lightboxModal || !lightboxImg || !lightboxCaption) return;

        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const updateLightboxContent = () => {
        const asset = galleryAssets[activeGalleryIndex];
        if (!asset || !lightboxImg || !lightboxCaption) return;

        // Trigger elegant scaling reset
        lightboxImg.style.transform = 'scale(0.95)';
        lightboxImg.style.opacity = '0';

        setTimeout(() => {
            lightboxImg.src = asset.src;
            lightboxCaption.innerHTML = asset.caption;
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 150);
    };

    const navigateLightbox = (direction) => {
        if (direction === 'next') {
            activeGalleryIndex = (activeGalleryIndex + 1) % galleryAssets.length;
        } else {
            activeGalleryIndex = (activeGalleryIndex - 1 + galleryAssets.length) % galleryAssets.length;
        }
        updateLightboxContent();
    };

    // Lightbox triggers & events
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));

    if (lightboxModal) {
        // Close on background click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // Keyboard support for gallery
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        }
    });

    /* ==========================================
       5. PREMIUM CROSS-FADE TESTIMONIALS SLIDER
       ========================================== */
    const reviews = document.querySelectorAll('.review-card');
    const sliderPrev = document.querySelector('.slider-nav .prev-btn');
    const sliderNext = document.querySelector('.slider-nav .next-btn');

    if (reviews.length > 0) {
        let currentReviewIdx = 0;
        let sliderInterval;

        const updateReviewSlide = () => {
            reviews.forEach((card, i) => {
                if (i === currentReviewIdx) {
                    card.classList.add('active-slide');
                } else {
                    card.classList.remove('active-slide');
                }
            });
        };

        const nextSlide = () => {
            currentReviewIdx = (currentReviewIdx + 1) % reviews.length;
            updateReviewSlide();
        };

        const prevSlide = () => {
            currentReviewIdx = (currentReviewIdx - 1 + reviews.length) % reviews.length;
            updateReviewSlide();
        };

        const startAutoplay = () => {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, 7000); // 7s autoplay duration
        };

        // Click handlers
        if (sliderNext) {
            sliderNext.addEventListener('click', () => {
                nextSlide();
                startAutoplay(); // Reset timer on click
            });
        }
        if (sliderPrev) {
            sliderPrev.addEventListener('click', () => {
                prevSlide();
                startAutoplay(); // Reset timer on click
            });
        }

        // Initialize state & timing
        updateReviewSlide();
        startAutoplay();
    }

    /* ==========================================
       6. LUXURY RESERVATION & WHATSAPP URL COMPILER
       ========================================== */
    const bookingForm = document.getElementById('availability-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;

            const getDurationText = (startDate, endDate) => {
                if (!startDate || !endDate) return 'Not selected';
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffMs = end - start;

                if (Number.isNaN(diffMs) || diffMs <= 0) return 'To be confirmed';

                const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                return `${nights} night${nights > 1 ? 's' : ''}`;
            };

            const duration = getDurationText(checkIn, checkOut);

            // Format dynamic dates beautifully
            const formatDate = (dateStr) => {
                if (!dateStr) return 'Not Selected';
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            };

            // Luxury editorial WhatsApp Message compiler
            const luxuryMessage = `Hello Kisans Villa Homestay! ✨\n\nI would love to check reservation availability for a luxury escape:\n\n📅 Arrival: ${formatDate(checkIn)}\n📅 Departure: ${formatDate(checkOut)}\n🌙 Duration: ${duration}\n👥 Party Size: ${guests} Guest(s)\n\nCould you please confirm reservation openings and offer package options? Thank you.`;

            const whatsappBaseUrl = 'https://wa.me/919846294858';
            const finalReservationUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(luxuryMessage)}`;

            window.open(finalReservationUrl, '_blank');
        });
    }

    /* ==========================================
       7. HARDWARE-ACCELERATED SCROLL REVEALS
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    revealObserver.unobserve(entry.target); // Trigger exactly once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(elem => revealObserver.observe(elem));
    }

    /* ==========================================
       8. PERFORMANCE OPTIMIZED SCROLL PARALLAX
       ========================================== */
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const executeParallaxEffects = (scrollPos) => {
        // Hero Parallax effect
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollPos * 0.22}px) scale(${1.08 + (scrollPos * 0.0001)})`;
        }

        // About Layout Parallax offset
        const aboutWrapper = document.querySelector('.about-image .img-wrapper img');
        if (aboutWrapper) {
            const aboutSection = document.querySelector('.about');
            if (aboutSection) {
                const sectionRect = aboutSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Only calculate if visible
                if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
                    const offset = (windowHeight - sectionRect.top) * 0.08;
                    aboutWrapper.style.transform = `translateY(${offset}px)`;
                }
            }
        }
    };

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                executeParallaxEffects(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

});
