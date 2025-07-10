/**
 * @fileoverview Marqtron Media - Shared JavaScript Functions
 * @description Core shared functionality for the Marqtron Media website
 * @version 2.0.0
 * @author Marqtron Media Development Team
 * @created 2024
 * @updated 2024
 */

'use strict';

// =====================================
// GLOBAL VARIABLES & CONSTANTS
// =====================================

/** @type {boolean} Flag to track mobile menu state */
let isMenuOpen = false;

/** @type {boolean} Flag to track header sticky state */
let isSticky = false;

/** @type {Object} Performance monitoring data */
const performanceData = {
    pageLoadTime: 0,
    interactionDelay: 0,
    resourceLoadTimes: {}
};

/** @type {Object} Configuration constants */
const CONFIG = {
    HEADER_OFFSET: 80,
    SCROLL_THRESHOLD: 100,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 250,
    THROTTLE_LIMIT: 100
};

// =====================================
// CORE INITIALIZATION
// =====================================

/**
 * Conditional logging utility for production
 * @description Only logs in development environment
 */
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const log = {
    info: (message, ...args) => isDevelopment && console.log(message, ...args),
    warn: (message, ...args) => isDevelopment && console.warn(message, ...args),
    error: (message, ...args) => isDevelopment && console.error(message, ...args)
};

/**
 * Initialize all common functionality
 * @description Main initialization function that sets up all shared features
 */
function initializeCommon() {
    try {
        // Core functionality
    initializeHeader();
    setCurrentYear();
    initializeScrollEffects();
    initializeFormValidation();
        
        // Enhanced features
    initializeImageOptimizations();
    initializeContentHierarchy();
    initializeMobileExperience();
        initializeSocialProof();
    
        // Progressive Web App features
    if ('serviceWorker' in navigator) {
        initializePWAFeatures();
    }
    
        // Mobile-specific enhancements
    addMobileSpecificStyles();
        
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Marqtron Media: All shared functionality initialized successfully');
        }
    } catch (error) {
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('Marqtron Media: Error during initialization:', error);
        }
    }
}

// =====================================
// HEADER & NAVIGATION FUNCTIONS
// =====================================

/**
 * Initialize header functionality with sticky behavior
 * @description Sets up scroll-based sticky header behavior
 */
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) {
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('Header element not found');
        }
        return;
    }
    
    const scrollHandler = throttle(() => {
        const shouldBeSticky = window.scrollY > CONFIG.SCROLL_THRESHOLD;
        
        if (shouldBeSticky && !isSticky) {
                isSticky = true;
                header.classList.add('sticky');
        } else if (!shouldBeSticky && isSticky) {
                isSticky = false;
                header.classList.remove('sticky');
            }
    }, CONFIG.THROTTLE_LIMIT);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
}

/**
 * Toggle mobile menu state
 * @description Handles mobile menu open/close functionality with accessibility
 */
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    if (!mobileMenu || !menuIcon) {
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('Mobile menu elements not found');
        }
        return;
    }
    
    if (isMenuOpen) {
        mobileMenu.classList.add('active');
        menuIcon.className = 'fas fa-times';
        menuIcon.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
    } else {
        mobileMenu.classList.remove('active');
        menuIcon.className = 'fas fa-bars';
        menuIcon.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }
}

/**
 * Smooth scroll to a specific section
 * @param {string} sectionId - The ID of the section to scroll to
 * @description Provides smooth scrolling with proper offset for fixed header
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn(`Section with ID "${sectionId}" not found`);
        }
        return;
    }
    
        const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - CONFIG.HEADER_OFFSET;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    
    // Close mobile menu if open
    if (isMenuOpen) {
        toggleMobileMenu();
    }
}

/**
 * Set current year in footer
 * @description Updates copyright year automatically
 */
function setCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
}

// Form validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10B981';
            break;
        case 'error':
            notification.style.backgroundColor = '#EF4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#F59E0B';
            break;
        default:
            notification.style.backgroundColor = '#3B82F6';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Handle form submission with enhanced validation
function handleFormSubmit(event, formType = 'contact') {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Clear previous errors
    clearFormErrors(form);
    
    // Validate form data
    const validationResult = validateForm(form, formType);
    
    if (!validationResult.isValid) {
        displayFormErrors(form, validationResult.errors);
        // Focus on first error field for accessibility
        const firstErrorField = form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.setAttribute('aria-invalid', 'true');
        }
        showNotification('Please correct the errors below', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    
    // Add loading spinner
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.prepend(spinner);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        spinner.remove();
        
        showNotification(`${capitalizeFirst(formType)} form submitted successfully!`, 'success');
        form.reset();
        
        // Remove validation states
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
            input.classList.remove('error', 'success');
        });
        
        // Analytics tracking (replace with actual analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': formType
            });
        }
        
    }, 2000);
}

