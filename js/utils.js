/**
 * Utility functions used across the entire application
 * Keeps common functionality centralized and reusable
 */

// DOM manipulation helpers
const DOMUtils = {
    // Select elements with error handling
    query(selector, parent = document) {
        const element = parent.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Create element with class and attributes
    createElement(tag, className = '', attributes = {}) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
        return el;
    },

    // Add event listener with error handling
    on(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            return () => element.removeEventListener(event, handler);
        }
    },

    // Toggle class on element
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }
};

// Time formatting utilities
const TimeUtils = {
    // Format time as HH:MM
    formatTime(date) {
        return date.toTimeString().slice(0, 5);
    },

    // Convert minutes to HH:MM:SS
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
    },

    // Get time until alarm
    timeUntil(alarmTime) {
        const now = new Date();
        const alarm = new Date();
        const [hours, minutes] = alarmTime.split(':').map(Number);
        alarm.setHours(hours, minutes, 0, 0);
        
        if (alarm <= now) {
            alarm.setDate(alarm.getDate() + 1);
        }
        
        return Math.round((alarm - now) / 1000 / 60); // minutes
    }
};

// LocalStorage wrapper with error handling
const StorageUtils = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Storage read error for ${key}:`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Storage write error for ${key}:`, error);
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Storage remove error for ${key}:`, error);
        }
    }
};

// Animation utilities
const AnimationUtils = {
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        requestAnimationFrame(() => {
            element.style.transition = `opacity ${duration}ms ease-in`;
            element.style.opacity = '1';
        });
    },

    fadeOut(element, duration = 300, callback) {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, duration);
    }
};

// Export all utilities
window.Utils = {
    DOM: DOMUtils,
    Time: TimeUtils,
    Storage: StorageUtils,
    Animation: AnimationUtils
};
