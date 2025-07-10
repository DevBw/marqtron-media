// Marqtron Media - Unified Service Engine v1.0
// Consolidates all service-specific functionality into one configurable system

(function() {
    'use strict';
    
    // Service Configuration Database
    const serviceConfigs = {
        seo: {
            name: 'SEO Services',
            icon: 'fas fa-search',
            title: 'Search Engine Optimization That Drives Results',
            description: 'Boost your online visibility and drive qualified organic traffic with our data-driven SEO strategies.',
            primaryCTA: 'Get Free SEO Strategy Session',
            keywords: 'SEO services, search engine optimization, keyword research, technical SEO, local SEO',
            meta: {
                title: 'Professional SEO Services - Boost Your Search Rankings | Marqtron Media',
                description: 'Drive organic traffic and improve search rankings with our comprehensive SEO services. Technical audits, keyword research, content optimization, and more.',
                ogImage: 'https://devbw.github.io/marqtron-media/images/seo-services-og.jpg'
            },
            heroStats: [
                { value: '150%', label: 'Avg Traffic Increase' },
                { value: '85%', label: 'First Page Rankings' },
                { value: '30', label: 'Days to See Results' }
            ],
            benefits: [
                {
                    icon: 'fas fa-chart-line',
                    title: 'Increase Organic Traffic',
                    description: 'Drive more qualified visitors to your website through improved search rankings.'
                },
                {
                    icon: 'fas fa-target',
                    title: 'Target Right Keywords',
                    description: 'Research and target keywords that your customers are actually searching for.'
                },
                {
                    icon: 'fas fa-tools',
                    title: 'Technical Optimization',
                    description: 'Fix technical issues that prevent search engines from properly indexing your site.'
                }
            ],
            services: [
                'Technical SEO Audit',
                'Keyword Research & Strategy',
                'On-Page Optimization',
                'Local SEO',
                'Link Building',
                'SEO Reporting & Analytics'
            ]
        },
        
        content: {
            name: 'Content Marketing',
            icon: 'fas fa-pen-fancy',
            title: 'Content That Connects, Converts & Captivates',
            description: 'Transform your brand story into compelling content that engages your audience and drives meaningful business results.',
            primaryCTA: 'Get Free Content Strategy Session',
            keywords: 'content marketing, blog writing, social media content, email marketing, video content',
            meta: {
                title: 'Content Marketing Services - Engage Your Audience | Marqtron Media',
                description: 'Strategic content creation and marketing that tells your story, engages your audience, and drives conversions.',
                ogImage: 'https://devbw.github.io/marqtron-media/images/content-marketing-og.jpg'
            },
            heroStats: [
                { value: '300%', label: 'Engagement Increase' },
                { value: '200%', label: 'Lead Generation' },
                { value: '50', label: 'Content Pieces/Month' }
            ],
            benefits: [
                {
                    icon: 'fas fa-magnet',
                    title: 'Attract Quality Leads',
                    description: 'Create valuable content that draws your ideal customers naturally.'
                },
                {
                    icon: 'fas fa-crown',
                    title: 'Build Authority',
                    description: 'Establish your brand as an industry thought leader through expert content.'
                },
                {
                    icon: 'fas fa-chart-bar',
                    title: 'Measurable ROI',
                    description: 'Track real business impact with content that drives traffic and conversions.'
                }
            ],
            services: [
                'Content Strategy & Planning',
                'Blog Writing & SEO',
                'Social Media Content',
                'Email Marketing Content',
                'Video Content Strategy',
                'Content Distribution'
            ]
        },
        
        social: {
            name: 'Social Media Marketing',
            icon: 'fas fa-share-alt',
            title: 'Amplify Your Brand Across All Social Platforms',
            description: 'Build engaged communities and drive business growth with strategic social media marketing that converts followers into customers.',
            primaryCTA: 'Get Free Social Media Audit',
            keywords: 'social media marketing, Facebook advertising, Instagram marketing, LinkedIn marketing',
            meta: {
                title: 'Social Media Marketing Services - Build Your Brand | Marqtron Media',
                description: 'Amplify your brand with strategic social media marketing services. Build engaged communities and drive business growth.',
                ogImage: 'https://devbw.github.io/marqtron-media/images/social-media-marketing-og.jpg'
            },
            heroStats: [
                { value: '500%', label: 'Follower Growth' },
                { value: '250%', label: 'Engagement Rate' },
                { value: '15', label: 'Platforms Managed' }
            ],
            benefits: [
                {
                    icon: 'fas fa-users',
                    title: 'Build Community',
                    description: 'Create engaged communities around your brand across all social platforms.'
                },
                {
                    icon: 'fas fa-bullhorn',
                    title: 'Amplify Reach',
                    description: 'Expand your brand reach and connect with new audiences organically and through ads.'
                },
                {
                    icon: 'fas fa-comments',
                    title: 'Drive Engagement',
                    description: 'Foster meaningful conversations that build trust and drive conversions.'
                }
            ],
            services: [
                'Social Media Strategy',
                'Content Creation & Curation',
                'Community Management',
                'Social Media Advertising',
                'Influencer Partnerships',
                'Social Media Analytics'
            ]
        },
        
        'web-design': {
            name: 'Web Design & Development',
            icon: 'fas fa-code',
            title: 'Beautiful Websites That Convert Visitors Into Customers',
            description: 'Professional web design and development services creating responsive, fast-loading websites optimized for conversions.',
            primaryCTA: 'Get Free Website Consultation',
            keywords: 'web design, web development, responsive design, website optimization, e-commerce',
            meta: {
                title: 'Web Design & Development Services - Beautiful Websites | Marqtron Media',
                description: 'Professional web design and development creating responsive, fast-loading websites optimized for conversions.',
                ogImage: 'https://devbw.github.io/marqtron-media/images/web-design-og.jpg'
            },
            heroStats: [
                { value: '95+', label: 'PageSpeed Score' },
                { value: '99.9%', label: 'Uptime Guarantee' },
                { value: '24/7', label: 'Support Available' }
            ],
            benefits: [
                {
                    icon: 'fas fa-mobile-alt',
                    title: 'Mobile-First Design',
                    description: 'Responsive designs that look perfect on all devices and screen sizes.'
                },
                {
                    icon: 'fas fa-rocket',
                    title: 'Lightning Fast',
                    description: 'Optimized for speed with 95+ PageSpeed scores and fast loading times.'
                },
                {
                    icon: 'fas fa-shopping-cart',
                    title: 'Conversion Focused',
                    description: 'Designed with user experience and conversion optimization in mind.'
                }
            ],
            services: [
                'Custom Web Design',
                'Responsive Development',
                'E-commerce Solutions',
                'CMS Integration',
                'Website Optimization',
                'Maintenance & Support'
            ]
        },
        
        design: {
            name: 'Digital Graphic Design',
            icon: 'fas fa-palette',
            title: 'Visual Branding That Makes Your Business Stand Out',
            description: 'Creative digital design services for branding, marketing materials, and digital assets that captivate your audience.',
            primaryCTA: 'Get Free Design Consultation',
            keywords: 'graphic design, logo design, branding, marketing materials, digital design',
            meta: {
                title: 'Digital Graphic Design Services - Visual Branding | Marqtron Media',
                description: 'Creative digital design services for branding, marketing materials, and digital assets that make your business stand out.',
                ogImage: 'https://devbw.github.io/marqtron-media/images/graphic-design-og.jpg'
            },
            heroStats: [
                { value: '500+', label: 'Designs Created' },
                { value: '100%', label: 'Original Artwork' },
                { value: '48hrs', label: 'Average Turnaround' }
            ],
            benefits: [
                {
                    icon: 'fas fa-eye',
                    title: 'Stand Out Visually',
                    description: 'Eye-catching designs that make your brand memorable and distinctive.'
                },
                {
                    icon: 'fas fa-paint-brush',
                    title: 'Custom Creations',
                    description: 'Original, tailored designs created specifically for your brand and goals.'
                },
                {
                    icon: 'fas fa-sync-alt',
                    title: 'Quick Turnaround',
                    description: 'Fast delivery without compromising on quality or attention to detail.'
                }
            ],
            services: [
                'Logo Design & Branding',
                'Marketing Materials',
                'Social Media Graphics',
                'Web Graphics & Icons',
                'Print Design',
                'Brand Guidelines'
            ]
        }
    };

    // Service Engine Main Class
    class ServiceEngine {
        constructor() {
            this.currentService = null;
            this.config = null;
        }

        // Initialize service page
        init(serviceType) {
            this.currentService = serviceType;
            this.config = serviceConfigs[serviceType];
            
            if (!this.config) {
                console.error(`Service config not found for: ${serviceType}`);
                return;
            }

            this.updateMetaTags();
            this.loadComponents();
            this.populateHeroSection();
            this.generateMainContent();
            this.initializeInteractions();
        }

        // Update meta tags dynamically
        updateMetaTags() {
            const { meta, name, keywords } = this.config;
            const baseUrl = 'https://devbw.github.io/marqtron-media';
            const servicePath = this.getServicePath();

            // Update page title and description
            document.getElementById('page-title').textContent = meta.title;
            document.getElementById('page-description').setAttribute('content', meta.description);
            document.getElementById('page-keywords').setAttribute('content', keywords);
            document.getElementById('page-canonical').setAttribute('href', `${baseUrl}/${servicePath}`);

            // Update Open Graph tags
            document.getElementById('og-url').setAttribute('content', `${baseUrl}/${servicePath}`);
            document.getElementById('og-title').setAttribute('content', meta.title);
            document.getElementById('og-description').setAttribute('content', meta.description);
            document.getElementById('og-image').setAttribute('content', meta.ogImage);

            // Update Twitter tags
            document.getElementById('twitter-url').setAttribute('content', `${baseUrl}/${servicePath}`);
            document.getElementById('twitter-title').setAttribute('content', name);
            document.getElementById('twitter-description').setAttribute('content', meta.description);
            document.getElementById('twitter-image').setAttribute('content', meta.ogImage);

            // Update breadcrumb
            document.getElementById('breadcrumb-service').textContent = name;
        }

        // Load reusable components
        async loadComponents() {
            try {
                // Load header
                const headerResponse = await fetch('_components.html');
                const componentsHTML = await headerResponse.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(componentsHTML, 'text/html');
                
                // Load header component
                const headerTemplate = doc.getElementById('header-component');
                if (headerTemplate) {
                    document.getElementById('header-container').innerHTML = headerTemplate.innerHTML;
                }

                // Load contact component
                const contactTemplate = doc.getElementById('contact-component');
                if (contactTemplate) {
                    let contactHTML = contactTemplate.innerHTML;
                    contactHTML = contactHTML.replace('[CONTACT_TITLE]', `Get Started with ${this.config.name}`);
                    contactHTML = contactHTML.replace('[CONTACT_DESCRIPTION]', `Ready to boost your business with ${this.config.name.toLowerCase()}? Let's discuss your project.`);
                    contactHTML = contactHTML.replace('[FORM_SUBMIT_TEXT]', this.config.primaryCTA);
                    document.getElementById('contact-container').innerHTML = contactHTML;
                }

                // Load footer component
                const footerTemplate = doc.getElementById('footer-component');
                if (footerTemplate) {
                    document.getElementById('footer-container').innerHTML = footerTemplate.innerHTML;
                }

            } catch (error) {
                console.error('Error loading components:', error);
            }
        }

        // Populate hero section
        populateHeroSection() {
            const { name, icon, title, description, primaryCTA, heroStats } = this.config;

            // Update service badge
            document.getElementById('service-icon').className = icon;
            document.getElementById('service-name').textContent = name;

            // Update hero content
            document.getElementById('hero-title').textContent = title;
            document.getElementById('hero-description').textContent = description;
            document.getElementById('primary-cta').textContent = primaryCTA;

            // Update hero stats
            const statsContainer = document.getElementById('hero-stats');
            statsContainer.innerHTML = heroStats.map(stat => `
                <div class="stat">
                    <strong>${stat.value}</strong>
                    <span>${stat.label}</span>
                </div>
            `).join('');

            // Set hero background class
            const heroBackground = document.getElementById('hero-background');
            heroBackground.className = `hero-bg hero-bg-${this.currentService}`;
        }

        // Generate main content sections
        generateMainContent() {
            const { benefits, services } = this.config;
            
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = `
                <!-- Benefits Section -->
                <section class="section bg-light">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Why Choose Our ${this.config.name}?</h2>
                            <p class="section-description">
                                We deliver results that matter to your business growth and success.
                            </p>
                        </div>
                        <div class="benefits-grid">
                            ${benefits.map(benefit => `
                                <div class="benefit-card">
                                    <div class="benefit-icon">
                                        <i class="${benefit.icon}"></i>
                                    </div>
                                    <h4 class="benefit-title">${benefit.title}</h4>
                                    <p class="benefit-description">${benefit.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>

                <!-- Services Included Section -->
                <section class="section bg-white">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">What's Included</h2>
                            <p class="section-description">
                                Comprehensive ${this.config.name.toLowerCase()} services designed to deliver maximum impact.
                            </p>
                        </div>
                        <div class="services-included">
                            <div class="services-included-grid">
                                ${services.map(service => `
                                    <div class="service-included-item">
                                        <i class="fas fa-check-circle service-included-icon"></i>
                                        <div class="service-included-content">
                                            <h4>${service}</h4>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta">
                    <div class="cta-bg"></div>
                    <div class="container">
                        <div class="cta-content">
                            <h2 class="cta-title">Ready to Get Started?</h2>
                            <p class="cta-description">
                                Let's discuss how our ${this.config.name.toLowerCase()} can help grow your business.
                            </p>
                            <div class="cta-buttons">
                                <a href="#contact" class="btn btn-white">${this.config.primaryCTA}</a>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                                    <i class="fab fa-whatsapp"></i> WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }

        // Initialize page interactions
        initializeInteractions() {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Mobile menu toggle
            window.toggleMobileMenu = function() {
                const mobileMenu = document.getElementById('mobileMenu');
                const menuIcon = document.getElementById('menuIcon');
                
                if (mobileMenu) {
                    mobileMenu.classList.toggle('active');
                    menuIcon.classList.toggle('fa-bars');
                    menuIcon.classList.toggle('fa-times');
                }
            };

            // Form submission handling
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', this.handleFormSubmission.bind(this));
            }
        }

        // Handle contact form submission
        handleFormSubmission(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Add service type to submission
            data.serviceType = this.currentService;
            data.serviceName = this.config.name;
            
            // Analytics tracking
            if (window.gtag) {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: this.config.name,
                    value: 1
                });
            }
            
            // Show success message (you can implement actual form submission here)
            alert(`Thank you! We'll contact you about ${this.config.name} soon.`);
        }

        // Get service file path
        getServicePath() {
            const pathMap = {
                seo: 'seo-services.html',
                content: 'content-marketing.html',
                social: 'social-media-marketing.html',
                'web-design': 'web-design-development.html',
                design: 'digital-graphic-design.html'
            };
            return pathMap[this.currentService] || 'service.html';
        }
    }

    // Make ServiceEngine globally available
    window.ServiceEngine = new ServiceEngine();

})(); 