// Comprehensive form validation
function validateForm(form, formType) {
    const errors = {};
    let isValid = true;
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        const fieldType = field.type;
        
        // Check if field is empty
        if (!value) {
            errors[fieldName] = `${getFieldLabel(field)} is required`;
            isValid = false;
            return;
        }
        
        // Type-specific validation
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    errors[fieldName] = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'tel':
                if (!isValidPhone(value)) {
                    errors[fieldName] = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
                
            case 'url':
                if (!isValidURL(value)) {
                    errors[fieldName] = 'Please enter a valid website URL';
                    isValid = false;
                }
                break;
                
            case 'text':
                if (fieldName.includes('name') && value.length < 2) {
                    errors[fieldName] = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
        }
        
        // Textarea minimum length
        if (field.tagName === 'TEXTAREA' && value.length < 10) {
            errors[fieldName] = 'Please provide a more detailed message (minimum 10 characters)';
            isValid = false;
        }
    });
    
    return { isValid, errors };
}

// Phone number validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\(\)\-\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// URL validation
function isValidURL(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
}

// Get field label for error messages
function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label')?.textContent;
    return label || field.placeholder || field.name || 'This field';
}

// Display form errors with accessibility
function displayFormErrors(form, errors) {
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (field) {
            const formGroup = field.closest('.form-group');
            
            // Add error class
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            // Create or update error message
            let errorElement = formGroup?.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'polite');
                formGroup?.appendChild(errorElement);
            }
            
            errorElement.textContent = errors[fieldName];
            
            // Link error message to field for screen readers
            const errorId = `${fieldName}-error`;
            errorElement.id = errorId;
            field.setAttribute('aria-describedby', errorId);
        }
    });
}

// Clear form errors
function clearFormErrors(form) {
    // Remove error classes and attributes
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
    
    // Remove error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Real-time validation on input
function initializeFormValidation() {
    document.addEventListener('input', function(e) {
        const field = e.target;
        if (field.matches('input, textarea, select')) {
            validateFieldRealTime(field);
        }
    });
    
    document.addEventListener('blur', function(e) {
        const field = e.target;
        if (field.matches('input, textarea, select')) {
            validateFieldRealTime(field);
        }
    });
}

function validateFieldRealTime(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Skip validation if field is empty (unless it's required and has been interacted with)
    if (!value && !field.required) return;
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    } else if (value) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'url':
                if (!isValidURL(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid website URL';
                }
                break;
        }
    }
    
    // Update field state
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        field.removeAttribute('aria-invalid');
        
        // Remove error message
        const errorElement = field.closest('.form-group')?.querySelector('.error-message');
        if (errorElement) errorElement.remove();
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        // Show error message
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup?.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            formGroup?.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    }
}

// Utility Functions
// =================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Generate random data for charts
function generateRandomData(length, min = 0, max = 100) {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Create smooth scroll to top
function createScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4F46E5;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide based on scroll position
    const debouncedScroll = debounce(() => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }, 100);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return scrollButton;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommon();
    createScrollToTop();
    initializeFormValidation();
    registerServiceWorker();
    initializePWAFeatures();
    initializeImageOptimizations();
    measurePerformanceMetrics();
});

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Service Worker registered successfully:', registration.scope);
            }
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            showUpdateNotification();
                        }
                    });
                });
                
                // Listen for messages from service worker
                navigator.serviceWorker.addEventListener('message', event => {
                    if (event.data.type === 'CONTENT_UPDATED') {
                        showNotification('New content available! Refresh to see updates.', 'info');
                    }
                });
                
            } catch (error) {
                // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Service Worker registration failed:', error);
            }
            }
        });
    }
}

