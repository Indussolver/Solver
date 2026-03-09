/**
 * Main application entry point
 * Handles navigation, theme switching, and global state
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initPageLoad();
});

/**
 * Initialize navigation highlighting
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        Utils.DOM.on(link, 'click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked link
            link.classList.add('active');
        });
    });
}

/**
 * Initialize theme toggle (respects system preference)
 */
function initThemeToggle() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = Utils.Storage.get('theme');
    
    if (savedTheme === 'dark' || (savedTheme === null && isDark)) {
        document.documentElement.classList.add('dark');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
        if (!Utils.Storage.get('theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
        }
    });
}

/**
 * Page-specific initialization based on current page
 */
function initPageLoad() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '');
    
    // Trigger page-specific init
    if (window[`init${capitalize(pageName)}Page`]) {
        window[`init${capitalize(pageName)}Page`]();
    }
}

/**
 * Helper to capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

