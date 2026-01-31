document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // LANGUAGE SELECTOR INITIALIZATION
    // ==========================================
    
    // Initialize language selector - support both navbar and login selectors
    const langSelectors = document.querySelectorAll('#langSelect, #langSelectForm, .lang-select-compact, .lang-select-large');
    
    langSelectors.forEach(langSelect => {
        if (langSelect) {
            langSelect.addEventListener('change', function(e) {
                const lang = e.target.value;
                // Call i18n.changeLanguage or our custom setLanguage
                if (window._i18n && window._i18n.setLanguage) {
                    window._i18n.setLanguage(lang, e.target);
                } else {
                    // Fallback: store language preference
                    localStorage.setItem('site_lang', lang);
                }
            });
            
            // Set initial value from localStorage
            const savedLang = localStorage.getItem('site_lang') || 'en';
            langSelect.value = savedLang;
        }
    });
    
    // ==========================================
    // SLIDER LOGIC
    // ==========================================
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        // Auto play
        const autoSlide = setInterval(() => {
            moveSlide(1);
        }, 5000);

        // Function to expose to global scope for buttons
        window.moveSlide = function(n) {
            showSlides(slideIndex += n);
        };

        function showSlides(n) {
            if (n >= slides.length) { slideIndex = 0 }
            if (n < 0) { slideIndex = slides.length - 1 }
            
            slides.forEach(slide => slide.classList.remove('active'));
            slides[slideIndex].classList.add('active');
        }
    }

    // Message Rotation Logic
    const messageElement = document.getElementById('dynamic-message');
    if (messageElement && typeof clientMessages !== 'undefined' && clientMessages.length > 0) {
        let msgIndex = 0;
        setInterval(() => {
            msgIndex = (msgIndex + 1) % clientMessages.length;
            // Fade effect could be added here
            messageElement.style.opacity = 0;
            setTimeout(() => {
                messageElement.innerText = clientMessages[msgIndex];
                messageElement.style.opacity = 1;
            }, 500); // Wait for fade out
        }, 4000);
        
        // Add transition to CSS via JS or ensure CSS has it
        messageElement.style.transition = "opacity 0.5s ease-in-out";
    }

    // Area Selection Logic (if we add the Schedule dropdown like the reference)
    // For now, the user didn't ask for the specific "Select Area" feature on home, 
    // but the Schedule page might need it. 
    // I'll leave it for now as I implemented a Schedule page separately.
});