// Show update notification
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
        <div class="update-content">
            <span>New version available!</span>
            <button onclick="updateApp()" class="update-btn">Update</button>
            <button onclick="dismissUpdate()" class="dismiss-btn">×</button>
        </div>
    `;
    
    updateBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #4F46E5, #7C3AED);
        color: white;
        padding: 1rem;
        z-index: 10001;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(updateBanner);
    
    // Animate in
    setTimeout(() => {
        updateBanner.style.transform = 'translateY(0)';
    }, 100);
}

// Update app to new version
function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// Dismiss update notification
function dismissUpdate() {
    const updateBanner = document.querySelector('.update-banner');
    if (updateBanner) {
        updateBanner.style.transform = 'translateY(-100%)';
        setTimeout(() => updateBanner.remove(), 300);
    }
}

// Enhanced offline detection
function initializeOfflineDetection() {
    function updateOnlineStatus() {
        if (navigator.onLine) {
            showNotification('You are back online!', 'success');
            // Sync any pending form submissions
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    return registration.sync.register('form-submission');
                });
            }
        } else {
            showNotification('You are offline. Some features may be limited.', 'warning');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Initialize PWA install prompt
function initializePWAInstall() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.className = 'install-app-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 50px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    showNotification('App installed successfully!', 'success');
                }
                
                deferredPrompt = null;
                installBtn.remove();
            }
        });
        
        document.body.appendChild(installBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.style.opacity = '0';
                setTimeout(() => installBtn.remove(), 300);
            }
        }, 10000);
    });
    
    // Handle app installed event
    window.addEventListener('appinstalled', () => {
        showNotification('Marqtron Media app installed!', 'success');
    });
}

// Initialize performance monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            // Measure page load performance
            const perfData = performance.getEntriesByType('navigation')[0];
            
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                
                // Log performance metrics (replace with actual analytics)
                // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Performance Metrics:', {
                    loadTime: Math.round(loadTime),
                    domContentLoaded: Math.round(domContentLoaded),
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
                    firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
                });
                
                // Track Core Web Vitals
                if ('web-vitals' in window) {
                    // Implementation would use web-vitals library
                    // getCLS(sendToAnalytics);
                    // getFID(sendToAnalytics);
                    // getLCP(sendToAnalytics);
                }
            }
        });
    }
}

// Initialize all PWA and performance features
function initializePWAFeatures() {
    initializeOfflineDetection();
    initializePWAInstall();
    initializePerformanceMonitoring();
}

// Enhanced Lazy Loading and Image Optimization
// =============================================

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    optimizeAllImages();
    setupImageErrorHandling();
    addImageLoadingAnimations();
});

// Lazy Loading Implementation
function initializeLazyLoading() {
    const images = document.querySelectorAll('img');
    
    // Add lazy loading attributes to all images
    images.forEach((img, index) => {
        // Skip images already processed or critical images
        if (img.hasAttribute('loading') || img.classList.contains('critical-img')) {
            return;
        }
        
        // Add lazy loading attribute
        img.setAttribute('loading', 'lazy');
        
        // Add optimization classes
        img.classList.add('img-optimized', 'perf-img');
        
        // Add proper dimensions if missing
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            const isHeroImage = img.closest('.hero-image-container, .overview-image');
            const isServiceImage = img.closest('.service-image-container, .service-content');
            
            if (isHeroImage) {
                img.setAttribute('width', '600');
                img.setAttribute('height', '400');
            } else if (isServiceImage) {
                img.setAttribute('width', '400');
                img.setAttribute('height', '300');
            } else {
                img.setAttribute('width', '500');
                img.setAttribute('height', '300');
            }
        }
        
        // Add staggered animation delay
        img.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Use Intersection Observer for advanced lazy loading
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    }
}

// Advanced Intersection Observer for smooth loading
function setupIntersectionObserver() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading animation
                img.classList.add('animate-image-load');
                
                // Handle load event
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.classList.remove('img-loading');
                }, { once: true });
                
                // Add loading state
                img.classList.add('img-loading');
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Optimize all images for performance
function optimizeAllImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add responsive behavior
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        // Add smooth transitions
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease';
        
        // Optimize hero images
        if (img.closest('.hero, .hero-image-container')) {
            img.classList.add('hero-img-optimized');
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
        }
        
        // Optimize service images
        if (img.closest('.service-card, .content-service-card, .case-study-card')) {
            img.classList.add('service-img-optimized');
            img.style.objectFit = 'cover';
            img.style.borderRadius = '0.5rem';
        }
        
        // Add hover effects for interactive images
        if (img.closest('.gallery, .portfolio, .case-study')) {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
                img.style.filter = 'brightness(1.1)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.filter = 'brightness(1)';
            });
        }
    });
}

// Image Error Handling
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.style.width = this.style.width || '100%';
            placeholder.style.height = this.style.height || '200px';
            placeholder.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-image" style="font-size: 2rem; color: #999; margin-bottom: 0.5rem;"></i>
                    <br>
                    <span style="color: #666; font-size: 0.875rem;">Image temporarily unavailable</span>
                </div>
            `;
            
            // Replace failed image with placeholder
            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

// Add loading animations
function addImageLoadingAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .img-loading::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
            animation: shimmer 1.5s infinite;
            z-index: 1;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .hero-img-optimized {
            filter: brightness(0.95) contrast(1.05);
            transition: filter 0.3s ease;
        }
        
        .hero-img-optimized:hover {
            filter: brightness(1) contrast(1.1);
        }
        
        .service-img-optimized {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        
        .service-img-optimized:hover {
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Progressive JPEG/WebP Loading
function addProgressiveImageSupport() {
    // Check for WebP support
    function supportsWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    supportsWebP().then(supported => {
        document.documentElement.classList.add(supported ? 'webp' : 'no-webp');
        
        // Update image sources if WebP is supported
        if (supported) {
            const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]');
            images.forEach(img => {
                const webpSrc = img.src.replace(/\.(jpg|png)/, '.webp');
                
                // Test if WebP version exists
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = webpSrc;
                };
                testImg.src = webpSrc;
            });
        }
    });
}

// Performance Monitoring
function monitorImagePerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'img') {
                    // Log slow loading images
                    if (entry.duration > 2000) {
                        console.warn(`Slow loading image: ${entry.name} took ${entry.duration}ms`);
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }
}

// Image Preloading for Critical Images
function preloadCriticalImages() {
    const criticalImages = [
        // Add paths to critical images that should load immediately
        '/images/hero-bg.jpg',
        '/images/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Responsive Image Optimization
function optimizeForViewport() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add srcset for responsive images
        if (!img.hasAttribute('srcset') && img.src.includes('readdy.ai')) {
            const baseSrc = img.src;
            const srcset = [
                `${baseSrc}&width=400 400w`,
                `${baseSrc}&width=800 800w`,
                `${baseSrc}&width=1200 1200w`
            ].join(', ');
            
            img.setAttribute('srcset', srcset);
            img.setAttribute('sizes', '(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px');
        }
    });
}

// Initialize all optimizations
function initializeImageOptimizations() {
    initializeLazyLoading();
    optimizeAllImages();
    setupImageErrorHandling();
    addImageLoadingAnimations();
    addProgressiveImageSupport();
    optimizeForViewport();
    preloadCriticalImages();
    
    // Monitor performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        monitorImagePerformance();
    }
}

