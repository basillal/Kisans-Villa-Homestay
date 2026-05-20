document.addEventListener('DOMContentLoaded', () => {
    // Animated Background Bubbles
    const bubblesContainer = document.querySelector('.bubbles-container');
    if (bubblesContainer) {
        const bubbleCount = 20;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Math.random() * 50 + 15; // sizes between 15px and 65px
            const left = Math.random() * 100;
            const delay = Math.random() * 12;
            const duration = Math.random() * 15 + 10; // between 10s and 25s
            const opacity = Math.random() * 0.12 + 0.04; // low opacity for background elegance
            const wobble = Math.random() * 60 - 30; // -30px to 30px lateral sway
            
            // Dynamic premium colors for bubbles matching the luxury gradient theme
            const colors = [
                {
                    glow: 'rgba(224, 164, 255, 0.45)', // Amethyst Lavender
                    base: 'rgba(224, 164, 255, 0.15)',
                    border: 'rgba(224, 164, 255, 0.35)'
                },
                {
                    glow: 'rgba(255, 138, 174, 0.45)', // Sunset Rose
                    base: 'rgba(255, 138, 174, 0.15)',
                    border: 'rgba(255, 138, 174, 0.35)'
                },
                {
                    glow: 'rgba(197, 160, 89, 0.45)', // Champagne Gold
                    base: 'rgba(197, 160, 89, 0.15)',
                    border: 'rgba(197, 160, 89, 0.35)'
                },
                {
                    glow: 'rgba(110, 230, 218, 0.45)', // Soft Teal
                    base: 'rgba(110, 230, 218, 0.15)',
                    border: 'rgba(110, 230, 218, 0.35)'
                }
            ];
            const colorScheme = colors[Math.floor(Math.random() * colors.length)];

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.bottom = `-${size + 20}px`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.setProperty('--bubble-opacity', opacity);
            bubble.style.setProperty('--wobble-offset', `${wobble}px`);
            
            // Apply unique gradient colors and glassmorphic box-shadow
            bubble.style.background = `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.6) 0%, ${colorScheme.base} 35%, rgba(0, 0, 0, 0) 70%, ${colorScheme.glow} 100%)`;
            bubble.style.boxShadow = `0 4px 15px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 0.4), inset 0 -2px 5px ${colorScheme.glow}`;
            bubble.style.borderColor = colorScheme.border;
            
            // Randomly blur some bubbles for luxury depth of field
            if (Math.random() > 0.6) {
                bubble.style.filter = `blur(${Math.random() * 2 + 1}px)`;
            }
            
            bubblesContainer.appendChild(bubble);
        }
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Premium Drawer Implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('open');
    });

    // Close mobile menu when links are clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.classList.remove('open');
        });
    });

    // Reviews Slider
    const track = document.querySelector('.review-track');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let index = 0;

    function updateSlider() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % cards.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + cards.length) % cards.length;
        updateSlider();
    });

    // Auto-slide reviews
    setInterval(() => {
        index = (index + 1) % cards.length;
        updateSlider();
    }, 5000);

    // Availability Form Handling
    const availabilityForm = document.getElementById('availability-form');
    if (availabilityForm) {
        availabilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            
            // Construct WhatsApp message
            const message = `Hello Kisans Villa! I'd like to check availability for:\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\n\nIs the villa available?`;
            const whatsappUrl = `https://wa.me/919846294858?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroImg = document.getElementById('hero-img');
        const aboutImg = document.getElementById('about-img');

        if (heroImg) {
            heroImg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
        }
        
        if (aboutImg && scrolled > 300) {
            // Simple parallax for about image based on scroll
            const offset = (scrolled - 300) * 0.15;
            aboutImg.style.transform = `translateY(${offset}px)`;
        }
    });
});
