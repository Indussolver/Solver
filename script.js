document.addEventListener("DOMContentLoaded", () => {
    // 1. Set current year in footer dynamically
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Intersection Observer for Smooth Fade-In Animations
    // This gives the site a premium, polished feel as the user scrolls
    const fadeElements = document.querySelectorAll(".fade-in");

    const observerOptions = {
        root: null, // use the viewport
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the bottom
        threshold: 0.1 // 10% of the element must be visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // 3. Smooth scroll handling for internal anchor links (e.g., View Portfolio button)
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
});