// Export functions for use in other scripts
window.imageOptimizer = {
    init: initializeImageOptimizations,
    lazyLoad: initializeLazyLoading,
    optimize: optimizeAllImages,
    monitor: monitorImagePerformance
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageOptimizations);
} else {
    initializeImageOptimizations();
}

// Performance monitoring enhancements
function measurePerformanceMetrics() {
    if ('performance' in window) {
        // Core Web Vitals simulation
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            }
        });
        
        observer.observe({entryTypes: ['largest-contentful-paint', 'first-input']});
    }
}

// Critical CSS inline optimization
function optimizeCriticalCSS() {
    // Move non-critical CSS to load after page load
    const nonCriticalCSS = document.createElement('link');
    nonCriticalCSS.rel = 'stylesheet';
    nonCriticalCSS.href = 'non-critical.css';
    nonCriticalCSS.media = 'print';
    nonCriticalCSS.onload = function() {
        this.media = 'all';
    };
    
    // Append after critical content loads
    window.addEventListener('load', () => {
        document.head.appendChild(nonCriticalCSS);
    });
}

// Progressive Content Disclosure Functions
// ========================================

// Toggle expandable content sections
function toggleExpandContent(contentId, button) {
    const content = document.getElementById(contentId);
    if (!content || !button) return;
    
    const isExpanded = !content.classList.contains('content-collapsed');
    const buttonText = button.querySelector('span');
    const buttonIcon = button.querySelector('i');
    
    if (isExpanded) {
        // Collapse content
        content.classList.add('content-collapsed');
        content.style.maxHeight = '200px';
        
        if (buttonText) {
            // Determine appropriate "view more" text based on content type
            if (contentId.includes('services')) {
                buttonText.textContent = 'View All Services';
            } else if (contentId.includes('features')) {
                buttonText.textContent = 'View All Features';
            } else {
                buttonText.textContent = 'Show More';
            }
        }
        
        if (buttonIcon) {
            buttonIcon.style.transform = 'rotate(0deg)';
        }
        
        button.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
        
        // Smooth scroll to button for better UX
        setTimeout(() => {
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
    } else {
        // Expand content
        content.classList.remove('content-collapsed');
        
        // Calculate and set the full height
        const fullHeight = content.scrollHeight;
        content.style.maxHeight = fullHeight + 'px';
        
        if (buttonText) {
            buttonText.textContent = 'Show Less';
        }
        
        if (buttonIcon) {
            buttonIcon.style.transform = 'rotate(180deg)';
        }
        
        button.classList.add('expanded');
        button.setAttribute('aria-expanded', 'true');
    }
    
    // Add smooth transition effect
    content.addEventListener('transitionend', function handleTransition() {
        if (!content.classList.contains('content-collapsed')) {
            // Remove fixed height after expansion for responsive behavior
            content.style.maxHeight = 'none';
        }
        content.removeEventListener('transitionend', handleTransition);
    });
    
    // Analytics tracking for content engagement
    if (typeof gtag !== 'undefined') {
        gtag('event', 'content_interaction', {
            'event_category': 'engagement',
            'event_label': contentId,
            'value': isExpanded ? 0 : 1 // 0 for collapse, 1 for expand
        });
    }
}

// Initialize progressive disclosure on page load
function initializeProgressiveDisclosure() {
    // Set up expand buttons
    const expandButtons = document.querySelectorAll('.expand-button');
    
    expandButtons.forEach(button => {
        // Add accessibility attributes
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('role', 'button');
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
        
        // Ensure button is focusable
        if (!button.hasAttribute('tabindex')) {
            button.setAttribute('tabindex', '0');
        }
    });
    
    // Initialize content sections
    const collapsedContent = document.querySelectorAll('.content-collapsed');
    collapsedContent.forEach(content => {
        // Ensure proper initial state
        content.style.maxHeight = '200px';
        content.style.overflow = 'hidden';
    });
    
    // Add intersection observer for content sections
    if ('IntersectionObserver' in window) {
        observeContentSections();
    }
}

// Observe content sections for analytics and performance
function observeContentSections() {
    const contentSections = document.querySelectorAll('.content-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in animation
                entry.target.classList.add('content-fade-in');
                
                // Track section visibility for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        'event_category': 'engagement',
                        'event_label': entry.target.id || entry.target.className
                    });
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Content priority loading based on viewport
function prioritizeContentLoading() {
    const highPriorityContent = document.querySelectorAll('.content-priority-high');
    const mediumPriorityContent = document.querySelectorAll('.content-priority-medium');
    const lowPriorityContent = document.querySelectorAll('.content-priority-low');
    
    // Show high priority content immediately
    highPriorityContent.forEach((content, index) => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Delay medium priority content
    setTimeout(() => {
        mediumPriorityContent.forEach((content, index) => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 300);
    
    // Further delay low priority content
    setTimeout(() => {
        lowPriorityContent.forEach((content, index) => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 600);
}

// Reset all expanded content (useful for tab switching)
function resetExpandedContent() {
    const expandableContent = document.querySelectorAll('.content-expandable');
    const expandButtons = document.querySelectorAll('.expand-button');
    
    expandableContent.forEach(content => {
        content.classList.add('content-collapsed');
        content.style.maxHeight = '200px';
    });
    
    expandButtons.forEach(button => {
        button.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
        
        const span = button.querySelector('span');
        const icon = button.querySelector('i');
        
        if (span) {
            const contentId = button.getAttribute('onclick')?.match(/['"]([^'"]+)['"]/)?.[1];
            if (contentId?.includes('services')) {
                span.textContent = 'View All Services';
            } else if (contentId?.includes('features')) {
                span.textContent = 'View All Features';
            } else {
                span.textContent = 'Show More';
            }
        }
        
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

// Enhanced content block interactions
function enhanceContentBlocks() {
    const contentBlocks = document.querySelectorAll('.content-block');
    
    contentBlocks.forEach(block => {
        // Add hover enhancement
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-2px)';
            block.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.transform = 'translateY(0)';
            block.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
        
        // Add focus support for accessibility
        block.addEventListener('focus', () => {
            block.style.outline = '2px solid var(--primary-color)';
            block.style.outlineOffset = '2px';
        });
        
        block.addEventListener('blur', () => {
            block.style.outline = 'none';
        });
    });
}

// Benefit cards animation
function enhanceBenefitCards() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach((card, index) => {
        // Stagger initial animations
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Mobile-specific optimizations for content hierarchy
function optimizeContentForMobile() {
    if (window.innerWidth <= 768) {
        // Reduce animation delays on mobile
        const animatedElements = document.querySelectorAll('[style*="animation-delay"]');
        animatedElements.forEach(element => {
            element.style.animationDelay = '0.1s';
        });
        
        // Simplify hover effects on mobile (use touch events instead)
        const interactiveElements = document.querySelectorAll('.benefit-card, .content-block, .feature-item-simplified');
        interactiveElements.forEach(element => {
            // Remove hover effects on mobile
            element.style.transition = 'none';
            
            // Add touch feedback
            element.addEventListener('touchstart', () => {
                element.style.opacity = '0.9';
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            });
        });
        
        // Adjust collapsed content height for mobile
        const collapsedContent = document.querySelectorAll('.content-collapsed');
        collapsedContent.forEach(content => {
            content.style.maxHeight = '150px'; // Smaller on mobile
        });
    }
}

// Initialize all content hierarchy features
function initializeContentHierarchy() {
    initializeProgressiveDisclosure();
    prioritizeContentLoading();
    enhanceContentBlocks();
    enhanceBenefitCards();
    optimizeContentForMobile();
    
    // Re-optimize on window resize
    window.addEventListener('resize', debounce(optimizeContentForMobile, 300));
}

// Export functions for global use
window.contentHierarchy = {
    toggle: toggleExpandContent,
    reset: resetExpandedContent,
    init: initializeContentHierarchy,
    prioritize: prioritizeContentLoading
};

// Enhanced Mobile Experience & Touch Optimization
// ==============================================

// Mobile Detection and Optimization
const isMobile = window.innerWidth <= 768;
const isTouch = 'ontouchstart' in window;

// Initialize mobile optimizations
function initializeMobileExperience() {
    if (isMobile || isTouch) {
        optimizeMobileNavigation();
        enhanceTouchInteractions();
        optimizeMobileCharts();
        setupMobileSwipeGestures();
        optimizeMobileForms();
        addMobileScrollOptimizations();
    }
    
    // Mobile-specific performance optimizations
    optimizeMobilePerformance();
}

// Enhanced Mobile Navigation
function optimizeMobileNavigation() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !menuToggle) return;
    
    // Add swipe to close functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    mobileMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        
        // Swipe right to close menu
        if (touchEndX - touchStartX > 100) {
            toggleMobileMenu();
        }
    });
    
    // Prevent body scroll when menu is open
    const originalToggle = window.toggleMobileMenu;
    window.toggleMobileMenu = function() {
        originalToggle();
        
        const isMenuOpen = mobileMenu.classList.contains('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        document.body.style.position = isMenuOpen ? 'fixed' : '';
        document.body.style.width = isMenuOpen ? '100%' : '';
    };
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Add service submenu functionality for mobile
    const serviceLinks = document.querySelectorAll('.mobile-service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add haptic feedback if supported
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Touch Interaction Enhancements
function enhanceTouchInteractions() {
    // Add touch feedback to all interactive elements
    const touchElements = document.querySelectorAll('.btn, .card, .tab-button, .expand-button');
    
    touchElements.forEach(element => {
        // Add touch classes for styling
        element.classList.add('touch-interactive');
        
        // Touch start feedback
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
            
            // Create ripple effect
            createRippleEffect(this, e.touches[0]);
        });
        
        // Touch end cleanup
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
        
        // Touch cancel cleanup
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // Optimize button sizes for touch
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.offsetHeight < 44) {
            btn.style.minHeight = '44px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
        }
    });
}

// Create Material Design Ripple Effect
function createRippleEffect(element, touch) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = touch.clientX - rect.left - size / 2;
    const y = touch.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Mobile Chart Optimizations
function optimizeMobileCharts() {
    const charts = document.querySelectorAll('[id*="Chart"], [id*="chart"]');
    
    charts.forEach(chartElement => {
        if (chartElement && window.echarts) {
            const chartInstance = echarts.getInstanceByDom(chartElement);
            
            if (chartInstance) {
                // Mobile-specific chart options
                const mobileOption = {
                    animation: false, // Disable animations for performance
                    textStyle: {
                        fontSize: 12
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 0,
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: '15%',
                        bottom: '25%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        confine: true,
                        textStyle: {
                            fontSize: 12
                        }
                    }
                };
                
                chartInstance.setOption(mobileOption, true);
                
                // Add touch gestures for chart interaction
                let startTouch = null;
                let currentZoom = 1;
                
                chartElement.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 2) {
                        e.preventDefault();
                        startTouch = {
                            distance: getTouchDistance(e.touches[0], e.touches[1]),
                            zoom: currentZoom
                        };
                    }
                });
                
                chartElement.addEventListener('touchmove', (e) => {
                    if (e.touches.length === 2 && startTouch) {
                        e.preventDefault();
                        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
                        const zoomFactor = currentDistance / startTouch.distance;
                        currentZoom = startTouch.zoom * zoomFactor;
                        
                        // Apply zoom to chart (simplified)
                        if (currentZoom > 0.5 && currentZoom < 3) {
                            chartInstance.dispatchAction({
                                type: 'dataZoom',
                                start: Math.max(0, 50 - (currentZoom * 25)),
                                end: Math.min(100, 50 + (currentZoom * 25))
                            });
                        }
                    }
                });
            }
        }
    });
}

// Get distance between two touch points
function getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Mobile Swipe Gestures for Carousels
function setupMobileSwipeGestures() {
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(carousel => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let currentSlide = 0;
        const slides = carousel.querySelectorAll('.premium-card');
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            carousel.style.transition = 'none';
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            // Apply transform for visual feedback
            carousel.style.transform = `translateX(${deltaX}px)`;
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            carousel.style.transition = 'transform 0.3s ease';
            
            const deltaX = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && currentSlide > 0) {
                    currentSlide--;
                } else if (deltaX < 0 && currentSlide < slides.length - 1) {
                    currentSlide++;
                }
            }
            
            // Reset transform and trigger slide change
            carousel.style.transform = 'translateX(0)';
            
            // Trigger carousel navigation if function exists
            if (window.setActiveService) {
                window.setActiveService(currentSlide);
            }
        });
    });
}

