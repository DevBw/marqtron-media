// Marqtron Media - Clean & Minimal JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Marqtron Media: Website initialized');
    
    // Initialize all functionality
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeHeaderScroll();
    initializeHeroVideo();
    
    console.log('✅ All functionality loaded successfully');
});

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.menu-btn');
    const icon = menuBtn.querySelector('i');
    
    if (mobileMenu.classList.contains('active')) {
        // Close menu
        mobileMenu.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars-staggered');
    } else {
        // Open menu
        mobileMenu.classList.add('active');
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-times');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuToggle) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// ========================================
// SMOOTH SCROLLING
// ========================================
function initializeSmoothScrolling() {
    // Handle navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// HEADER SCROLL EFFECTS
// ========================================
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            // Add shadow when scrolled
            if (currentScrollY > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                header.style.background = 'rgba(255,255,255,0.98)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(255,255,255,0.95)';
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================================
// HERO VIDEO HANDLING
// ========================================
function initializeHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        console.log('🎥 Hero video element found');
        
        // Handle video load events
        heroVideo.addEventListener('loadstart', function() {
            console.log('📹 Video loading started');
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('✅ Video can start playing');
        });
        
        heroVideo.addEventListener('error', function(e) {
            console.error('❌ Video error:', e);
            console.log('Using fallback background');
        });
        
        heroVideo.addEventListener('loadeddata', function() {
            console.log('📺 Video data loaded');
        });
        
        // Try to play the video if autoplay fails
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented, video will play when user interacts');
            });
        }
    } else {
        console.log('❌ Hero video element not found');
    }
}

// ========================================
// FORM HANDLING
// ========================================
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Add form validation styling
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('focus', clearFieldError);
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate form
    if (!validateForm(form)) {
        return false;
    }
    
    // Update button state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success feedback
        showFormSuccess('Thank you! We\'ll be in touch soon.');
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track form submission (if analytics available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'contact_form'
            });
        }
        
    }, 1500);
    
    return false;
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
    } else {
        clearFieldError(field);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    field.style.backgroundColor = '#fef2f2';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target || event;
    
    field.style.borderColor = '';
    field.style.backgroundColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormSuccess(message) {
    // Remove any existing success message
    const existingSuccess = document.querySelector('.form-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
        background: #f0fdf4;
        border: 1px solid #16a34a;
        color: #15803d;
        padding: 1rem;
        border-radius: 0.375rem;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
    `;
    successDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Throttle function for performance
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
    
    // Handle Enter key on buttons that aren't form submits
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON' && e.target.type !== 'submit') {
        e.target.click();
    }
});

// ========================================
// CONSOLE BRANDING
// ========================================
console.log(`
%c🚀 Marqtron Media
%cDigital Marketing That Delivers Results

Built with clean, minimal code for optimal performance.
`, 
'color: #c7b345; font-size: 24px; font-weight: bold;',
'color: #2c3e50; font-size: 14px; margin-top: 5px;'
); 