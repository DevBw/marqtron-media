/**
 * @fileoverview Social Media Marketing Service Page
 * @description JavaScript functionality for social media marketing service features
 * @version 2.0.0
 * @author Marqtron Media Development Team
 * @created 2024
 * @updated 2024
 * @requires shared.js - Chart utilities from window.chartUtils
 */

'use strict';

// =====================================
// CONFIGURATION & CONSTANTS
// =====================================

/** @type {Object} Configuration constants for social media features */
const SOCIAL_CONFIG = {
    CASE_STUDY_CAROUSEL_INTERVAL: 8000,
    TOTAL_CASE_STUDIES: 3,
    CHART_PLATFORMS: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'],
    ANIMATION_DELAY: 300
};

/** @type {Object} Social media metrics data */
const SOCIAL_METRICS = {
    'Engagement': [8200, 9500, 6800, 7200, 12000, 8900],
    'Reach': [12000, 15000, 9500, 8800, 18000, 13500],
    'Impressions': [25000, 32000, 18000, 15000, 45000, 28000],
    'Conversions': [320, 420, 180, 240, 580, 380]
};

// =====================================
// STATE VARIABLES
// =====================================

/** @type {number} Current active case study index */
let activeCaseStudy = 0;

/** @type {number|null} Case study carousel interval ID */
let caseStudyInterval = null;

/** @type {Object|null} Social media chart instance */
let socialMediaChart = null;

// =====================================
// CASE STUDY DATA
// =====================================

/** @type {Array<Object>} Case study data */
const CASE_STUDIES = [
        {
            company: "FashionForward Boutique",
            industry: "E-commerce Fashion",
            challenge: "Low social media engagement and declining online sales",
            solution: "Comprehensive Instagram and TikTok strategy focusing on user-generated content and influencer partnerships",
            results: [
                "425% increase in Instagram engagement",
                "89% growth in TikTok followers in 3 months",
                "156% increase in social commerce sales",
                "Brand awareness increased by 78%"
            ],
            testimonial: {
                quote: "Marqtron Media completely transformed our social media presence. Our engagement rates skyrocketed, and we're seeing direct sales from our social channels for the first time.",
                author: "Jessica Chen",
                position: "Marketing Director, FashionForward"
            },
            metrics: {
                engagement: "+425%",
                followers: "+89%",
                sales: "+156%"
            },
            image: "https://readdy.ai/api/search-image?query=Fashion%20boutique%20social%20media%20campaign%20showing%20Instagram%20posts%20and%20TikTok%20content%20on%20mobile%20devices%2C%20trendy%20fashion%20photography%20with%20user-generated%20content%20and%20influencer%20collaborations%2C%20vibrant%20social%20media%20aesthetic&width=600&height=400&seq=case1&orientation=landscape"
        },
        {
            company: "TechStartup Pro",
            industry: "B2B Technology",
            challenge: "Struggling to build thought leadership and generate B2B leads through LinkedIn",
            solution: "Strategic LinkedIn content marketing with executive positioning and targeted advertising campaigns",
            results: [
                "340% increase in LinkedIn followers",
                "225% improvement in lead generation",
                "500% boost in content engagement",
                "Established CEO as industry thought leader"
            ],
            testimonial: {
                quote: "The LinkedIn strategy they developed positioned our CEO as a thought leader and generated more qualified leads than any other channel. Their content consistently drives meaningful business conversations.",
                author: "Michael Rodriguez",
                position: "VP Marketing, TechStartup Pro"
            },
            metrics: {
                followers: "+340%",
                leads: "+225%",
                engagement: "+500%"
            },
            image: "https://readdy.ai/api/search-image?query=B2B%20technology%20company%20LinkedIn%20strategy%20showing%20professional%20content%20calendar%2C%20thought%20leadership%20posts%20and%20lead%20generation%20campaigns%20on%20multiple%20screens%2C%20modern%20corporate%20office%20setting&width=600&height=400&seq=case2&orientation=landscape"
        },
        {
            company: "Local Restaurant Chain",
            industry: "Food & Beverage",
            challenge: "Multiple locations struggling with inconsistent social media presence and low local engagement",
            solution: "Location-specific social media strategy with community-focused content and local influencer partnerships",
            results: [
                "180% increase in local engagement",
                "65% growth in foot traffic from social",
                "92% improvement in online reviews",
                "Unified brand presence across all locations"
            ],
            testimonial: {
                quote: "Marqtron Media helped us create a cohesive social media strategy across all our locations. The local community engagement has been incredible, and we're seeing more customers than ever.",
                author: "Sarah Johnson",
                position: "Marketing Manager, Local Restaurant Chain"
            },
            metrics: {
                engagement: "+180%",
                footTraffic: "+65%",
                reviews: "+92%"
            },
            image: "https://readdy.ai/api/search-image?query=Local%20restaurant%20chain%20social%20media%20strategy%20showing%20community%20engagement%2C%20local%20influencer%20partnerships%2C%20and%20location-specific%20content%20on%20mobile%20devices%2C%20vibrant%20food%20photography%20and%20local%20community%20aesthetic&width=600&height=400&seq=case3&orientation=landscape"
        }
    ];

