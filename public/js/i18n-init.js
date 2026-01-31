/**
 * Enhanced i18n Initialization Script
 * Ensures all pages support i18next-style translations and language switching
 * This script wraps the main content and sets up language selectors properly
 */

(function() {
    // Configuration for i18next-style language codes
    const LANGUAGE_CONFIG = {
        'en': { name: 'English', nativeName: 'English' },
        'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
        'mr': { name: 'Marathi', nativeName: 'मराठी' }
    };

    // Initialize language from localStorage or browser preference
    function initializeLanguage() {
        const saved = localStorage.getItem('site_lang');
        const defaultLang = saved || 'en';
        
        // Set language on page load
        if (window._i18n && window._i18n.setLanguage) {
            window._i18n.setLanguage(defaultLang);
        }
        
        return defaultLang;
    }

    // Setup language selector interactions
    function setupLanguageSelectorEvents() {
        const selectors = document.querySelectorAll('.lang-select-compact, .lang-select-large, #langSelect, #langSelectForm');
        
        selectors.forEach(selector => {
            if (!selector) return;
            
            // Handle change event
            selector.addEventListener('change', function(e) {
                const newLang = e.target.value;
                
                if (window._i18n && window._i18n.setLanguage) {
                    window._i18n.setLanguage(newLang, e.target);
                }
                
                // Trigger page reload or animation
                triggerLanguageChangeAnimation();
            });
            
            // Add keyboard support
            selector.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    this.focus();
                    const event = new Event('change', { bubbles: true });
                    this.dispatchEvent(event);
                }
            });
        });
    }

    // Trigger visual feedback when language changes
    function triggerLanguageChangeAnimation() {
        const mainContent = document.querySelector('main, body, .main-wrapper, .container');
        if (mainContent) {
            mainContent.style.opacity = '0.7';
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 200);
        }
    }

    // Ensure all text content is properly marked for translation
    function prepareForTranslation() {
        // Re-apply translations to any dynamically added content
        if (window._i18n && window._i18n.applyTranslations) {
            const currentLang = localStorage.getItem('site_lang') || 'en';
            window._i18n.applyTranslations(currentLang);
        }
    }

    // Listen for language change events
    function setupLanguageChangeListener() {
        window.addEventListener('languageChanged', function(e) {
            console.log('Language changed to:', e.detail.language);
            prepareForTranslation();
        });
    }

    // Initialize on DOM ready
    function initializeOnReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeLanguage();
                setupLanguageSelectorEvents();
                setupLanguageChangeListener();
                prepareForTranslation();
            });
        } else {
            initializeLanguage();
            setupLanguageSelectorEvents();
            setupLanguageChangeListener();
            prepareForTranslation();
        }
    }

    // Expose public API
    window.I18nManager = {
        init: initializeOnReady,
        setLanguage: function(lang) {
            if (window._i18n && window._i18n.setLanguage) {
                window._i18n.setLanguage(lang);
            }
        },
        getCurrentLanguage: function() {
            return localStorage.getItem('site_lang') || 'en';
        },
        getAvailableLanguages: function() {
            return LANGUAGE_CONFIG;
        }
    };

    // Auto-initialize on script load
    initializeOnReady();
})();
