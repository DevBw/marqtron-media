/**
 * @fileoverview Enhanced Navigation Functionality
 * @description Advanced navigation features and accessibility enhancements
 * @version 2.0.0
 * @author Marqtron Media Development Team
 * @created 2024
 * @updated 2024
 * @note Mobile menu core functionality is in shared.js to avoid duplication
 */

'use strict';

// =====================================
// CONFIGURATION & CONSTANTS
// =====================================

/** @type {Object} Configuration constants for navigation */
const NAV_CONFIG = {
    HEADER_SCROLL_THRESHOLD: 50,
    CAROUSEL_AUTO_ROTATE_INTERVAL: 6000,
    CAROUSEL_PAUSE_DURATION: 3000,
    FOCUS_PAUSE_DURATION: 2000,
    FORM_SUBMIT_DELAY: 1000,
    FORM_SUCCESS_DURATION: 2000
};

/** @type {Array<string>} Service names for carousel data attributes */
const SERVICE_NAMES = ['seo', 'content', 'social', 'web', 'design'];

// =====================================
// STATE VARIABLES
// =====================================

/** @type {number} Current service carousel slide index */
let currentServiceSlide = 0;

/** @type {number} Total number of service slides */
const totalServiceSlides = 5;

/** @type {number|null} Carousel auto-rotation interval ID */
let carouselInterval = null;

// =====================================
// MAIN INITIALIZATION
// =====================================

/**
 * Initialize enhanced navigation functionality
 * @description Main entry point for all navigation enhancements
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Enhanced Navigation: Initializing...');
        
        // Core navigation features
        initializeMobileMenuEnhancements();
        initializeHeaderScrollEffects();
        initializeDropdownAccessibility();
        
        // Carousel functionality
        initializeServiceCarousel();
        setupCarouselInteractionHandling();
        
        // Enhanced features
        initializeLazyLoading();
        initializeFormEnhancements();
        initializeAccessibilityFeatures();
        initializeServicePageNavigation();
        
        console.log('Enhanced Navigation: Initialization complete');
    } catch (error) {
        console.error('Enhanced Navigation: Error during initialization:', error);
    }
});

// =====================================
// MOBILE MENU ENHANCEMENTS
// =====================================

/**
 * Initialize mobile menu enhancements
 * @description Adds closing functionality for mobile menu interactions
 * @note Core mobile menu functionality is in shared.js
 */
function initializeMobileMenuEnhancements() {
    const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
    
    // Close mobile menu when clicking on navigation links
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu && 
            mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

/**
 * Close mobile menu helper function
 * @description Closes the mobile menu and resets icon state
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
    }
}

// =====================================
// HEADER SCROLL EFFECTS
// =====================================

/**
 * Initialize header scroll effects
 * @description Sets up enhanced scroll-based header behavior
 */
function initializeHeaderScrollEffects() {
    const scrollHandler = throttle(handleHeaderScroll, 16); // 60fps throttling
    window.addEventListener('scroll', scrollHandler, { passive: true });
}

/**
 * Handle header scroll behavior
 * @description Applies sticky header effects based on scroll position
 */
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const shouldBeSticky = window.scrollY > NAV_CONFIG.HEADER_SCROLL_THRESHOLD;
    
    if (shouldBeSticky) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
}

// =====================================
// DROPDOWN ACCESSIBILITY
// =====================================

/**
 * Initialize dropdown accessibility features
 * @description Enhances dropdown menus with keyboard navigation and ARIA
 */
function initializeDropdownAccessibility() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        // Handle keyboard navigation
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(trigger);
            }
        });
        
        // Set ARIA attributes
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
    });
    
    // Handle escape key to close all dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

/**
 * Toggle dropdown menu
 * @param {HTMLElement} trigger - The dropdown trigger element
 * @description Opens or closes a dropdown menu with proper ARIA states
 */
function toggleDropdown(trigger) {
    const dropdown = trigger.closest('.nav-dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (!menu) return;
    
    const isVisible = menu.style.opacity === '1';
    const newState = !isVisible;
    
    menu.style.opacity = newState ? '1' : '0';
    menu.style.visibility = newState ? 'visible' : 'hidden';
    trigger.setAttribute('aria-expanded', newState.toString());
    
    if (newState) {
        // Focus first link in dropdown
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
    }
}

/**
 * Close all dropdown menus
 * @description Closes all open dropdown menus and resets ARIA states
 */
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    const triggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdowns.forEach(dropdown => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
    });
    
    triggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
    });
}

