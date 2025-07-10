// SEO Services - Page Specific JavaScript
// ======================================

// Global variables
let seoChart = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeChart();
    initializeFaq();
    addProcessTabContent();
    addCaseStudiesTabContent();
    addPricingTabContent();
    addFaqTabContent();
    initializeAnimations();
    initializeContentHierarchy();
    prioritizeContent();
    enhanceBenefitCards();
    enhanceContentBlocks();
    optimizeForMobile();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            setActiveTab(tabName);
        });
    });
}

function setActiveTab(tabName) {
    // Remove active class from all buttons and contents
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.classList.add('content-loading');
    });
    
    // Add active class to clicked button and corresponding content
    document.getElementById(`tab-${tabName}`).classList.add('active');
    const activeContent = document.getElementById(`content-${tabName}`);
    
    setTimeout(() => {
        activeContent.classList.add('active');
        activeContent.classList.remove('content-loading');
        activeContent.classList.add('content-fade-in');
        
        // Reset any expanded content when switching tabs
        resetExpandedContent();
        
        // Scroll to content if on mobile
        if (window.innerWidth < 768) {
            activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 150);
}

// Chart initialization using shared utilities
function initializeChart() {
    if (window.chartUtils) {
        seoChart = window.chartUtils.seo('seoChart');
    } else {
        console.warn('Chart utilities not loaded');
    }
}

// FAQ functionality
function initializeFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => toggleFaq(item));
        }
    });
}

function toggleFaq(currentItem) {
    const currentAnswer = currentItem.querySelector('.faq-answer');
    const currentIcon = currentItem.querySelector('.faq-question i');
    
    // Check if this item is currently active
    const isActive = currentItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question i');
        if (answer && icon) {
            answer.style.maxHeight = '0px';
            icon.style.transform = 'rotate(0deg)';
            item.classList.remove('active');
        }
    });
    
    // If the clicked item wasn't active, open it
    if (!isActive) {
        currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
        currentIcon.style.transform = 'rotate(180deg)';
        currentItem.classList.add('active');
    }
}

// Dynamic content functions
function addProcessTabContent() {
    const processContent = document.getElementById('process-content');
    if (!processContent) return;
    
    processContent.innerHTML = `
        <div class="seo-process-grid">
            <div class="process-step">
                <div class="step-number">01</div>
                <h4>Technical SEO Audit</h4>
                <p>Comprehensive analysis of your website's technical foundation, including site speed, mobile optimization, and crawlability issues.</p>
                <ul>
                    <li>Site speed optimization</li>
                    <li>Mobile responsiveness check</li>
                    <li>Technical error identification</li>
                    <li>Schema markup implementation</li>
                </ul>
            </div>
            
            <div class="process-step">
                <div class="step-number">02</div>
                <h4>Keyword Research & Strategy</h4>
                <p>Data-driven keyword research to identify high-value opportunities that align with your business goals and target audience.</p>
                <ul>
                    <li>Competitive keyword analysis</li>
                    <li>Search intent mapping</li>
                    <li>Long-tail keyword identification</li>
                    <li>Content gap analysis</li>
                </ul>
            </div>
            
            <div class="process-step">
                <div class="step-number">03</div>
                <h4>On-Page Optimization</h4>
                <p>Optimization of individual pages to improve search visibility and user experience for target keywords.</p>
                <ul>
                    <li>Meta title and description optimization</li>
                    <li>Header tag structure</li>
                    <li>Internal linking strategy</li>
                    <li>Content optimization</li>
                </ul>
            </div>
            
            <div class="process-step">
                <div class="step-number">04</div>
                <h4>Content Strategy & Creation</h4>
                <p>Development of high-quality, SEO-optimized content that addresses user needs and search intent.</p>
                <ul>
                    <li>Content calendar development</li>
                    <li>SEO-optimized content creation</li>
                    <li>Content performance tracking</li>
                    <li>Regular content updates</li>
                </ul>
            </div>
            
            <div class="process-step">
                <div class="step-number">05</div>
                <h4>Link Building & Authority</h4>
                <p>Strategic link building to increase domain authority and improve search rankings through quality backlinks.</p>
                <ul>
                    <li>Guest posting opportunities</li>
                    <li>Broken link building</li>
                    <li>Industry partnership outreach</li>
                    <li>Content promotion strategies</li>
                </ul>
            </div>
            
            <div class="process-step">
                <div class="step-number">06</div>
                <h4>Monitoring & Optimization</h4>
                <p>Continuous monitoring of performance metrics and ongoing optimization to maintain and improve rankings.</p>
                <ul>
                    <li>Ranking tracking and analysis</li>
                    <li>Performance reporting</li>
                    <li>Algorithm update monitoring</li>
                    <li>Continuous optimization</li>
                </ul>
            </div>
        </div>
    `;
}