// Mobile Form Optimizations
function optimizeMobileForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevent zoom on focus for iOS
            if (input.type !== 'file') {
                input.style.fontSize = '16px';
            }
            
            // Add mobile-friendly input modes
            switch (input.type) {
                case 'email':
                    input.setAttribute('inputmode', 'email');
                    break;
                case 'tel':
                    input.setAttribute('inputmode', 'tel');
                    break;
                case 'url':
                    input.setAttribute('inputmode', 'url');
                    break;
                case 'number':
                    input.setAttribute('inputmode', 'numeric');
                    break;
            }
            
            // Add autocomplete attributes
            if (input.name.includes('email')) {
                input.setAttribute('autocomplete', 'email');
            } else if (input.name.includes('name')) {
                input.setAttribute('autocomplete', 'name');
            } else if (input.name.includes('phone')) {
                input.setAttribute('autocomplete', 'tel');
            }
            
            // Mobile-specific validation feedback
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.add('valid');
                    this.classList.remove('invalid');
                } else {
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                }
            });
        });
        
        // Mobile form submission with loading state
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Add haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
            }
        });
    });
}

// Mobile Scroll Optimizations
function addMobileScrollOptimizations() {
    // Smooth scroll polyfill for older mobile browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        const scrollToSection = function(targetId) {
            const target = document.getElementById(targetId);
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const progressPercentage = Math.min(progress / duration, 1);
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic(progressPercentage));
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        };
        
        // Override global scrollToSection for mobile
        window.scrollToSection = scrollToSection;
    }
    
    // Add scroll-based animations optimization
    const scrollElements = document.querySelectorAll('.content-section');
    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -20% 0px'
        }
    );
    
    scrollElements.forEach(el => scrollObserver.observe(el));
}

