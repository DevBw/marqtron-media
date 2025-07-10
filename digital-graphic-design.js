/**
 * @fileoverview Digital Graphic Design Service Page
 * @description JavaScript functionality for digital graphic design service features
 * @version 2.0.0
 * @author Marqtron Media Development Team
 * @created 2024
 * @updated 2024
 * @requires shared.js - Uses centralized utilities from shared functions
 */

'use strict';

// =====================================
// CONFIGURATION & CONSTANTS
// =====================================

/** @type {Object} Configuration constants for design features */
const DESIGN_CONFIG = {
    TESTIMONIAL_CAROUSEL_INTERVAL: 5000,
    DESIGN_CAROUSEL_INTERVAL: 6000,
    PORTFOLIO_ANIMATION_DELAY: 300,
    TOTAL_TESTIMONIALS: 3,
    TOTAL_DESIGN_TYPES: 3
};

// =====================================
// STATE VARIABLES
// =====================================

/** @type {string} Current active portfolio filter */
let activePortfolioFilter = 'all';

/** @type {number} Current active testimonial index */
let activeTestimonial = 0;

/** @type {number|null} Testimonial carousel interval ID */
let testimonialInterval = null;

/** @type {Object|null} Design analytics chart instance */
let designChart = null;

/** @type {number} Current active design type index */
let activeDesignType = 0;

/** @type {number|null} Design carousel interval ID */
let designInterval = null;

// =====================================
// TESTIMONIAL DATA
// =====================================

/** @type {Array<Object>} Testimonial data */
const TESTIMONIALS = [
        {
            quote: "The team at Marqtron Media completely transformed our brand identity. The logo and visual system they created perfectly captures our company's values and has significantly improved our brand recognition. Working with them was a seamless experience from start to finish.",
            author: "Emily Chen",
            company: "Founder, Bloom Cosmetics",
            image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20female%20entrepreneur%20in%20her%2030s%20with%20business%20casual%20attire%20against%20neutral%20background%2C%20warm%20lighting%20and%20friendly%20expression%2C%20corporate%20portrait%20style&width=100&height=100&seq=testimonial1&orientation=squarish",
            rating: 5
        },
        {
            quote: "Our social media presence has completely transformed since working with Marqtron's design team. The custom graphics and templates they created have doubled our engagement rates and given our brand a cohesive, professional look that stands out from competitors.",
            author: "Marcus Johnson",
            company: "Marketing Director, TechSphere",
            image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20African%20American%20male%20marketing%20executive%20in%20his%2040s%20wearing%20business%20attire%20against%20neutral%20background%2C%20warm%20lighting%20and%20confident%20expression%2C%20corporate%20portrait%20style&width=100&height=100&seq=testimonial2&orientation=squarish",
            rating: 5
        },
        {
            quote: "The infographics and presentation materials designed by Marqtron Media have been game-changers for our company. They transformed complex data into visually compelling stories that our clients can easily understand. The ROI on these designs has been exceptional.",
            author: "Sarah Williams",
            company: "CEO, DataVision Analytics",
            image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Caucasian%20female%20CEO%20in%20her%2050s%20with%20business%20formal%20attire%20against%20neutral%20background%2C%20warm%20lighting%20and%20authoritative%20expression%2C%20corporate%20portrait%20style&width=100&height=100&seq=testimonial3&orientation=squarish",
            rating: 5
        }
    ];
    
// =====================================
// DESIGN TYPES DATA
// =====================================

/** @type {Array<Object>} Design types data */
const DESIGN_TYPES = [
        {
            type: "Brand Identity Design",
            description: "Comprehensive brand identity packages including logos, color palettes, typography, and brand guidelines",
            services: [
                "Logo design and variations",
                "Color palette development",
                "Typography selection",
                "Brand style guide creation",
                "Business card and stationery design"
            ],
            deliverables: [
                "Primary and secondary logos",
                "Brand color palette",
                "Typography system",
                "Brand guidelines document",
                "Stationery suite"
            ],
            metrics: {
                recognition: "+89%",
                consistency: "+95%",
                engagement: "+67%"
            }
        },
        {
            type: "Marketing Materials",
            description: "High-impact marketing collateral designed to drive conversions and brand awareness",
            services: [
                "Social media graphics",
                "Print advertisements",
                "Email marketing templates",
                "Brochures and flyers",
                "Banner and display ads"
            ],
            deliverables: [
                "Social media template library",
                "Print-ready advertisements",
                "Email template system",
                "Marketing collateral suite",
                "Digital ad assets"
            ],
            metrics: {
                conversions: "+156%",
                engagement: "+89%",
                reach: "+234%"
            }
        },
        {
            type: "Digital Design",
            description: "Modern digital design solutions for web, mobile, and interactive experiences",
            services: [
                "Website UI/UX design",
                "Mobile app interfaces",
                "Icon and illustration design",
                "Infographic creation",
                "Interactive design elements"
            ],
            deliverables: [
                "Website design mockups",
                "Mobile app wireframes",
                "Custom icon sets",
                "Infographic library",
                "Interactive prototypes"
            ],
            metrics: {
                usability: "+78%",
                engagement: "+112%",
                conversions: "+89%"
            }
        }
    ];

