// Content Marketing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initContentChart();
    initCaseStudyCarousel();
    addSmoothScrolling();
    // Form handling now in shared.js
    // Animation handling now in shared.js
    addScrollToTop();
    initializeCharts();
    initializeCalendar();
    initializeEventListeners();
    updateCurrentYear();
    startRealTimeUpdates();
    initializeChart();
    initializeContentTypes();
    startContentCarousel();
});

// Initialize Content Performance Chart using shared utilities
function initContentChart() {
    if (window.chartUtils) {
        return window.chartUtils.content('content-chart');
    } else {
        console.warn('Chart utilities not loaded');
    }
}

// Initialize Case Study Carousel
function initCaseStudyCarousel() {
    let currentCase = 0;
    const caseStudies = document.querySelectorAll('.case-study');
    const dots = document.querySelectorAll('.case-study-dots .dot');
    let autoRotateInterval;

    // Show specific case study
    function showCaseStudy(index) {
        // Hide all case studies
        caseStudies.forEach(study => {
            study.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current case study
        if (caseStudies[index]) {
            caseStudies[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentCase = index;
    }

    // Next case study
    function nextCaseStudy() {
        const nextIndex = (currentCase + 1) % caseStudies.length;
        showCaseStudy(nextIndex);
    }

    // Auto-rotate case studies
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextCaseStudy, 6000);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoRotate();
            showCaseStudy(index);
            startAutoRotate();
        });
    });

    // Start auto-rotation
    startAutoRotate();

    // Pause auto-rotation on hover
    const caseStudiesContainer = document.querySelector('.case-studies-container');
    if (caseStudiesContainer) {
        caseStudiesContainer.addEventListener('mouseenter', stopAutoRotate);
        caseStudiesContainer.addEventListener('mouseleave', startAutoRotate);
    }
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
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
}

// Note: Form handling moved to shared.js to avoid duplication

// Note: Animation utilities moved to shared.js to avoid duplication

// Scroll to top functionality
function addScrollToTop() {
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
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Content Marketing Dashboard JavaScript

// Global variables
let contentTrendsChart, contentTypeChart;
let currentDate = new Date();
let currentCalendarView = 'month';

// Note: Mobile menu toggle and scroll functions moved to shared.js to avoid duplication

// Initialize all charts
function initializeCharts() {
    initializeSparklines();
    initializeContentTrendsChart();
    initializeContentTypeChart();
}

// Initialize sparkline charts using shared utilities
function initializeSparklines() {
    const sparklineIds = ['pageViewsSparkline', 'timeSparkline', 'sharesSparkline', 'visitorsSparkline', 'conversionSparkline', 'organicSparkline'];
    
    if (!window.chartUtils) {
        console.warn('Chart utilities not loaded');
        return;
    }
    
    sparklineIds.forEach(id => {
        const data = window.chartUtils.data(7, 10, 100);
        window.chartUtils.sparkline(id, data, '#4F46E5');
    });
}

// Initialize content trends chart using shared utilities
function initializeContentTrendsChart() {
    if (!window.chartUtils) {
        console.warn('Chart utilities not loaded');
        return;
    }
    
    const labels = window.chartUtils.dates(30);
    const datasets = [
        {
            name: 'Page Views',
            data: window.chartUtils.data(30, 1000, 5000),
            color: '#4F46E5'
        },
        {
            name: 'Social Shares',
            data: window.chartUtils.data(30, 50, 500),
            color: '#10B981'
        },
        {
            name: 'Conversions',
            data: window.chartUtils.data(30, 5, 50),
            color: '#F59E0B'
        }
    ];
    
    contentTrendsChart = window.chartUtils.performance('contentTrendsChart', labels, datasets);
}

// Initialize content type chart
function initializeContentTypeChart() {
    const chartElement = document.getElementById('contentTypeChart');
    if (!chartElement) return;

    contentTypeChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Content Type',
                type: 'pie',
                radius: '60%',
                data: [
                    { value: 35, name: 'Blog Posts', itemStyle: { color: '#4F46E5' } },
                    { value: 25, name: 'Social Media', itemStyle: { color: '#10B981' } },
                    { value: 20, name: 'Videos', itemStyle: { color: '#F59E0B' } },
                    { value: 15, name: 'Infographics', itemStyle: { color: '#EF4444' } },
                    { value: 5, name: 'Others', itemStyle: { color: '#8B5CF6' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    contentTypeChart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', () => {
        contentTypeChart.resize();
    });
}

// Initialize editorial calendar
function initializeCalendar() {
    renderCalendar();
}

// Render calendar
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonth = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonth) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerHTML = `
            <span class="day-number">${day}</span>
            <div class="day-content">
                ${getCalendarContent(year, month, day)}
            </div>
        `;
        
        // Highlight today
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Get calendar content for specific day
function getCalendarContent(year, month, day) {
    // Sample content for demonstration
    const sampleContent = {
        10: '<div class="content-item">SEO Guide</div>',
        15: '<div class="content-item">Social Post</div><div class="content-item">Newsletter</div>',
        20: '<div class="content-item">Blog Post</div>',
        25: '<div class="content-item">Video</div>'
    };
    
    return sampleContent[day] || '';
}

// Calendar navigation
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Initialize event listeners
function initializeEventListeners() {
    // Date range selector
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateChartData(this.dataset.range);
        });
    });
    
    // Calendar view buttons
    document.querySelectorAll('.calendar-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.calendar-view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCalendarView = this.dataset.view;
            renderCalendar();
        });
    });
    
    // Content type filter
    const contentTypeFilter = document.getElementById('contentTypeFilter');
    if (contentTypeFilter) {
        contentTypeFilter.addEventListener('change', function() {
            filterContent(this.value);
        });
    }
    
    // Refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });
    }
    
    // Create content button
    const createContentBtn = document.querySelector('.create-content-btn');
    if (createContentBtn) {
        createContentBtn.addEventListener('click', function() {
            openContentCreator();
        });
    }
    
    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Pipeline drag and drop (simplified)
    initializeDragAndDrop();
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Initialize drag and drop for content pipeline
function initializeDragAndDrop() {
    const contentItems = document.querySelectorAll('.content-item');
    
    contentItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.innerHTML);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    const stageColumns = document.querySelectorAll('.stage-column');
    
    stageColumns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            // Content moved successfully - could trigger analytics event here
        });
    });
}

