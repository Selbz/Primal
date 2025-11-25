// Force scroll to top on page refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Also ensure we're at top on load
window.onload = () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
};

// Mobile detection
const isMobile = window.innerWidth <= 768;

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    // Trigger nav animation after a small delay
    setTimeout(() => {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.classList.add('loaded');
        }
    }, 100);

    // Burger Menu Toggle
    const burgerMenu = document.getElementById('burgerMenu');
    const fullscreenMenu = document.getElementById('fullscreenMenu');

    if (burgerMenu && fullscreenMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            fullscreenMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (fullscreenMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Hero text animations - only for home page
    const heroText = document.querySelector(".hero-text");

    if (heroText) {
        // Animate the text sliding up from the mask
        gsap.to(".hero-text", {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.5
        });

        // 3D Tilt Effect - Enhanced for more obvious movement (disabled on mobile for performance)
        if (!isMobile) {
            window.addEventListener("mousemove", (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
                const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

                gsap.to(".hero-text", {
                    rotationY: x * 20, // Rotate Y based on X position (doubled)
                    rotationX: -y * 20, // Rotate X based on Y position (doubled)
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        }
    }

    // Video Card Animation - slide in from left
    const videoCard = document.querySelector(".video-card");
    if (videoCard) {
        gsap.fromTo(".video-card",
            {
                x: -200,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                delay: 1.5
            }
        );
    }

    // Image sequence array - only for home page
    const heroImage = document.getElementById('heroImage');

    if (heroImage) {
        const images = [
            'hero-front.png',
            'hero-front1.png',
            'hero-front2.png'
        ];
        let currentImageIndex = 0;

        // Adjust thresholds for mobile
        const mobileThreshold1 = isMobile ? 0.3 : 0.25;
        const mobileThreshold2 = isMobile ? 0.65 : 0.6;

        // Scroll-based image sequence effect
        ScrollTrigger.create({
            trigger: '.scroll-container',
            start: 'top top',
            end: isMobile ? '+=50%' : '+=300%', // Even shorter scroll distance on mobile
            pin: true, // Lock the section in place
            scrub: true,
            onUpdate: (self) => {
                // Calculate which image to show based on scroll progress
                // self.progress goes from 0 to 1
                const progress = self.progress;
                let newIndex;

                if (progress < mobileThreshold1) {
                    newIndex = 0; // First image
                } else if (progress < mobileThreshold2) {
                    newIndex = 1; // Second image
                } else {
                    newIndex = 2; // Third image
                }

                // Only change image if we've moved to a new index
                if (newIndex !== currentImageIndex) {
                    currentImageIndex = newIndex;
                    // Instant image swap
                    heroImage.src = images[currentImageIndex];
                }
            },
            markers: false // Set to true for debugging
        });

        // Parallax effect for hero front image - starts after image sequence is complete
        // Reduced parallax on mobile for smoother performance
        gsap.to(".hero-front-img", {
            y: isMobile ? -100 : -200,
            ease: "none",
            scrollTrigger: {
                trigger: ".content-section",
                start: "top bottom",
                end: "bottom top",
                scrub: isMobile ? 2 : 1.5,
                markers: false
            }
        });
    }

    // Section Image Reveal Effect - Mask slides left to right
    const sectionImages = document.querySelectorAll(".section-image img");
    sectionImages.forEach((img, index) => {
        gsap.to(img, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: img.closest('.section-image'),
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // Section Text Animations - for each section
    const sectionContents = document.querySelectorAll(".section-content");
    sectionContents.forEach((section, sectionIndex) => {
        // Split h2 text into characters while preserving br tags
        const h2Element = section.querySelector("h2");
        if (h2Element) {
            const html = h2Element.innerHTML;
            // Handle both <br> and <br> with spaces/variations
            const parts = html.split(/<br\s*\/?>/i);

            h2Element.innerHTML = parts.map(part => {
                const text = part.trim();
                if (!text) return '';
                return text.split('').map(char => {
                    if (char === ' ') return ' ';
                    return `<span class="char">${char}</span>`;
                }).join('');
            }).filter(part => part).join('<br>');

            // Animate characters one by one
            const chars = h2Element.querySelectorAll('.char');
            gsap.to(chars, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.03,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: h2Element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Animate paragraphs sliding up
        const paragraphs = section.querySelectorAll("p");
        if (paragraphs.length > 0) {
            gsap.to(paragraphs, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: paragraphs[0],
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
    });

    // Carousel Section Animations
    if (document.querySelector(".carousel-section")) {
        gsap.fromTo(".carousel-header h2",
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".carousel-header",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo(".carousel-wrapper",
            { x: 150, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".carousel-wrapper",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo(".carousel-caption",
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".carousel-caption",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Categories Section Animations
    if (document.querySelector(".categories-section")) {
        if (document.querySelector(".text-stripe")) {
            gsap.fromTo(".text-stripe",
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".text-stripe",
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        if (document.querySelector(".category-item")) {
            // Desktop: Standard animation
            if (!isMobile) {
                gsap.fromTo(".category-item",
                    { x: -50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".categories-list",
                            start: "top 75%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            } else {
                // Mobile: Scroll-based activation with image popup
                const categoryItems = document.querySelectorAll(".category-item");

                categoryItems.forEach((item, index) => {
                    // Initial fade in
                    gsap.fromTo(item,
                        { x: -50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.8,
                            delay: index * 0.15,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: ".categories-list",
                                start: "top 75%",
                                toggleActions: "play none none none"
                            }
                        }
                    );

                    // Create scroll trigger for each item activation
                    ScrollTrigger.create({
                        trigger: item,
                        start: "top 60%",
                        end: "bottom 40%",
                        onEnter: () => item.classList.add('active'),
                        onLeave: () => item.classList.remove('active'),
                        onEnterBack: () => item.classList.add('active'),
                        onLeaveBack: () => item.classList.remove('active'),
                        markers: false
                    });
                });
            }
        }
    }

    // Full Width Video Section Animation
    if (document.querySelector(".full-width-video-section")) {
        gsap.fromTo(".full-width-video-section",
            { scale: 1.2, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".full-width-video-section",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Newsletter Section Animations
    if (document.querySelector(".newsletter-section")) {
        gsap.fromTo(".newsletter-card",
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".newsletter-card",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo(".newsletter-content h2",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.3,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".newsletter-card",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo(".newsletter-content p",
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".newsletter-card",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo(".newsletter-form",
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".newsletter-card",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Scroll down button click handler - only on home page
    const scrollBtn = document.querySelector('.scroll-btn-container');
    if (scrollBtn && heroImage) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Progress Bar Scroll Effect
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        progressBar.style.width = progress + '%';

        // Change color based on section background
        // Check if we're in a light background section (like footer)
        const footer = document.querySelector('.footer');
        const footerRect = footer.getBoundingClientRect();

        // White progress bar by default (for black sections)
        // Black progress bar for light sections (footer)
        if (footerRect.top < windowHeight && footerRect.bottom > 0) {
            progressBar.classList.add('dark');
        } else {
            progressBar.classList.remove('dark');
        }
    });

    // Optimize for mobile performance
    if (isMobile) {
        // Reduce complexity of animations on mobile
        gsap.config({ force3D: true });
        ScrollTrigger.config({ limitCallbacks: true });
    }

    // Refresh ScrollTrigger after page load to ensure proper positioning
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });

    // Category hover image effect
    const categoryItems = document.querySelectorAll('.category-item');
    const hoverImage = document.getElementById('hoverImage');

    if (hoverImage && categoryItems.length > 0) {
        const hoverImageElement = hoverImage.querySelector('img');
        let isHovering = false;

        // Different rotation angles for each category
        const rotations = [5, -8, 12, -6, 10];

        categoryItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                isHovering = true;
                // Change image source based on data-image attribute
                const imageSrc = item.getAttribute('data-image');
                hoverImageElement.src = imageSrc;
                // Apply unique rotation for this category
                hoverImage.style.transform = `rotate(${rotations[index]}deg)`;
                hoverImage.style.opacity = '1';
            });

            item.addEventListener('mouseleave', () => {
                isHovering = false;
                hoverImage.style.opacity = '0';
            });

            item.addEventListener('mousemove', (e) => {
                if (isHovering) {
                    // Position image at cursor with offset to center it
                    const x = e.clientX - 125; // 125 is half of 250px
                    const y = e.clientY - 125;

                    hoverImage.style.left = `${x}px`;
                    hoverImage.style.top = `${y}px`;
                }
            });
        });
    }

    // Page Hero Animations
    if (document.querySelector('.page-title')) {
        // Video background animation
        if (document.querySelector('.page-hero-video')) {
            gsap.from(".page-hero-video", {
                scale: 1.2,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out"
            });
        }

        gsap.from(".page-title", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.3
        });

        gsap.from(".page-subtitle", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.6
        });
    }

    // Collection Grid Animations
    if (document.querySelector('.collection-item')) {
        gsap.from(".collection-item", {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".collection-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }

    // Contact Form Animations
    if (document.querySelector('.contact-form-section')) {
        gsap.from(".contact-info", {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-container",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(".contact-form-wrapper", {
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-container",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }
});