function addCaseStudiesTabContent() {
    const caseStudiesContent = document.getElementById('case-studies-content');
    if (!caseStudiesContent) return;
    
    caseStudiesContent.innerHTML = `
        <div class="case-studies-grid">
            <div class="case-study-card">
                <div class="case-study-header">
                    <h4>E-commerce Growth</h4>
                    <span class="industry">E-commerce</span>
                </div>
                <div class="case-study-metrics">
                    <div class="metric">
                        <span class="value">+340%</span>
                        <span class="label">Organic Traffic</span>
                    </div>
                    <div class="metric">
                        <span class="value">+156%</span>
                        <span class="label">Conversions</span>
                    </div>
                </div>
                <p>Comprehensive SEO strategy for an e-commerce platform, focusing on product page optimization and long-tail keyword targeting.</p>
            </div>
            
            <div class="case-study-card">
                <div class="case-study-header">
                    <h4>Local Business Success</h4>
                    <span class="industry">Local Business</span>
                </div>
                <div class="case-study-metrics">
                    <div class="metric">
                        <span class="value">+280%</span>
                        <span class="label">Local Traffic</span>
                    </div>
                    <div class="metric">
                        <span class="value">+89%</span>
                        <span class="label">Phone Calls</span>
                    </div>
                </div>
                <p>Local SEO optimization for a service business, including Google My Business optimization and local keyword targeting.</p>
            </div>
            
            <div class="case-study-card">
                <div class="case-study-header">
                    <h4>B2B Lead Generation</h4>
                    <span class="industry">B2B</span>
                </div>
                <div class="case-study-metrics">
                    <div class="metric">
                        <span class="value">+420%</span>
                        <span class="label">Organic Leads</span>
                    </div>
                    <div class="metric">
                        <span class="value">+67%</span>
                        <span class="label">Lead Quality</span>
                    </div>
                </div>
                <p>B2B SEO strategy focusing on thought leadership content and high-value keyword targeting for lead generation.</p>
            </div>
        </div>
    `;
}

function addPricingTabContent() {
    const pricingContent = document.getElementById('pricing-content');
    if (!pricingContent) return;
    
    pricingContent.innerHTML = `
        <div class="pricing-grid">
            <div class="pricing-card">
                <div class="pricing-header">
                    <h4>Starter</h4>
                    <div class="price">
                        <span class="amount">$999</span>
                        <span class="period">/month</span>
                    </div>
                </div>
                <ul class="pricing-features">
                    <li>Technical SEO audit</li>
                    <li>Keyword research (50 keywords)</li>
                    <li>On-page optimization</li>
                    <li>Monthly reporting</li>
                    <li>Basic content optimization</li>
                </ul>
                <button class="pricing-cta">Get Started</button>
            </div>
            
            <div class="pricing-card featured">
                <div class="pricing-header">
                    <h4>Professional</h4>
                    <div class="price">
                        <span class="amount">$1,999</span>
                        <span class="period">/month</span>
                    </div>
                </div>
                <ul class="pricing-features">
                    <li>Everything in Starter</li>
                    <li>Keyword research (150 keywords)</li>
                    <li>Content strategy & creation</li>
                    <li>Link building (10 links/month)</li>
                    <li>Weekly reporting</li>
                    <li>Competitor analysis</li>
                </ul>
                <button class="pricing-cta">Get Started</button>
            </div>
            
            <div class="pricing-card">
                <div class="pricing-header">
                    <h4>Enterprise</h4>
                    <div class="price">
                        <span class="amount">$3,999</span>
                        <span class="period">/month</span>
                    </div>
                </div>
                <ul class="pricing-features">
                    <li>Everything in Professional</li>
                    <li>Unlimited keyword research</li>
                    <li>Advanced content strategy</li>
                    <li>Link building (25 links/month)</li>
                    <li>Daily monitoring</li>
                    <li>Dedicated SEO specialist</li>
                    <li>Custom reporting</li>
                </ul>
                <button class="pricing-cta">Get Started</button>
            </div>
        </div>
    `;
}

