// Marqtron Media - Production Analytics & Tracking v2.1
// Updated: 2024-12-19

(function() {
    'use strict';
    
    // Configuration
    const config = {
        googleAnalytics: {
            measurementId: 'G-XXXXXXXXXX', // TODO: Replace with actual GA4 Measurement ID before deployment
            enabled: true
        },
        googleTagManager: {
            containerId: 'GTM-XXXXXXX', // Replace with actual GTM Container ID
            enabled: true
        },
        facebookPixel: {
            pixelId: 'XXXXXXXXXXXXXXXXX', // Replace with actual Facebook Pixel ID
            enabled: true
        },
        linkedInInsight: {
            partnerId: 'XXXXXXX', // Replace with actual LinkedIn Partner ID
            enabled: true
        },
        hotjar: {
            hjid: 'XXXXXXX', // Replace with actual Hotjar ID
            hjsv: 6,
            enabled: false // Enable only if needed
        },
        performanceMonitoring: {
            enabled: true,
            vitalsThreshold: {
                cls: 0.1,
                fid: 100,
                lcp: 2500
            }
        },
        errorTracking: {
            enabled: true,
            endpoint: '/api/errors' // Custom error reporting endpoint
        },
        userSession: {
            enabled: true,
            trackScrollDepth: true,
            trackTimeOnPage: true,
            trackClicks: true
        }
    };
    
    // Utility functions
    const utils = {
        isBot: () => /bot|crawler|spider|crawling/i.test(navigator.userAgent),
        isLocalhost: () => location.hostname === 'localhost' || location.hostname === '127.0.0.1',
        getCookie: (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
        setCookie: (name, value, days = 365) => {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
        },
        generateUserId: () => {
            return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        },
        debounce: (func, wait) => {
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
    };
    
    // Conditional logging utility
    const log = {
        info: (message, ...args) => {
            if (utils.isLocalhost()) {
                console.log(message, ...args);
            }
        },
        warn: (message, ...args) => {
            if (utils.isLocalhost()) {
                console.warn(message, ...args);
            }
        },
        error: (message, ...args) => {
            // Always log errors, but conditionally
            if (utils.isLocalhost()) {
                console.error(message, ...args);
            }
        }
    };
    
    // Skip analytics for bots and localhost
    if (utils.isBot() || utils.isLocalhost()) {
        log.info('Analytics disabled for bot/localhost');
        return;
    }
    
    // Privacy compliance check
    const hasConsent = utils.getCookie('analytics-consent') === 'true';
    if (!hasConsent) {
        log.info('Analytics consent not given');
        showConsentBanner();
        return;
    }
    
    // Initialize analytics
    let analyticsInitialized = false;
    
    // Google Analytics 4 (GA4)
    const initGoogleAnalytics = () => {
        if (!config.googleAnalytics.enabled || !config.googleAnalytics.measurementId) return;
        
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.measurementId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', config.googleAnalytics.measurementId, {
            anonymize_ip: true,
            respect_dnt: true,
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'page_type',
                'custom_parameter_2': 'user_type'
            }
        });
        
        // Enhanced ecommerce for contact forms
        gtag('config', config.googleAnalytics.measurementId, {
            enhanced_ecommerce: true
        });
        
        log.info('Google Analytics initialized');
    };
    
    // Google Tag Manager
    const initGoogleTagManager = () => {
        if (!config.googleTagManager.enabled || !config.googleTagManager.containerId) return;
        
        // GTM script
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',config.googleTagManager.containerId);
        
        log.info('Google Tag Manager initialized');
    };
    
    // Facebook Pixel
    const initFacebookPixel = () => {
        if (!config.facebookPixel.enabled || !config.facebookPixel.pixelId) return;
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', config.facebookPixel.pixelId);
        fbq('track', 'PageView');
        
        log.info('Facebook Pixel initialized');
    };
    
    // LinkedIn Insight Tag
    const initLinkedInInsight = () => {
        if (!config.linkedInInsight.enabled || !config.linkedInInsight.partnerId) return;
        
        _linkedin_partner_id = config.linkedInInsight.partnerId;
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        
        (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
        
        log.info('LinkedIn Insight Tag initialized');
    };
    
    // Hotjar (optional)
    const initHotjar = () => {
        if (!config.hotjar.enabled || !config.hotjar.hjid) return;
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:config.hotjar.hjid,hjsv:config.hotjar.hjsv};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        
        log.info('Hotjar initialized');
    };
    
    // Core Web Vitals monitoring
    const initPerformanceMonitoring = () => {
        if (!config.performanceMonitoring.enabled) return;
        
        // Load Web Vitals library
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
        script.onload = () => {
            const {getCLS, getFID, getFCP, getLCP, getTTFB} = webVitals;
            
            function sendToAnalytics(metric) {
                // Send to Google Analytics
                if (window.gtag) {
                    gtag('event', metric.name, {
                        event_category: 'Web Vitals',
                        event_label: metric.id,
                        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                        non_interaction: true
                    });
                }
                
                // Send to custom endpoint
                fetch('/api/vitals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        metric: metric.name,
                        value: metric.value,
                        id: metric.id,
                        url: window.location.href,
                        timestamp: Date.now()
                    })
                }).catch(log.error);
                
                // Check against thresholds
                const thresholds = config.performanceMonitoring.vitalsThreshold;
                if (
                    (metric.name === 'CLS' && metric.value > thresholds.cls) ||
                    (metric.name === 'FID' && metric.value > thresholds.fid) ||
                    (metric.name === 'LCP' && metric.value > thresholds.lcp)
                ) {
                    log.warn(`Poor ${metric.name} score:`, metric.value);
                }
            }
            
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
        };
        document.head.appendChild(script);
        
        log.info('Performance monitoring initialized');
    };
    
    // Error tracking
    const initErrorTracking = () => {
        if (!config.errorTracking.enabled) return;
        
        window.addEventListener('error', (event) => {
            const errorData = {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error ? event.error.stack : null,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            };
            
            // Send to analytics
            if (window.gtag) {
                gtag('event', 'exception', {
                    description: event.message,
                    fatal: false
                });
            }
            
            // Send to custom endpoint
            fetch(config.errorTracking.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            }).catch(() => {}); // Silent fail for error reporting
        });
        
        // Promise rejection tracking
        window.addEventListener('unhandledrejection', (event) => {
            const errorData = {
                type: 'unhandledrejection',
                reason: event.reason,
                url: window.location.href,
                timestamp: Date.now()
            };
            
            if (window.gtag) {
                gtag('event', 'exception', {
                    description: 'Unhandled Promise Rejection',
                    fatal: false
                });
            }
            
            fetch(config.errorTracking.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            }).catch(() => {});
        });
        
        log.info('Error tracking initialized');
    };
    
    // User session tracking
    const initUserSession = () => {
        if (!config.userSession.enabled) return;
        
        const sessionData = {
            userId: utils.getCookie('user_id') || utils.generateUserId(),
            sessionId: 'session_' + Date.now(),
            startTime: Date.now(),
            pageviews: 1,
            scrollDepth: 0,
            clicks: 0,
            timeOnPage: 0
        };
        
        // Set user ID cookie
        utils.setCookie('user_id', sessionData.userId);
        
        // Scroll depth tracking
        if (config.userSession.trackScrollDepth) {
            let maxScroll = 0;
            const trackScroll = utils.debounce(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    sessionData.scrollDepth = maxScroll;
                    
                    // Send milestone events
                    if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                        if (window.gtag) {
                            gtag('event', 'scroll', {
                                event_category: 'engagement',
                                event_label: `${scrollPercent}%`,
                                value: scrollPercent
                            });
                        }
                    }
                }
            }, 100);
            
            window.addEventListener('scroll', trackScroll);
        }
        
        // Click tracking
        if (config.userSession.trackClicks) {
            document.addEventListener('click', (event) => {
                sessionData.clicks++;
                
                const target = event.target;
                const tagName = target.tagName.toLowerCase();
                const elementInfo = {
                    tag: tagName,
                    text: target.textContent ? target.textContent.substring(0, 50) : '',
                    href: target.href || '',
                    class: target.className || '',
                    id: target.id || ''
                };
                
                // Track important clicks
                if (tagName === 'a' || tagName === 'button' || target.onclick) {
                    if (window.gtag) {
                        gtag('event', 'click', {
                            event_category: 'engagement',
                            event_label: elementInfo.text || elementInfo.href || 'Unknown',
                            custom_parameters: {
                                element_tag: tagName,
                                element_href: elementInfo.href
                            }
                        });
                    }
                }
            });
        }
        
        // Time on page tracking
        if (config.userSession.trackTimeOnPage) {
            const startTime = Date.now();
            
            const sendTimeOnPage = () => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                sessionData.timeOnPage = timeOnPage;
                
                // Send session data
                fetch('/api/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionData)
                }).catch(() => {});
            };
            
            // Send on page unload
            window.addEventListener('beforeunload', sendTimeOnPage);
            
            // Send every 30 seconds for long sessions
            setInterval(() => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                if (timeOnPage > 30 && timeOnPage % 30 === 0) {
                    sendTimeOnPage();
                }
            }, 1000);
        }
        
        log.info('User session tracking initialized');
    };
    
    // Form tracking
    const initFormTracking = () => {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const formData = new FormData(form);
            const formInfo = {
                action: form.action || window.location.href,
                method: form.method || 'GET',
                fields: formData.has('email') ? 'contact' : 'unknown'
            };
            
            // Track form submission
            if (window.gtag) {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: formInfo.fields,
                    value: 1
                });
            }
            
            // Track conversion for contact forms
            if (formData.has('email')) {
                // Google Analytics conversion
                if (window.gtag) {
                    gtag('event', 'conversion', {
                        send_to: config.googleAnalytics.measurementId + '/contact_form'
                    });
                }
                
                // Facebook Pixel conversion
                if (window.fbq) {
                    fbq('track', 'Lead');
                }
                
                // LinkedIn conversion
                if (window.lintrk) {
                    lintrk('track', { conversion_id: 'XXXXXXX' }); // Replace with actual conversion ID
                }
            }
        });
        
        log.info('Form tracking initialized');
    };
    
    // Consent banner
    function showConsentBanner() {
        if (document.getElementById('analytics-consent-banner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'analytics-consent-banner';
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #2c3e50; color: white; padding: 1rem; z-index: 10000; text-align: center; font-family: sans-serif;">
                <p style="margin: 0 0 1rem 0;">We use cookies and analytics to improve your experience. By continuing to use our site, you agree to our use of cookies.</p>
                <button onclick="acceptAnalytics()" style="background: #c7b345; color: white; border: none; padding: 0.5rem 1rem; margin: 0 0.5rem; border-radius: 4px; cursor: pointer;">Accept</button>
                <button onclick="declineAnalytics()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; margin: 0 0.5rem; border-radius: 4px; cursor: pointer;">Decline</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        // Global functions for banner buttons
        window.acceptAnalytics = () => {
            utils.setCookie('analytics-consent', 'true', 365);
            banner.remove();
            initializeAnalytics();
        };
        
        window.declineAnalytics = () => {
            utils.setCookie('analytics-consent', 'false', 365);
            banner.remove();
        };
    }
    
    // Initialize all analytics
    function initializeAnalytics() {
        if (analyticsInitialized) return;
        
        initGoogleAnalytics();
        initGoogleTagManager();
        initFacebookPixel();
        initLinkedInInsight();
        initHotjar();
        initPerformanceMonitoring();
        initErrorTracking();
        initUserSession();
        initFormTracking();
        
        analyticsInitialized = true;
        log.info('All analytics initialized');
    }
    
    // Initialize if consent is already given
    if (hasConsent) {
        initializeAnalytics();
    }
    
    // Page view tracking for SPAs
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            
            if (window.gtag) {
                gtag('config', config.googleAnalytics.measurementId, {
                    page_path: window.location.pathname,
                    page_title: document.title
                });
            }
        }
    });
    
    observer.observe(document, { subtree: true, childList: true });
    
    // Expose analytics API for custom tracking
    window.MarqtronAnalytics = {
        track: (event, parameters = {}) => {
            if (window.gtag) {
                gtag('event', event, parameters);
            }
        },
        trackConversion: (conversionLabel) => {
            if (window.gtag) {
                gtag('event', 'conversion', {
                    send_to: `${config.googleAnalytics.measurementId}/${conversionLabel}`
                });
            }
        },
        setUserProperty: (property, value) => {
            if (window.gtag) {
                gtag('config', config.googleAnalytics.measurementId, {
                    custom_map: { [property]: value }
                });
            }
        }
    };
    
})(); 