// =====================================
// MAIN INITIALIZATION
// =====================================

/**
 * Initialize social media marketing page functionality
 * @description Main entry point for all social media page features
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Social Media Marketing: Initializing...');
        
        // Initialize core features
        initializeChart();
        initializeCaseStudies();
        setupCarouselInteractions();
        startCaseStudyCarousel();
        
        console.log('Social Media Marketing: Initialization complete');
    } catch (error) {
        console.error('Social Media Marketing: Error during initialization:', error);
    }
});

// =====================================
// CHART FUNCTIONALITY
// =====================================

/**
 * Initialize social media analytics chart
 * @description Creates social media performance chart using shared utilities
 */
function initializeChart() {
    if (!window.chartUtils) {
        console.warn('Chart utilities not loaded, skipping chart initialization');
        return;
    }
    
    try {
        socialMediaChart = window.chartUtils.socialMedia(
            'socialMediaChart', 
            SOCIAL_CONFIG.CHART_PLATFORMS, 
            SOCIAL_METRICS
        );
        
        console.log('Social media chart initialized successfully');
    } catch (error) {
        console.error('Error initializing social media chart:', error);
    }
}

// =====================================
// CASE STUDIES FUNCTIONALITY
// =====================================

/**
 * Initialize case studies functionality
 * @description Sets up case study carousel and navigation
 */
function initializeCaseStudies() {
    if (CASE_STUDIES.length === 0) {
        console.warn('No case studies data available');
        return;
    }
    
    setupCaseStudyNavigation();
    setCaseStudy(0); // Initialize with first case study
    
    console.log(`Case studies initialized with ${CASE_STUDIES.length} items`);
}

/**
 * Setup case study navigation
 * @description Initialize case study dot navigation
 */
function setupCaseStudyNavigation() {
    const caseStudyDots = document.querySelectorAll('.case-study-dot');
    
    caseStudyDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setCaseStudy(index);
            restartCaseStudyCarousel();
        });
        
        // Add accessibility attributes
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `View case study ${index + 1}`);
        dot.setAttribute('tabindex', '0');
        
        // Keyboard navigation
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCaseStudy(index);
                restartCaseStudyCarousel();
            }
        });
    });
}

/**
 * Set active case study
 * @param {number} index - Index of the case study to display
 * @description Sets the active case study and updates UI
 */
function setCaseStudy(index) {
    if (index < 0 || index >= CASE_STUDIES.length) {
        console.warn(`Invalid case study index: ${index}`);
        return;
    }
    
    activeCaseStudy = index;
    renderCaseStudy(CASE_STUDIES[index]);
    updateNavigationDots(index);
}

/**
 * Render case study content
 * @param {Object} caseStudy - Case study data object
 * @description Renders case study content in the DOM
 */
    function renderCaseStudy(caseStudy) {
        const caseStudyContainer = document.getElementById('caseStudyContent');
    if (!caseStudyContainer) {
        console.warn('Case study container not found');
        return;
    }

        caseStudyContainer.innerHTML = `
            <div class="case-study-content">
                <div class="case-study-header">
                    <div class="case-study-company">
                        <h3>${caseStudy.company}</h3>
                        <span class="industry-tag">${caseStudy.industry}</span>
                    </div>
                    <div class="case-study-metrics">
                        <div class="metric">
                            <span class="metric-value">${caseStudy.metrics.engagement || caseStudy.metrics.followers}</span>
                            <span class="metric-label">Engagement</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${caseStudy.metrics.sales || caseStudy.metrics.leads || caseStudy.metrics.footTraffic}</span>
                            <span class="metric-label">Growth</span>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-body">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h4>Challenge</h4>
                            <p>${caseStudy.challenge}</p>
                        </div>
                        <div class="solution">
                            <h4>Solution</h4>
                            <p>${caseStudy.solution}</p>
                        </div>
                    </div>
                    
                    <div class="results">
                        <h4>Results</h4>
                        <ul>
                            ${caseStudy.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="testimonial">
                        <blockquote>${caseStudy.testimonial.quote}</blockquote>
                        <cite>
                            <strong>${caseStudy.testimonial.author}</strong>
                            <span>${caseStudy.testimonial.position}</span>
                        </cite>
                    </div>
                </div>
            </div>
        `;
    }