// =====================================
// MAIN INITIALIZATION
// =====================================

/**
 * Initialize digital graphic design page functionality
 * @description Main entry point for all design page features
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Digital Graphic Design: Initializing...');
        
        // Initialize core features
        initializePortfolio();
        initializeTestimonials();
        initializeChart();
        initializeDesignTypes();
        
        // Setup carousels
        setupTestimonialCarousel();
        startTestimonialCarousel();
        startDesignCarousel();
        
        console.log('Digital Graphic Design: Initialization complete');
    } catch (error) {
        console.error('Digital Graphic Design: Error during initialization:', error);
    }
});

// =====================================
// PORTFOLIO FUNCTIONALITY
// =====================================

/**
 * Initialize portfolio functionality
 * @description Sets up portfolio filtering and display
 */
function initializePortfolio() {
    updatePortfolioDisplay();
    console.log('Portfolio functionality initialized');
}

/**
 * Filter portfolio by category
 * @param {string} category - Category to filter by
 * @description Filters portfolio items based on category
 */
function filterPortfolio(category) {
    activePortfolioFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update portfolio display
    updatePortfolioDisplay();
}

/**
 * Update portfolio display based on active filter
 * @description Shows/hides portfolio items based on current filter
 */
function updatePortfolioDisplay() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (activePortfolioFilter === 'all' || activePortfolioFilter === itemCategory) {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.display = 'block';
            
            // Add staggered animation
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        } else {
            item.style.opacity = '0.5';
            item.style.transform = 'scale(0.95)';
            item.classList.remove('animate-in');
        }
    });
}

// =====================================
// TESTIMONIALS FUNCTIONALITY
// =====================================

/**
 * Initialize testimonials functionality
 * @description Sets up testimonial display and navigation
 */
function initializeTestimonials() {
    if (TESTIMONIALS.length === 0) {
        console.warn('No testimonials data available');
        return;
    }
    
    renderTestimonial(TESTIMONIALS[activeTestimonial]);
    console.log(`Testimonials initialized with ${TESTIMONIALS.length} items`);
}

/**
 * Render testimonial content
 * @param {Object} testimonial - Testimonial data object
 * @description Renders testimonial content in the DOM
 */
function renderTestimonial(testimonial) {
    const testimonialContent = document.getElementById('testimonialContent');
    
    if (!testimonialContent) {
        console.warn('Testimonial content container not found');
        return;
    }
    
    testimonialContent.innerHTML = `
        <div class="testimonial-quote-icon">
            <i class="fas fa-quote-left"></i>
        </div>
        <p class="testimonial-quote">${testimonial.quote}</p>
        <div class="testimonial-author">
            <div class="author-avatar">
                <img src="${testimonial.image}" alt="${testimonial.author}" loading="lazy">
            </div>
            <div class="author-info">
                <div class="rating">
                    ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                </div>
                <h4 class="author-name">${testimonial.author}</h4>
                <p class="author-company">${testimonial.company}</p>
            </div>
        </div>
    `;
}

/**
 * Set active testimonial
 * @param {number} index - Index of testimonial to set as active
 * @description Sets the active testimonial and updates UI
 */
function setTestimonial(index) {
    if (index < 0 || index >= TESTIMONIALS.length) {
        console.warn(`Invalid testimonial index: ${index}`);
        return;
    }
    
    activeTestimonial = index;
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
        indicator.setAttribute('aria-pressed', (i === index).toString());
    });
    
    // Update testimonial content
    renderTestimonial(TESTIMONIALS[index]);
    
    // Restart carousel
    restartTestimonialCarousel();
}

/**
 * Navigate to next testimonial
 * @description Moves to the next testimonial in the carousel
 */
function nextTestimonial() {
    const nextIndex = activeTestimonial < DESIGN_CONFIG.TOTAL_TESTIMONIALS - 1 ? activeTestimonial + 1 : 0;
    setTestimonial(nextIndex);
}

/**
 * Navigate to previous testimonial
 * @description Moves to the previous testimonial in the carousel
 */
function previousTestimonial() {
    const prevIndex = activeTestimonial > 0 ? activeTestimonial - 1 : DESIGN_CONFIG.TOTAL_TESTIMONIALS - 1;
    setTestimonial(prevIndex);
}