// Easing function for smooth scroll
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Mobile Performance Optimizations
function optimizeMobilePerformance() {
    // Disable hover effects on touch devices
    if (isTouch) {
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .service-card:hover,
                .feature-card:hover,
                .benefit-card:hover,
                .content-block:hover {
                    transform: none !important;
                    box-shadow: initial !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (isMobile) {
            // Add loading="lazy" if not already set
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimize image quality for mobile
            if (img.src.includes('readdy.ai')) {
                const mobileWidth = Math.min(window.innerWidth * 2, 800);
                img.src = img.src.replace(/width=\d+/, `width=${mobileWidth}`);
            }
        }
    });
    
    // Throttle resize events for mobile
    let resizeTimeout;
    const originalResize = window.addEventListener;
    window.addEventListener('resize', function(callback) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(callback, 250);
    });
}

// Mobile-specific tab navigation
function enhanceMobileTabNavigation() {
    const tabNavigations = document.querySelectorAll('.tab-navigation');
    
    tabNavigations.forEach(nav => {
        const tabs = nav.querySelectorAll('.tab-button');
        let activeTab = nav.querySelector('.tab-button.active');
        
        if (activeTab && isMobile) {
            // Scroll active tab into view
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
        
        // Add swipe navigation between tabs
        let touchStartX = 0;
        const tabContent = document.querySelector('.tab-content.active');
        
        if (tabContent) {
            tabContent.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            tabContent.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;
                
                if (Math.abs(deltaX) > 100) {
                    const currentIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));
                    let nextIndex;
                    
                    if (deltaX > 0 && currentIndex > 0) {
                        nextIndex = currentIndex - 1;
                    } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
                        nextIndex = currentIndex + 1;
                    }
                    
                    if (nextIndex !== undefined) {
                        tabs[nextIndex].click();
                    }
                }
            });
        }
    });
}