// =====================================
// SERVICE CAROUSEL FUNCTIONALITY
// =====================================

/**
 * Initialize service carousel
 * @description Sets up the service carousel with enhanced functionality
 */
function initializeServiceCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    if (!carousel) {
        console.warn('Service carousel not found');
        return;
    }
    
    const cards = carousel.querySelectorAll('.premium-card');
    
    // Validate slide count
    if (cards.length !== totalServiceSlides) {
        console.warn(`Expected ${totalServiceSlides} carousel cards, but found ${cards.length}`);
    }
    
    // Add service data attributes
    cards.forEach((card, index) => {
        if (SERVICE_NAMES[index]) {
            card.setAttribute('data-service', SERVICE_NAMES[index]);
        }
    });
    
    // Setup carousel indicators
    setupCarouselIndicators();
    
    // Initialize carousel state
    updateServiceCarousel();
    
    console.log(`Service carousel initialized with ${cards.length} slides`);
}

/**
 * Setup carousel indicators
 * @description Initialize carousel indicator functionality
 */
function setupCarouselIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
        // Click handler
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        
        // Keyboard accessibility
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', `Go to service ${index + 1}`);
        
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
            }
        });
    });
}

/**
 * Navigate to next slide
 * @description Moves carousel to the next slide with wrap-around
 */
function nextSlide() {
    currentServiceSlide = (currentServiceSlide + 1) % totalServiceSlides;
    updateServiceCarousel();
}

/**
 * Navigate to previous slide
 * @description Moves carousel to the previous slide with wrap-around
 */
function previousSlide() {
    currentServiceSlide = (currentServiceSlide - 1 + totalServiceSlides) % totalServiceSlides;
    updateServiceCarousel();
}

/**
 * Go to specific slide
 * @param {number} slideIndex - Index of the slide to navigate to
 * @description Moves carousel to a specific slide
 */
function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalServiceSlides) {
        currentServiceSlide = slideIndex;
        updateServiceCarousel();
    }
}

/**
 * Update carousel display
 * @description Updates carousel visual state and accessibility attributes
 */
function updateServiceCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.premium-card');
    
    // Update card positions and states
    cards.forEach((card, index) => {
        card.classList.remove('center', 'side', 'far');
        
        if (index === currentServiceSlide) {
            card.classList.add('center');
        } else if (
            index === (currentServiceSlide - 1 + totalServiceSlides) % totalServiceSlides ||
            index === (currentServiceSlide + 1) % totalServiceSlides
        ) {
            card.classList.add('side');
        } else {
            card.classList.add('far');
        }
        
        // Setup card interaction
        setupCardInteraction(card, index);
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentServiceSlide);
        indicator.setAttribute('aria-pressed', (index === currentServiceSlide).toString());
    });
}

/**
 * Setup card interaction handlers
 * @param {HTMLElement} card - The card element
 * @param {number} index - The card index
 * @description Sets up click and keyboard handlers for carousel cards
 */