// Content management functions
function openContentPlanner() {
    // Implementation would open a modal or navigate to content planner
    showNotification('Content planner opened', 'info');
}

function openContentCreator() {
    // Implementation would open content creation interface
    showNotification('Content creator opened', 'info');
}

function filterContent(contentType) {
    // Implementation would filter content items
    const contentItems = document.querySelectorAll('.content-item');
    contentItems.forEach(item => {
        if (contentType === 'all' || item.dataset.contentType === contentType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Chart update functions
function updateChartData(range) {
    if (!window.chartUtils) return;
    
    if (contentTrendsChart) {
        const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;
        const labels = window.chartUtils.dates(days);
        const datasets = [
            {
                name: 'Page Views',
                data: window.chartUtils.data(days, 1000, 5000),
                color: '#4F46E5'
            },
            {
                name: 'Social Shares',
                data: window.chartUtils.data(days, 50, 500),
                color: '#10B981'
            },
            {
                name: 'Conversions',
                data: window.chartUtils.data(days, 5, 50),
                color: '#F59E0B'
            }
        ];
        
        // Update chart with new data
        contentTrendsChart = window.chartUtils.performance('contentTrendsChart', labels, datasets);
    }
}

function refreshData() {
    // Add loading state
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.classList.add('loading');
    
    // Simulate data refresh
    setTimeout(() => {
        refreshBtn.classList.remove('loading');
        // Update charts and data
        if (contentTrendsChart) contentTrendsChart.resize();
        if (contentTypeChart) contentTypeChart.resize();
        updateMetrics();
    }, 2000);
}

function updateMetrics() {
    // Simulate metric updates
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(metric => {
        // Add subtle animation to show update
        metric.style.opacity = '0.7';
        setTimeout(() => {
            metric.style.opacity = '1';
        }, 300);
    });
}

function showNotifications() {
    // Implementation would show notification panel
    const notifications = [
        'New content approval needed',
        'Blog post performance report ready',
        'Content calendar updated'
    ];
    
    notifications.forEach((message, index) => {
        setTimeout(() => {
            showNotification(message, 'info');
        }, index * 1500);
    });
}

// Real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        updateMetricValues();
    }, 30000); // Update every 30 seconds
}

function updateMetricValues() {
    // Simulate real-time data updates
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const changeElement = card.querySelector('.metric-change');
        if (changeElement) {
            // Randomly update the percentage
            const isPositive = Math.random() > 0.3;
            const change = (Math.random() * 30).toFixed(1);
            changeElement.innerHTML = `<i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> ${change}%`;
            changeElement.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
        }
    });
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show success message
    showNotification('Thank you! We\'ll get back to you within 24 hours with your free content audit.', 'success');
    
    // Reset form
    event.target.reset();
}

// Utility functions
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Content pipeline management
function moveContentItem(itemId, fromStage, toStage) {
    // Implementation would update the content pipeline
    updateStageCount(fromStage);
    updateStageCount(toStage);
    showNotification(`Content moved from ${fromStage} to ${toStage}`, 'success');
}

function updateStageCount(stageId) {
    const stageElement = document.getElementById(stageId);
    if (stageElement) {
        const items = stageElement.querySelectorAll('.content-item');
        const countElement = stageElement.querySelector('.stage-count');
        if (countElement) {
            countElement.textContent = items.length;
        }
    }
}

// Content analytics functions
function trackContentPerformance(contentId) {
    // Implementation would track content metrics
    const metrics = {
        views: Math.floor(Math.random() * 10000),
        shares: Math.floor(Math.random() * 1000),
        engagementRate: (Math.random() * 10).toFixed(2)
    };
    return metrics;
}