// =====================================
// TESTIMONIAL CAROUSEL
// =====================================

/**
 * Setup testimonial carousel interactions
 * @description Initialize carousel pause/resume on hover
 */
function setupTestimonialCarousel() {
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    
    if (!testimonialContainer) {
        console.warn('Testimonial carousel container not found');
        return;
    }
    
    // Pause carousel on hover
    testimonialContainer.addEventListener('mouseenter', () => {
        stopTestimonialCarousel();
    });
    
    // Resume carousel when mouse leaves
    testimonialContainer.addEventListener('mouseleave', () => {
        startTestimonialCarousel();
    });
    
    // Pause carousel on focus for accessibility
    testimonialContainer.addEventListener('focusin', () => {
        stopTestimonialCarousel();
    });
    
    // Resume carousel when focus leaves
    testimonialContainer.addEventListener('focusout', () => {
        setTimeout(startTestimonialCarousel, 1000);
    });
}

/**
 * Start testimonial carousel
 * @description Starts the automatic testimonial rotation
 */
function startTestimonialCarousel() {
    stopTestimonialCarousel(); // Clear any existing interval
    testimonialInterval = setInterval(() => {
        nextTestimonial();
    }, DESIGN_CONFIG.TESTIMONIAL_CAROUSEL_INTERVAL);
}

/**
 * Stop testimonial carousel
 * @description Stops the automatic testimonial rotation
 */
function stopTestimonialCarousel() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

/**
 * Restart testimonial carousel
 * @description Restarts the carousel rotation after user interaction
 */
function restartTestimonialCarousel() {
    stopTestimonialCarousel();
    startTestimonialCarousel();
}

// =====================================
// FORM FUNCTIONALITY
// =====================================

/**
 * Handle form submission
 * @param {Event} event - Form submission event
 * @description Processes form submission with validation
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Get form data
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Use shared notification function if available
        if (typeof showNotification === 'function') {
            showNotification('Thank you for your inquiry! We will get back to you within 24 hours.', 'success');
        } else {
            alert('Thank you for your inquiry! We will get back to you within 24 hours.');
        }
        
        // Reset form
        event.target.reset();
        const fileName = document.getElementById('fileName');
        if (fileName) {
            fileName.textContent = '';
        }
        
        console.log('Form submitted successfully:', data);
    } catch (error) {
        console.error('Error submitting form:', error);
        if (typeof showNotification === 'function') {
            showNotification('There was an error submitting your form. Please try again.', 'error');
        }
    }
}

/**
 * Handle file upload
 * @param {Event} event - File input change event
 * @description Handles file upload display and validation
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileName = document.getElementById('fileName');
    
    if (!fileName) return;
    
    if (file) {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!allowedTypes.includes(file.type)) {
            fileName.textContent = 'Please select a valid file type (JPEG, PNG, GIF, PDF)';
            fileName.style.color = '#EF4444';
            event.target.value = '';
            return;
        }
        
        if (file.size > maxSize) {
            fileName.textContent = 'File size must be less than 10MB';
            fileName.style.color = '#EF4444';
            event.target.value = '';
            return;
        }
        
        fileName.textContent = `Selected file: ${file.name}`;
        fileName.style.color = '#10B981';
    } else {
        fileName.textContent = '';
    }
}

// =====================================
// CHART FUNCTIONALITY
// =====================================

/**
 * Initialize design analytics chart
 * @description Creates design performance chart using ECharts
 */
function initializeChart() {
    const chartContainer = document.getElementById('designChart');
    if (!chartContainer) {
        console.warn('Design chart container not found');
        return;
    }
    
    if (typeof echarts === 'undefined') {
        console.warn('ECharts library not loaded');
        return;
    }
    
    try {
        designChart = echarts.init(chartContainer);
        
        const option = {
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Brand Recognition', 'Engagement Rate', 'Conversion Rate', 'Social Shares']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Before', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Brand Recognition',
                    type: 'line',
                    data: [45, 62, 78, 85, 92, 96],
                    color: '#4F46E5'
                },
                {
                    name: 'Engagement Rate',
                    type: 'line',
                    data: [2.1, 3.8, 5.2, 6.8, 8.5, 10.2],
                    color: '#10B981'
                },
                {
                    name: 'Conversion Rate',
                    type: 'line',
                    data: [1.5, 2.3, 3.1, 4.0, 4.9, 5.8],
                    color: '#F59E0B'
                },
                {
                    name: 'Social Shares',
                    type: 'bar',
                    data: [120, 280, 450, 680, 950, 1300],
                    color: '#EF4444'
                }
            ]
        };
        
        designChart.setOption(option);
        console.log('Design chart initialized successfully');
    } catch (error) {
        console.error('Error initializing design chart:', error);
    }
}