// Initialize mobile experience features
function initializeMobileFeatures() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileExperience);
    } else {
        initializeMobileExperience();
    }
    
    // Re-initialize on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(initializeMobileExperience, 300);
    });
}

// Auto-initialize mobile features
initializeMobileFeatures();

// Export mobile functions
window.mobileOptimizer = {
    init: initializeMobileExperience,
    navigation: optimizeMobileNavigation,
    touch: enhanceTouchInteractions,
    charts: optimizeMobileCharts,
    forms: optimizeMobileForms
};

// Add mobile-specific CSS animations and styles
function addMobileSpecificStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .touch-interactive.touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
        
        @media (max-width: 768px) {
            .animate-in {
                animation-duration: 0.4s;
                animation-fill-mode: forwards;
            }
            
            .content-priority-high {
                animation-delay: 0.1s;
            }
            
            .content-priority-medium {
                animation-delay: 0.2s;
            }
            
            .content-priority-low {
                animation-delay: 0.3s;
            }
        }
        
        /* Mobile input validation styles */
        .form-group input.valid,
        .form-group textarea.valid {
            border-color: #10B981;
            background-color: #F0FDF4;
        }
        
        .form-group input.invalid,
        .form-group textarea.invalid {
            border-color: #EF4444;
            background-color: #FEF2F2;
        }
    `;
    document.head.appendChild(style);
}

// Statistics Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const animateStat = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const text = element.textContent;
        const suffix = text.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 60; // 60 frames for smooth animation
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current) + suffix;
        }, 16); // ~60fps
    };
    
    // Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateStat(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Testimonial Carousel Enhancement
function enhanceTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach((card, index) => {
        // Add subtle animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover interaction
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-4px) scale(1)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Trust Badge Animation
function animateTrustBadges() {
    const badges = document.querySelectorAll('.trust-badge');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.3
    });
    
    badges.forEach(badge => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px) scale(0.9)';
        badge.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(badge);
    });
}

// Client Logo Hover Effect
function enhanceClientLogos() {
    const logos = document.querySelectorAll('.client-logo');
    
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = logo.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width - size) / 2 + 'px';
            ripple.style.top = (rect.height - size) / 2 + 'px';
            
            logo.style.position = 'relative';
            logo.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Case Study Results Animation
function animateCaseStudyResults() {
    const resultMetrics = document.querySelectorAll('.result-metric');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    const resultValue = entry.target.querySelector('.result-value');
                    resultValue.style.animation = 'bounceIn 0.8s ease-out forwards';
                    
                    // Add counter animation for numbers
                    const text = resultValue.textContent;
                    const number = text.match(/\d+/);
                    if (number) {
                        const target = parseInt(number[0]);
                        const suffix = text.replace(/\d+/, '');
                        let current = 0;
                        const increment = target / 30;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            resultValue.textContent = Math.floor(current) + suffix;
                        }, 30);
                    }
                }, index * 150);
            }
        });
    }, {
        threshold: 0.5
    });
    
    resultMetrics.forEach(metric => {
        observer.observe(metric);
    });
    
    // Add bounce animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Rating Bars Animation
function animateRatingBars() {
    const ratingBars = document.querySelectorAll('.rating-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.style.width;
                fill.style.width = '0%';
                fill.style.transition = 'width 1.5s ease-out';
                
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 200);
            }
        });
    }, {
        threshold: 0.5
    });
    
    ratingBars.forEach(bar => observer.observe(bar));
}

// Testimonial Rating Stars Animation
function animateTestimonialStars() {
    const ratings = document.querySelectorAll('.testimonial-rating');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stars = entry.target.querySelectorAll('.star');
                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.animation = 'starGlow 0.5s ease-out forwards';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    ratings.forEach(rating => observer.observe(rating));
    
    // Add star glow animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starGlow {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        .star {
            transition: all 0.3s ease;
        }
        .star:hover {
            transform: scale(1.2);
            filter: drop-shadow(0 0 8px #fbbf24);
        }
    `;
    document.head.appendChild(style);
}

// Social Proof Parallax Effect
function addSocialProofParallax() {
    const socialSections = document.querySelectorAll('.stats-showcase, .testimonials-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        socialSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.5;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrolled * speed);
                const bgElement = section.querySelector('::before') || section;
                if (bgElement.style) {
                    bgElement.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    });
}

// Credibility Items Stagger Animation
function animateCredibilityItems() {
    const credibilityItems = document.querySelectorAll('.credibility-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.parentNode.querySelectorAll('.credibility-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    // Initialize styles and observe first item only to trigger all
    credibilityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease-out';
        
        if (index === 0) {
            observer.observe(item);
        }
    });
}