function generateContentReport() {
    // Implementation would generate and download report
    showNotification('Generating content performance report...', 'info');
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
    }, 2000);
}

// Social sharing functions
function shareContent(contentId, platform) {
    // Implementation would handle social sharing
    showNotification(`Content shared on ${platform}`, 'success');
} 

// Content Marketing - Page Specific JavaScript
// ===========================================

// Global variables
let contentChart = null;
let activeContentType = 0;
let contentInterval = null;

// Chart initialization
function initializeChart() {
    const chartContainer = document.getElementById('contentChart');
    if (chartContainer) {
        contentChart = echarts.init(chartContainer);
        
        const option = {
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Blog Traffic', 'Email Subscribers', 'Social Shares', 'Lead Generation']
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
                    name: 'Blog Traffic',
                    type: 'line',
                    data: [800, 1200, 1800, 2500, 3200, 4100],
                    color: '#4F46E5'
                },
                {
                    name: 'Email Subscribers',
                    type: 'line',
                    data: [150, 280, 450, 680, 950, 1300],
                    color: '#10B981'
                },
                {
                    name: 'Social Shares',
                    type: 'bar',
                    data: [50, 120, 200, 350, 520, 750],
                    color: '#F59E0B'
                },
                {
                    name: 'Lead Generation',
                    type: 'line',
                    data: [25, 45, 78, 120, 180, 250],
                    color: '#EF4444'
                }
            ]
        };
        
        contentChart.setOption(option);
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (contentChart) {
                contentChart.resize();
            }
        });
    }
}

// Content Types functionality
function initializeContentTypes() {
    const contentTypes = [
        {
            type: "Blog Posts & Articles",
            description: "Engaging, SEO-optimized content that educates your audience and drives organic traffic",
            benefits: [
                "Improves search engine rankings",
                "Establishes thought leadership",
                "Drives organic traffic",
                "Generates leads through content"
            ],
            examples: [
                "How-to guides and tutorials",
                "Industry insights and trends",
                "Case studies and success stories",
                "Expert interviews and Q&As"
            ],
            metrics: {
                traffic: "+280%",
                leads: "+156%",
                engagement: "+89%"
            }
        },
        {
            type: "Email Marketing Campaigns",
            description: "Strategic email sequences that nurture leads and drive conversions",
            benefits: [
                "Builds customer relationships",
                "Increases conversion rates",
                "Provides measurable ROI",
                "Automates lead nurturing"
            ],
            examples: [
                "Welcome email sequences",
                "Educational drip campaigns",
                "Promotional newsletters",
                "Re-engagement campaigns"
            ],
            metrics: {
                openRate: "+45%",
                clickRate: "+67%",
                conversions: "+89%"
            }
        },
        {
            type: "Social Media Content",
            description: "Platform-specific content that increases brand awareness and engagement",
            benefits: [
                "Increases brand visibility",
                "Drives website traffic",
                "Builds community engagement",
                "Improves brand loyalty"
            ],
            examples: [
                "Platform-specific posts",
                "Video content and stories",
                "User-generated content",
                "Live streaming and events"
            ],
            metrics: {
                reach: "+320%",
                engagement: "+156%",
                followers: "+89%"
            }
        }
    ];

    function renderContentType(contentType) {
        const contentContainer = document.getElementById('contentTypeContent');
        if (!contentContainer) return;

        contentContainer.innerHTML = `
            <div class="content-type-content">
                <div class="content-type-header">
                    <h3>${contentType.type}</h3>
                    <p class="content-description">${contentType.description}</p>
                </div>
                
                <div class="content-type-body">
                    <div class="benefits-examples">
                        <div class="benefits">
                            <h4>Key Benefits</h4>
                            <ul>
                                ${contentType.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="examples">
                            <h4>Content Examples</h4>
                            <ul>
                                ${contentType.examples.map(example => `<li>${example}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="content-metrics">
                        <h4>Typical Results</h4>
                        <div class="metrics-grid">
                            ${Object.entries(contentType.metrics).map(([key, value]) => `
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

    function setContentType(index) {
        if (index >= 0 && index < contentTypes.length) {
            activeContentType = index;
            renderContentType(contentTypes[index]);
            
            // Update navigation dots
            const dots = document.querySelectorAll('.content-type-dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // Initialize content type navigation
    const contentTypeDots = document.querySelectorAll('.content-type-dot');
    contentTypeDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setContentType(index);
            restartContentCarousel();
        });
    });

    // Initialize with first content type
    setContentType(0);
}

function nextContentType() {
    const totalContentTypes = 3;
    const nextIndex = (activeContentType + 1) % totalContentTypes;
    setContentType(nextIndex);
}

function previousContentType() {
    const totalContentTypes = 3;
    const prevIndex = (activeContentType - 1 + totalContentTypes) % totalContentTypes;
    setContentType(prevIndex);
}

function startContentCarousel() {
    contentInterval = setInterval(nextContentType, 8000);
}

function restartContentCarousel() {
    if (contentInterval) {
        clearInterval(contentInterval);
        startContentCarousel();
    }
} 