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

    // Create and show a blocking language selection modal on first visit
    function showLanguageModalIfNeeded() {
        const saved = localStorage.getItem('site_lang');
        if (saved) return;
        // Build modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'i18n-overlay';
        Object.assign(overlay.style, {
            position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:99999
        });
        const box = document.createElement('div');
        Object.assign(box.style, {
            background:'#fff', padding:'22px', borderRadius:'12px', width:'min(520px,92%)', boxShadow:'0 20px 60px rgba(2,6,23,0.4)', textAlign:'center', fontFamily:'Segoe UI, system-ui, sans-serif'
        });
        const title = document.createElement('h2');
        title.textContent = 'Select Language';
        title.style.margin = '0 0 8px';
        const desc = document.createElement('p');
        desc.textContent = 'Choose your preferred language to continue.';
        desc.style.margin = '0 0 18px'; desc.style.color = '#444';
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex'; btnRow.style.justifyContent = 'center'; btnRow.style.gap = '12px';
        ['en','mr','hi'].forEach(code => {
            const btn = document.createElement('button');
            btn.textContent = code === 'en' ? 'English' : code === 'mr' ? 'मराठी' : 'हिन्दी';
            Object.assign(btn.style, { padding:'10px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:700 });
            btn.onclick = function(){
                if (window._i18n && window._i18n.setLanguage) window._i18n.setLanguage(code, btn);
                localStorage.setItem('site_lang', code);
                document.body.removeChild(overlay);
            };
            btnRow.appendChild(btn);
        });
        box.appendChild(title); box.appendChild(desc); box.appendChild(btnRow);
        overlay.appendChild(box);
        document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(overlay));
        // If DOM already loaded
        if (document.readyState !== 'loading') {
            if (!document.body.contains(overlay)) document.body.appendChild(overlay);
        }
    }

    // Wire existing init flow
    function initialize() {
        // Existing initialization from previous script (if any)
        if (window._i18n && window._i18n.initI18n) {
            window._i18n.initI18n();
        }
        showLanguageModalIfNeeded();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
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

// Minimal I18nManager stub (translations disabled)
(function () {
	function init() { /* no-op */ }
	function setLanguage(lang) { /* no-op */ }
	function getCurrentLanguage() { return 'en'; }
	function getAvailableLanguages() { return ['en']; }

	const I18nManager = { init, setLanguage, getCurrentLanguage, getAvailableLanguages };

	if (typeof window !== 'undefined') window.I18nManager = I18nManager;
	if (typeof module !== 'undefined' && module.exports) module.exports = I18nManager;
})();