// =====================================
// DESIGN TYPES FUNCTIONALITY
// =====================================

/**
 * Initialize design types functionality
 * @description Sets up design type carousel and navigation
 */
function initializeDesignTypes() {
    if (DESIGN_TYPES.length === 0) {
        console.warn('No design types data available');
        return;
    }
    
    setupDesignTypeNavigation();
    setDesignType(0); // Initialize with first design type
    
    console.log(`Design types initialized with ${DESIGN_TYPES.length} items`);
}

/**
 * Setup design type navigation
 * @description Initialize design type dot navigation
 */
function setupDesignTypeNavigation() {
    const designTypeDots = document.querySelectorAll('.design-type-dot');
    
    designTypeDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setDesignType(index);
            restartDesignCarousel();
        });
        
        // Add accessibility attributes
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `View design type ${index + 1}`);
        dot.setAttribute('tabindex', '0');
        
        // Keyboard navigation
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDesignType(index);
                restartDesignCarousel();
            }
        });
    });
}

/**
 * Render design type content
 * @param {Object} designType - Design type data object
 * @description Renders design type content in the DOM
 */
    function renderDesignType(designType) {
        const designContainer = document.getElementById('designTypeContent');
    if (!designContainer) {
        console.warn('Design type container not found');
        return;
    }

        designContainer.innerHTML = `
            <div class="design-type-content">
                <div class="design-type-header">
                    <h3>${designType.type}</h3>
                    <p class="design-description">${designType.description}</p>
                </div>
                
                <div class="design-type-body">
                    <div class="services-deliverables">
                        <div class="services">
                            <h4>Our Services</h4>
                            <ul>
                                ${designType.services.map(service => `<li>${service}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="deliverables">
                            <h4>Deliverables</h4>
                            <ul>
                                ${designType.deliverables.map(deliverable => `<li>${deliverable}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="design-metrics">
                        <h4>Typical Results</h4>
                        <div class="metrics-grid">
                            ${Object.entries(designType.metrics).map(([key, value]) => `
                                <div class="metric">
                                    <span class="metric-value">${value}</span>
                                    <span class="metric-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

/**
 * Set active design type
 * @param {number} index - Index of design type to set as active
 * @description Sets the active design type and updates UI
 */
    function setDesignType(index) {
    if (index < 0 || index >= DESIGN_TYPES.length) {
        console.warn(`Invalid design type index: ${index}`);
        return;
    }
    
            activeDesignType = index;
    renderDesignType(DESIGN_TYPES[index]);
            
            // Update navigation dots
            const dots = document.querySelectorAll('.design-type-dot');
            dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-pressed', (i === index).toString());
            });
    }

/**
 * Navigate to next design type
 * @description Moves to the next design type in the carousel
 */
function nextDesignType() {
    const nextIndex = (activeDesignType + 1) % DESIGN_CONFIG.TOTAL_DESIGN_TYPES;
    setDesignType(nextIndex);
}

/**
 * Navigate to previous design type
 * @description Moves to the previous design type in the carousel
 */
function previousDesignType() {
    const prevIndex = (activeDesignType - 1 + DESIGN_CONFIG.TOTAL_DESIGN_TYPES) % DESIGN_CONFIG.TOTAL_DESIGN_TYPES;
    setDesignType(prevIndex);
}

/**
 * Start design carousel
 * @description Starts the automatic design type rotation
 */
function startDesignCarousel() {
    stopDesignCarousel(); // Clear any existing interval
    designInterval = setInterval(() => {
        nextDesignType();
    }, DESIGN_CONFIG.DESIGN_CAROUSEL_INTERVAL);
}

/**
 * Stop design carousel
 * @description Stops the automatic design type rotation
 */
function stopDesignCarousel() {
    if (designInterval) {
        clearInterval(designInterval);
        designInterval = null;
    }
}

/**
 * Restart design carousel
 * @description Restarts the carousel rotation after user interaction
 */
function restartDesignCarousel() {
    stopDesignCarousel();
    startDesignCarousel();
}

// =====================================
// WINDOW EVENT HANDLERS
// =====================================

/**
 * Handle window resize
 * @description Handles window resize events for responsive chart updates
 */
window.addEventListener('resize', () => {
    if (designChart && designChart.resize) {
        designChart.resize();
    }
});

/**
 * Handle page visibility change
 * @description Pause/resume carousels based on page visibility
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTestimonialCarousel();
        stopDesignCarousel();
    } else {
        startTestimonialCarousel();
        startDesignCarousel();
    }
});

// Note: Mobile menu, scroll, and header functions now use shared.js utilities
// Note: setCurrentYear function now available from shared.js 