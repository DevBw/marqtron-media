// Marqtron Media Service Worker - Production v2.0
const CACHE_NAME = 'marqtron-media-v2.1';
const STATIC_CACHE = 'marqtron-static-v2.1';
const DYNAMIC_CACHE = 'marqtron-dynamic-v2.1';
const IMAGE_CACHE = 'marqtron-images-v2.1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/seo-services.html',
  '/content-marketing.html',
  '/social-media-marketing.html',
  '/web-design-development.html',
  '/digital-graphic-design.html',
  '/styles.min.css',
  '/enhanced-styles.css',
  '/layout-fixes.css',
  '/shared.js',
  '/script.js',
  '/content-marketing.js',
  '/enhanced-navigation.js',
  '/manifest.json',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png'
];

// Critical external resources
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Caching external assets');
        return cache.addAll(EXTERNAL_ASSETS);
      })
    ]).then(() => {
      console.log('Service Worker: All assets cached successfully');
      return self.skipWaiting();
    }).catch(error => {
      console.error('Service Worker: Failed to cache assets', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE &&
              cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Only cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Image fetch failed', error);
    // Return a fallback image if available
    return caches.match('/images/fallback-image.jpg') || 
           new Response('Image not available', { status: 404 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache immediately
      fetchAndUpdateCache(request, cache);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static asset fetch failed', error);
    return new Response('Asset not available', { status: 404 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Navigation fetch failed, serving from cache', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match('/index.html') || 
           new Response('Offline - Please check your connection', { 
             status: 503,
             headers: { 'Content-Type': 'text/html' }
           });
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API fetch failed, trying cache', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response(JSON.stringify({
      error: 'Network unavailable',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('Content not available offline', { 
      status: 404 
    });
  }
}

// Background fetch and update cache
async function fetchAndUpdateCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Service Worker: Background update failed', error);
  }
}

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.ico') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && 
          request.headers.get('accept').includes('text/html'));
}

function isAPIRequest(url) {
  return url.includes('/api/') ||
         url.includes('api.') ||
         url.includes('/wp-json/') ||
         url.includes('readdy.ai/api');
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync offline form submissions
async function syncContactForms() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingForms = await cache.match('/pending-forms');
    
    if (pendingForms) {
      const forms = await pendingForms.json();
      
      for (const form of forms) {
        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
          
          console.log('Service Worker: Form synced successfully');
        } catch (error) {
          console.log('Service Worker: Form sync failed, will retry', error);
        }
      }
      
      // Clear pending forms after sync
      await cache.delete('/pending-forms');
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Sync analytics data
async function syncAnalytics() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingAnalytics = await cache.match('/pending-analytics');
    
    if (pendingAnalytics) {
      const events = await pendingAnalytics.json();
      
      // Send to Google Analytics or your analytics service
      for (const event of events) {
        try {
          // Example: Send to GA4
          if (typeof gtag !== 'undefined') {
            gtag('event', event.action, event.data);
          }
        } catch (error) {
          console.log('Service Worker: Analytics sync failed', error);
        }
      }
      
      await cache.delete('/pending-analytics');
    }
  } catch (error) {
    console.error('Service Worker: Analytics sync failed', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon-192x192.png',
      badge: '/favicon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/images/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/images/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache size management
setInterval(async () => {
  await limitCacheSize(IMAGE_CACHE, 50); // Limit image cache to 50 items
  await limitCacheSize(DYNAMIC_CACHE, 100); // Limit dynamic cache to 100 items
}, 60000); // Check every minute

// Helper function to limit cache size
async function limitCacheSize(cacheName, size) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > size) {
      const keysToDelete = keys.slice(0, keys.length - size);
      await Promise.all(keysToDelete.map(key => cache.delete(key)));
      console.log(`Service Worker: Cleaned ${keysToDelete.length} items from ${cacheName}`);
    }
  } catch (error) {
    console.error('Service Worker: Cache cleanup failed', error);
  }
}

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    // Log performance metrics
    console.log('Performance:', event.data.data);
  }
});

console.log('Service Worker: Loaded successfully'); 