// Interactive Badge Tooltips
function addBadgeTooltips() {
    const badges = document.querySelectorAll('.trust-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            const badgeText = badge.querySelector('.badge-text').textContent;
            const subText = badge.querySelector('.badge-subtext').textContent;
            
            tooltip.innerHTML = `
                <strong>${badgeText}</strong><br>
                ${subText}
            `;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.4;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            
            badge.style.position = 'relative';
            badge.appendChild(tooltip);
            
            const rect = badge.getBoundingClientRect();
            tooltip.style.left = '50%';
            tooltip.style.bottom = '100%';
            tooltip.style.marginBottom = '8px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });
        
        badge.addEventListener('mouseleave', () => {
            const tooltip = badge.querySelector('div[style*="position: absolute"]');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        });
    });
}

// Initialize all social proof enhancements
function initializeSocialProof() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSocialProof);
        return;
    }
    
    animateStats();
    enhanceTestimonials();
    animateTrustBadges();
    enhanceClientLogos();
    animateCaseStudyResults();
    animateRatingBars();
    animateTestimonialStars();
    addSocialProofParallax();
    animateCredibilityItems();
    addBadgeTooltips();
}

// Auto-initialize
initializeSocialProof(); 

// =====================================
// SHARED CHART UTILITIES
// =====================================

// Generate random data for charts (moved from individual files)
function generateSharedRandomData(length, min = 0, max = 100) {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Standard chart options template
function getStandardChartOptions(title, data, series) {
    return {
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: Object.keys(series),
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        title: {
            text: title,
            left: 'center'
        },
        ...data,
        series: Object.entries(series).map(([name, config]) => ({
            name,
            ...config
        }))
    };
}

// Initialize a basic chart
function initializeSharedChart(elementId, options) {
    const chartElement = document.getElementById(elementId);
    if (!chartElement || typeof echarts === 'undefined') {
        console.warn(`Chart element ${elementId} not found or ECharts not loaded`);
        return null;
    }

    const chart = echarts.init(chartElement);
    chart.setOption(options);

    // Make chart responsive
    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return chart;
}

// Sparkline chart utility
function createSharedSparkline(elementId, data, color = '#4F46E5') {
    const options = {
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        xAxis: {
            type: 'category',
            show: false,
            data: Array.from({length: data.length}, (_, i) => i)
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: color,
                width: 2
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: `${color}30`
                    }, {
                        offset: 1, color: `${color}10`
                    }]
                }
            }
        }]
    };

    return initializeSharedChart(elementId, options);
}

// Performance metrics chart template
function createPerformanceChart(elementId, labels, datasets) {
    const options = {
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: datasets.map(d => d.name),
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: labels
        },
        yAxis: {
            type: 'value'
        },
        series: datasets.map(dataset => ({
            name: dataset.name,
            type: 'line',
            smooth: true,
            data: dataset.data,
            itemStyle: { color: dataset.color }
        }))
    };

    return initializeSharedChart(elementId, options);
}

// Social media chart template
function createSocialMediaChart(elementId, platforms, metrics) {
    const options = {
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: Object.keys(metrics)
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: platforms
        },
        yAxis: {
            type: 'value'
        },
        series: Object.entries(metrics).map(([name, data], index) => {
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
            return {
                name: name,
                type: index < 3 ? 'bar' : 'line',
                data: data,
                color: colors[index % colors.length]
            };
        })
    };

    return initializeSharedChart(elementId, options);
}

// Get last N days for charts
function getLastNDays(n = 30) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
}

// SEO Chart template
function createSEOChart(elementId) {
    const options = {
        animation: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Organic Traffic', 'Keyword Rankings', 'Backlinks', 'Conversion Rate']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Organic Traffic',
                type: 'line',
                data: [1200, 1800, 2500, 3200, 4100, 5200],
                color: '#4F46E5'
            },
            {
                name: 'Keyword Rankings',
                type: 'line',
                data: [15, 28, 45, 67, 89, 120],
                color: '#10B981'
            },
            {
                name: 'Backlinks',
                type: 'bar',
                data: [50, 120, 200, 350, 520, 750],
                color: '#F59E0B'
            },
            {
                name: 'Conversion Rate',
                type: 'line',
                data: [1.2, 1.8, 2.3, 2.9, 3.5, 4.2],
                color: '#EF4444'
            }
        ]
    };

    return initializeSharedChart(elementId, options);
}

// Content Marketing Chart template  
function createContentChart(elementId) {
    const options = {
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Organic Traffic', 'Engagement', 'Conversion Rate'],
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Organic Traffic',
                type: 'bar',
                data: [120, 180, 250, 320, 400, 520],
                color: '#4F46E5'
            },
            {
                name: 'Engagement',
                type: 'bar',
                data: [80, 120, 180, 240, 300, 380],
                color: '#10B981'
            },
            {
                name: 'Conversion Rate',
                type: 'line',
                data: [5, 8, 12, 18, 24, 32],
                color: '#F59E0B'
            }
        ]
    };

    return initializeSharedChart(elementId, options);
}

// Export chart utilities for global use
window.chartUtils = {
    init: initializeSharedChart,
    sparkline: createSharedSparkline,
    performance: createPerformanceChart,
    socialMedia: createSocialMediaChart,
    seo: createSEOChart,
    content: createContentChart,
    data: generateSharedRandomData,
    dates: getLastNDays
}; 