function setupCardInteraction(card, index) {
    // Remove existing handlers to prevent duplicates
    card.onclick = null;
    card.onkeydown = null;
    
    // Click handler
    card.onclick = function(e) {
        e.preventDefault();
        
        if (index !== currentServiceSlide) {
            // Move non-center card to center
            goToSlide(index);
        } else {
            // Navigate to service page for center card
            const serviceLink = card.querySelector('.service-link');
            if (serviceLink && serviceLink.href) {
                window.location.href = serviceLink.href;
            }
        }
    };
    
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${card.querySelector('.service-title')?.textContent || 'service'} details`);
    
    card.onkeydown = function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    };
}

// =====================================
// CAROUSEL AUTO-ROTATION
// =====================================

/**
 * Setup carousel interaction handling
 * @description Configures auto-rotation with pause on interaction
 */
function setupCarouselInteractionHandling() {
    const carouselContainer = document.querySelector('.services-carousel-container');
    if (!carouselContainer) return;
    
    // Start auto-rotation
    startCarouselAutoRotate();
    
    // Pause on mouse interactions
    carouselContainer.addEventListener('mouseenter', stopCarouselAutoRotate);
    carouselContainer.addEventListener('mouseleave', startCarouselAutoRotate);
    
    // Pause on keyboard focus
    carouselContainer.addEventListener('focusin', stopCarouselAutoRotate);
    carouselContainer.addEventListener('focusout', () => {
        setTimeout(startCarouselAutoRotate, NAV_CONFIG.FOCUS_PAUSE_DURATION);
    });
    
    // Pause on touch for mobile
    carouselContainer.addEventListener('touchstart', stopCarouselAutoRotate);
    carouselContainer.addEventListener('touchend', () => {
        setTimeout(startCarouselAutoRotate, NAV_CONFIG.CAROUSEL_PAUSE_DURATION);
    });
}

/**
 * Start carousel auto-rotation
 * @description Starts the automatic carousel rotation timer
 */
function startCarouselAutoRotate() {
    stopCarouselAutoRotate(); // Clear any existing interval
    carouselInterval = setInterval(nextSlide, NAV_CONFIG.CAROUSEL_AUTO_ROTATE_INTERVAL);
}

/**
 * Stop carousel auto-rotation
 * @description Stops the automatic carousel rotation timer
 */
function stopCarouselAutoRotate() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// =====================================
// LAZY LOADING FUNCTIONALITY
// =====================================

/**
 * Initialize lazy loading for images
 * @description Sets up intersection observer for lazy image loading
 */
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, lazy loading disabled');
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
    
    console.log(`Lazy loading initialized for ${lazyImages.length} images`);
}

// =====================================
// FORM ENHANCEMENTS
// =====================================

/**
 * Initialize form enhancements
 * @description Enhances contact forms with validation and UX improvements
 */
function initializeFormEnhancements() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEnhancedFormSubmit(form);
        });
    });
    
    console.log(`Form enhancements initialized for ${forms.length} forms`);
}

/**
 * Handle enhanced form submission
 * @param {HTMLFormElement} form - The form element
 * @description Processes form submission with validation and feedback
 */
function handleEnhancedFormSubmit(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    if (!isValid) {
        // Focus first error field
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.add('success');
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
            form.reset();
        }, NAV_CONFIG.FORM_SUCCESS_DURATION);
    }, NAV_CONFIG.FORM_SUBMIT_DELAY);
}

// =====================================
// ACCESSIBILITY FEATURES
// =====================================

/**
 * Initialize accessibility features
 * @description Sets up various accessibility enhancements
 */
function initializeAccessibilityFeatures() {
    addSkipToContentLink();
    enhanceDropdownAccessibility();
    updateMenuToggleLabels();
    updateCopyrightYear();
    
    console.log('Accessibility features initialized');
}

/**
 * Add skip to content link
 * @description Creates and adds a skip link for screen readers
 */
function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color, #4F46E5);
        color: white;
        padding: 8px 12px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
        transition: top 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Enhance dropdown accessibility
 * @description Adds proper ARIA attributes to dropdown elements
 */
function enhanceDropdownAccessibility() {
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.setAttribute('role', 'menuitem');
    });
}

/**
 * Update menu toggle labels
 * @description Adds proper ARIA labels to menu toggle buttons
 */
function updateMenuToggleLabels() {
    const menuToggle = document.querySelector('.menu-btn');
    if (menuToggle && !menuToggle.getAttribute('aria-label')) {
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }
}

/**
 * Update copyright year
 * @description Updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// =====================================
// SERVICE PAGE NAVIGATION
// =====================================

/**
 * Initialize service page navigation enhancements
 * @description Enhances navigation on service pages
 */
function initializeServicePageNavigation() {
    setupBreadcrumbNavigation();
    highlightCurrentService();
    
    console.log('Service page navigation initialized');
}

/**
 * Setup breadcrumb navigation
 * @description Enhances breadcrumb links with smooth scrolling
 */
function setupBreadcrumbNavigation() {
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('#')) {
                e.preventDefault();
                const targetId = this.href.split('#')[1];
                
                // Use shared scrollToSection function if available
                if (typeof scrollToSection === 'function') {
                    scrollToSection(targetId);
                } else {
                    // Fallback smooth scroll
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        });
    });
}

/**
 * Highlight current service in navigation
 * @description Adds active class to current service navigation items
 */
function highlightCurrentService() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
    
    navLinks.forEach(link => {
        if (link.href.includes(currentPage)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

// Note: throttle function now available from shared.js 