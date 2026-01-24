document.addEventListener('DOMContentLoaded', () => {
    // Slider Logic
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