/**
 * Update navigation dots
 * @param {number} activeIndex - Index of the active case study
 * @description Updates the visual state of navigation dots
 */
function updateNavigationDots(activeIndex) {
            const dots = document.querySelectorAll('.case-study-dot');
    
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
                    dot.classList.add('active');
            dot.setAttribute('aria-pressed', 'true');
                } else {
                    dot.classList.remove('active');
            dot.setAttribute('aria-pressed', 'false');
                }
            });
        }

// =====================================
// CAROUSEL FUNCTIONALITY
// =====================================

/**
 * Setup carousel interactions
 * @description Initialize carousel pause/resume on hover
 */
function setupCarouselInteractions() {
    const caseStudyContainer = document.querySelector('.case-studies-carousel');
    
    if (!caseStudyContainer) {
        console.warn('Case studies carousel container not found');
        return;
    }
    
    // Pause carousel on hover
    caseStudyContainer.addEventListener('mouseenter', () => {
        stopCaseStudyCarousel();
    });
    
    // Resume carousel when mouse leaves
    caseStudyContainer.addEventListener('mouseleave', () => {
        startCaseStudyCarousel();
    });
    
    // Pause carousel on focus for accessibility
    caseStudyContainer.addEventListener('focusin', () => {
        stopCaseStudyCarousel();
    });

    // Resume carousel when focus leaves
    caseStudyContainer.addEventListener('focusout', () => {
        setTimeout(startCaseStudyCarousel, 1000);
    });
}

/**
 * Navigate to next case study
 * @description Moves to the next case study in the carousel
 */
function nextCaseStudy() {
    const nextIndex = (activeCaseStudy + 1) % SOCIAL_CONFIG.TOTAL_CASE_STUDIES;
    setCaseStudy(nextIndex);
}

/**
 * Navigate to previous case study
 * @description Moves to the previous case study in the carousel
 */
function previousCaseStudy() {
    const prevIndex = (activeCaseStudy - 1 + SOCIAL_CONFIG.TOTAL_CASE_STUDIES) % SOCIAL_CONFIG.TOTAL_CASE_STUDIES;
    setCaseStudy(prevIndex);
}

/**
 * Start case study carousel
 * @description Starts the automatic case study rotation
 */
function startCaseStudyCarousel() {
    stopCaseStudyCarousel(); // Clear any existing interval
    caseStudyInterval = setInterval(nextCaseStudy, SOCIAL_CONFIG.CASE_STUDY_CAROUSEL_INTERVAL);
}

/**
 * Stop case study carousel
 * @description Stops the automatic case study rotation
 */
function stopCaseStudyCarousel() {
    if (caseStudyInterval) {
        clearInterval(caseStudyInterval);
        caseStudyInterval = null;
    }
}

/**
 * Restart case study carousel
 * @description Restarts the carousel rotation after user interaction
 */
function restartCaseStudyCarousel() {
    stopCaseStudyCarousel();
    startCaseStudyCarousel();
}

// =====================================
// PUBLIC API FUNCTIONS
// =====================================

/**
 * Public function to navigate to next case study
 * @description Exposed function for external navigation control
 */
function nextCaseStudy() {
    nextCaseStudy();
    restartCaseStudyCarousel();
}

/**
 * Public function to navigate to previous case study
 * @description Exposed function for external navigation control
 */
function previousCaseStudy() {
    previousCaseStudy();
    restartCaseStudyCarousel();
}

// =====================================
// WINDOW EVENT HANDLERS
// =====================================

/**
 * Handle window resize
 * @description Handles window resize events for responsive chart updates
 */
window.addEventListener('resize', () => {
    if (socialMediaChart && socialMediaChart.resize) {
        socialMediaChart.resize();
    }
});

/**
 * Handle page visibility change
 * @description Pause/resume carousel based on page visibility
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCaseStudyCarousel();
    } else {
        startCaseStudyCarousel();
    }
}); 