function addFaqTabContent() {
    const faqContent = document.getElementById('faq-content');
    if (!faqContent) return;
    
    faqContent.innerHTML = `
        <div class="faq-container">
            <div class="faq-item">
                <div class="faq-question">
                    <h4>How long does it take to see SEO results?</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer">
                    <p>SEO is a long-term strategy. You can typically see initial improvements in 3-6 months, with significant results appearing in 6-12 months. However, this timeline varies based on your industry, competition, and current website authority.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <div class="faq-question">
                    <h4>What's the difference between on-page and off-page SEO?</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer">
                    <p>On-page SEO refers to optimizations you make directly on your website (content, meta tags, site structure). Off-page SEO involves external factors like backlinks, social signals, and brand mentions that happen outside your website.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <div class="faq-question">
                    <h4>How do you measure SEO success?</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer">
                    <p>We track multiple metrics including organic traffic growth, keyword rankings, click-through rates, conversion rates, and domain authority. We provide detailed monthly reports showing your progress and ROI.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <div class="faq-question">
                    <h4>Do you guarantee first-page rankings?</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer">
                    <p>While we can't guarantee specific rankings due to the complexity of search algorithms, we do guarantee improvement in your organic traffic and overall search visibility. Our track record shows consistent positive results for our clients.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <div class="faq-question">
                    <h4>What industries do you specialize in?</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer">
                    <p>We have experience across various industries including e-commerce, B2B, healthcare, legal, real estate, and local businesses. Each industry requires different SEO strategies, and we tailor our approach accordingly.</p>
                </div>
            </div>
        </div>
    `;
    
         // Initialize FAQ functionality after adding content
     initializeFaq();
 } 

// Animation functions
function initializeAnimations() {
    // Animate process steps on scroll
    const processSteps = document.querySelectorAll('.process-step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(step);
    });
    
    // Animate case study cards
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Animate pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Progressive Content Disclosure Functions
function toggleExpandContent(contentId, button) {
    const content = document.getElementById(contentId);
    const isExpanded = !content.classList.contains('content-collapsed');
    
    if (isExpanded) {
        // Collapse content
        content.classList.add('content-collapsed');
        content.style.maxHeight = '200px';
        button.querySelector('span').textContent = 'View All Services';
        button.classList.remove('expanded');
    } else {
        // Expand content
        content.classList.remove('content-collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
        button.querySelector('span').textContent = 'Show Less';
        button.classList.add('expanded');
    }
}

// Content Loading and Animation Functions
function initializeContentHierarchy() {
    // Add fade-in animation to content sections
    const contentSections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('content-fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    contentSections.forEach(section => {
        observer.observe(section);
    });
}

// Content Priority Management
function prioritizeContent() {
    const highPriority = document.querySelectorAll('.content-priority-high');
    const mediumPriority = document.querySelectorAll('.content-priority-medium');
    const lowPriority = document.querySelectorAll('.content-priority-low');
    
    // Show high priority content immediately
    highPriority.forEach(content => {
        content.style.display = 'block';
        content.style.opacity = '1';
    });
    
    // Delay medium priority content slightly
    setTimeout(() => {
        mediumPriority.forEach(content => {
            content.style.display = 'block';
            content.style.opacity = '1';
        });
    }, 200);
    
    // Further delay low priority content
    setTimeout(() => {
        lowPriority.forEach(content => {
            content.style.display = 'block';
            content.style.opacity = '1';
        });
    }, 400);
}

// Note: scrollToSection function moved to shared.js to avoid duplication

// Improve Benefits Cards Interaction
function enhanceBenefitCards() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach((card, index) => {
        // Stagger animations
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Content Block Interactions
function enhanceContentBlocks() {
    const contentBlocks = document.querySelectorAll('.content-block');
    
    contentBlocks.forEach(block => {
        // Add subtle hover effect
        block.addEventListener('mouseenter', () => {
            block.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            block.style.transform = 'translateY(-2px)';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            block.style.transform = 'translateY(0)';
        });
    });
}

// Mobile-Specific Optimizations
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        // Reduce animation delays on mobile
        const animatedElements = document.querySelectorAll('[style*="animation-delay"]');
        animatedElements.forEach(element => {
            element.style.animationDelay = '0.1s';
        });
        
        // Simplify hover effects on mobile
        const hoverElements = document.querySelectorAll('.benefit-card, .content-block');
        hoverElements.forEach(element => {
            element.style.transition = 'none';
        });
    }
}

// Reset Expanded Content
function resetExpandedContent() {
    const expandableContent = document.querySelectorAll('.content-expandable');
    const expandButtons = document.querySelectorAll('.expand-button');
    
    expandableContent.forEach(content => {
        content.classList.add('content-collapsed');
        content.style.maxHeight = '200px';
    });
    
    expandButtons.forEach(button => {
        button.classList.remove('expanded');
        const span = button.querySelector('span');
        if (span) {
            span.textContent = span.textContent.includes('Services') ? 'View All Services' : 'Show More';
        }
    });
}

// Note: Mobile menu functionality moved to shared.js to avoid duplication

// Export functions for global use
window.setActiveTab = setActiveTab;
window.toggleFaq = toggleFaq;
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleExpandContent = toggleExpandContent;

// ... existing code ... 