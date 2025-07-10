// Marqtron Media - Performance Optimization Script v2.1
// Updated: 2024-12-19

(function() {
    'use strict';
    
    // Performance Configuration
    const performanceConfig = {
        lazyLoading: {
            enabled: true,
            rootMargin: '50px',
            threshold: 0.1
        },
        imageOptimization: {
            enabled: true,
            quality: 0.8,
            formats: ['webp', 'avif', 'jpg'],
            sizes: [320, 640, 960, 1280, 1920]
        },
        resourcePreloading: {
            enabled: true,
            criticalCss: ['/styles.min.css'],
            criticalJs: ['/shared.js', '/script.js'],
            fonts: []
        },
        serviceWorker: {
            enabled: true,
            path: '/sw.js',
            scope: '/'
        },
        caching: {
            enabled: true,
            version: '2.1.0'
        }
    };
    
    // Performance utilities
    const utils = {
        // Check if browser supports modern features
        supportsWebP: () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },
        
        supportsAvif: () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        },
        
        // Device and connection detection
        isSlowConnection: () => {
            return navigator.connection && 
                   (navigator.connection.effectiveType === 'slow-2g' || 
                    navigator.connection.effectiveType === '2g');
        },
        
        isMobile: () => {
            return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        // Performance measurement
        measurePerformance: (name, fn) => {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            
            // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`${name} took ${end - start} milliseconds`);
            }
            
            // Send to analytics if available
            if (window.gtag) {
                gtag('event', 'timing_complete', {
                    name: name,
                    value: Math.round(end - start)
                });
            }
            
            return result;
        },
        
        // Debounce function for scroll events
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
        },
        
        // Throttle function for resize events
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };
    
    // Critical CSS inlining
    const inlineCriticalCSS = () => {
        if (!performanceConfig.resourcePreloading.enabled) return;
        
        const criticalCSS = `
            /* Critical CSS - Above the fold styles */
            :root{--primary-color:#c7b345;--text-primary:#2d3748;--bg-primary:#ffffff}
            *{box-sizing:border-box}
            body{margin:0;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:var(--text-primary);background:var(--bg-primary)}
            .header{position:fixed;top:0;left:0;right:0;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);z-index:1020;border-bottom:1px solid #f1f5f9}
            .hero{min-height:100vh;display:flex;align-items:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .btn{display:inline-block;padding:0.75rem 1.5rem;border-radius:0.375rem;text-decoration:none;transition:all 0.3s ease}
            .btn-primary{background:var(--primary-color);color:#fff}
        `;
        
        const style = document.createElement('style');
        style.innerHTML = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    };
    
    // Resource preloading
    const preloadResources = () => {
        if (!performanceConfig.resourcePreloading.enabled) return;
        
        const { criticalCss, criticalJs, fonts } = performanceConfig.resourcePreloading;
        
        // Preload critical CSS
        criticalCss.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            link.onload = () => {
                link.rel = 'stylesheet';
                link.onload = null;
            };
            document.head.appendChild(link);
        });
        
        // Preload critical JavaScript
        criticalJs.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Preload fonts
        fonts.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = href;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // DNS prefetch for external domains
        ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'www.google-analytics.com'].forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    };
    
    // Image lazy loading with Intersection Observer
    const initLazyLoading = () => {
        if (!performanceConfig.lazyLoading.enabled) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load the actual image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load srcset for responsive images
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Handle picture elements
                    if (img.parentElement.tagName === 'PICTURE') {
                        const sources = img.parentElement.querySelectorAll('source');
                        sources.forEach(source => {
                            if (source.dataset.srcset) {
                                source.srcset = source.dataset.srcset;
                                source.removeAttribute('data-srcset');
                            }
                        });
                    }
                    
                    // Add loaded class for CSS transitions
                    img.classList.add('loaded');
                    
                    // Stop observing this image
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: performanceConfig.lazyLoading.rootMargin,
            threshold: performanceConfig.lazyLoading.threshold
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            // Add loading placeholder
            img.style.backgroundColor = '#f0f0f0';
            img.style.minHeight = '200px';
            
            imageObserver.observe(img);
        });
        
        // Background image lazy loading
        const backgroundObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.bg) {
                        element.style.backgroundImage = `url(${element.dataset.bg})`;
                        element.removeAttribute('data-bg');
                        backgroundObserver.unobserve(element);
                    }
                }
            });
        }, {
            rootMargin: performanceConfig.lazyLoading.rootMargin
        });
        
        document.querySelectorAll('[data-bg]').forEach(element => {
            backgroundObserver.observe(element);
        });
    };
    
    // Image optimization and format detection
    const optimizeImages = () => {
        if (!performanceConfig.imageOptimization.enabled) return;
        
        const supportsWebP = utils.supportsWebP();
        const supportsAvif = utils.supportsAvif();
        
        // Replace image sources with optimized versions
        document.querySelectorAll('img').forEach(img => {
            if (img.dataset.src || img.src) {
                const originalSrc = img.dataset.src || img.src;
                
                // Skip if already optimized or external
                if (originalSrc.includes('readdy.ai') || originalSrc.includes('optimized')) {
                    return;
                }
                
                let optimizedSrc = originalSrc;
                
                // Use WebP or AVIF if supported
                if (supportsAvif && !originalSrc.includes('.svg')) {
                    optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
                } else if (supportsWebP && !originalSrc.includes('.svg')) {
                    optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                }
                
                // Add responsive image sizes for mobile
                if (utils.isMobile()) {
                    optimizedSrc += '?w=800&q=75';
                } else {
                    optimizedSrc += '?w=1200&q=80';
                }
                
                if (img.dataset.src) {
                    img.dataset.src = optimizedSrc;
                } else {
                    img.src = optimizedSrc;
                }
            }
        });
    };
    
    // Service Worker registration
    const registerServiceWorker = () => {
        if (!performanceConfig.serviceWorker.enabled || !('serviceWorker' in navigator)) {
            return;
        }
        
        navigator.serviceWorker.register(performanceConfig.serviceWorker.path, {
            scope: performanceConfig.serviceWorker.scope
        })
        .then(registration => {
            // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Service Worker registered successfully:', registration);
            }
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content is available, prompt user to refresh
                        showUpdatePrompt();
                    }
                });
            });
        })
        .catch(error => {
            // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Service Worker registration failed:', error);
            }
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
                // Only log in development
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Cache updated successfully');
                }
            }
        });
    };
    
    // Show update prompt when new version is available
    const showUpdatePrompt = () => {
        const updateBanner = document.createElement('div');
        updateBanner.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; background: #c7b345; color: white; padding: 1rem; z-index: 10001; text-align: center;">
                <span>A new version is available! </span>
                <button onclick="window.location.reload()" style="background: white; color: #c7b345; border: none; padding: 0.5rem 1rem; margin-left: 1rem; border-radius: 4px; cursor: pointer;">
                    Update Now
                </button>
                <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; margin-left: 0.5rem; border-radius: 4px; cursor: pointer;">
                    Later
                </button>
            </div>
        `;
        document.body.insertBefore(updateBanner, document.body.firstChild);
    };
    
    // Core Web Vitals optimization
    const optimizeWebVitals = () => {
        // Largest Contentful Paint (LCP) optimization
        const optimizeLCP = () => {
            // Preload hero images
            const heroImages = document.querySelectorAll('.hero img, .hero-bg');
            heroImages.forEach(img => {
                if (img.src || img.dataset.src) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = img.src || img.dataset.src;
                    document.head.appendChild(link);
                }
            });
            
            // Optimize above-the-fold content
            const aboveFoldElements = document.querySelectorAll('.hero, .header, .hero-content');
            aboveFoldElements.forEach(element => {
                element.style.contentVisibility = 'auto';
                element.style.containIntrinsicSize = '1px 500px';
            });
        };
        
        // First Input Delay (FID) optimization
        const optimizeFID = () => {
            // Defer non-critical JavaScript
            const nonCriticalScripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
            nonCriticalScripts.forEach(script => {
                if (!script.src.includes('analytics') && !script.src.includes('shared')) {
                    script.defer = true;
                }
            });
            
            // Break up long tasks
            const processTasksInChunks = (tasks, chunkSize = 5) => {
                const chunks = [];
                for (let i = 0; i < tasks.length; i += chunkSize) {
                    chunks.push(tasks.slice(i, i + chunkSize));
                }
                
                const processChunk = (chunkIndex) => {
                    if (chunkIndex >= chunks.length) return;
                    
                    chunks[chunkIndex].forEach(task => task());
                    
                    // Schedule next chunk
                    setTimeout(() => processChunk(chunkIndex + 1), 0);
                };
                
                processChunk(0);
            };
            
            // Apply to initialization tasks
            window.processTasksInChunks = processTasksInChunks;
        };
        
        // Cumulative Layout Shift (CLS) optimization
        const optimizeCLS = () => {
            // Set explicit dimensions for images
            document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
                // Set aspect ratio to prevent layout shift
                img.style.aspectRatio = '16/9';
                img.style.width = '100%';
                img.style.height = 'auto';
            });
            
            // Reserve space for dynamic content
            const dynamicElements = document.querySelectorAll('.testimonials-grid, .services-grid, .portfolio-grid');
            dynamicElements.forEach(element => {
                element.style.minHeight = '300px';
            });
            
            // Preload custom fonts to prevent FOIT/FOUT
            const fontPreloads = [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2'
            ];
            
            fontPreloads.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'font';
                link.type = 'font/woff2';
                link.href = href;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        };
        
        optimizeLCP();
        optimizeFID();
        optimizeCLS();
    };
    
    // Resource hints
    const addResourceHints = () => {
        // Preconnect to external domains
        const preconnectDomains = [
            'https://cdnjs.cloudflare.com',
            'https://cdn.jsdelivr.net',
            'https://www.google-analytics.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // Prefetch likely next pages
        const nextPages = [
            '/seo-services.html',
            '/content-marketing.html',
            '/social-media-marketing.html',
            '/contact.html'
        ];
        
        // Add prefetch after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                nextPages.forEach(href => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                });
            }, 2000);
        });
    };
    
    // Performance monitoring
    const monitorPerformance = () => {
        // Monitor key metrics
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'navigation') {
                    // Only log in development
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('Navigation timing:', {
                        dns: entry.domainLookupEnd - entry.domainLookupStart,
                        tcp: entry.connectEnd - entry.connectStart,
                        request: entry.responseStart - entry.requestStart,
                        response: entry.responseEnd - entry.responseStart,
                        dom: entry.domContentLoadedEventEnd - entry.responseEnd,
                        load: entry.loadEventEnd - entry.loadEventStart
                    });
                    }
                }
                
                if (entry.entryType === 'resource') {
                    // Monitor slow resources
                    if (entry.duration > 1000) {
                        // Only log in development
                        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.warn('Slow resource:', entry.name, `${entry.duration}ms`);
                        }
                    }
                }
                
                if (entry.entryType === 'measure') {
                    // Only log in development
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('Custom timing:', entry.name, `${entry.duration}ms`);
                    }
                }
            });
        });
        
        // Observe different entry types
        try {
            observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
        } catch (e) {
            // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Performance Observer not supported');
            }
        }
        
        // Memory usage monitoring (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    // Only log in development
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.warn('High memory usage detected');
                    }
                }
            }, 30000);
        }
    };
    
    // Initialize all optimizations
    const init = () => {
        // Early optimizations
        inlineCriticalCSS();
        preloadResources();
        addResourceHints();
        
        // DOM ready optimizations
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initLazyLoading();
                optimizeImages();
                optimizeWebVitals();
            });
        } else {
            initLazyLoading();
            optimizeImages();
            optimizeWebVitals();
        }
        
        // Window load optimizations
        window.addEventListener('load', () => {
            registerServiceWorker();
            monitorPerformance();
            
            // Send performance data to analytics
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation && window.gtag) {
                    gtag('event', 'timing_complete', {
                        name: 'page_load_time',
                        value: Math.round(navigation.loadEventEnd - navigation.fetchStart)
                    });
                }
            }, 0);
        });
    };
    
    // Export performance utilities for external use
    window.MarqtronPerformance = {
        measurePerformance: utils.measurePerformance,
        lazyLoadImage: (img) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            }
        },
        preloadResource: (href, as = 'script') => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = as;
            link.href = href;
            document.head.appendChild(link);
        }
    };
    
    // Initialize performance optimizations
    init();
    
})(); 