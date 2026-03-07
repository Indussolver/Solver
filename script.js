// Smooth page transitions
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe elements
document.querySelectorAll('.feature-card, .task-item, .achievement-card, .reward-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scroll = window.scrollY;
    
    navbar.style.backdropFilter = scroll > 50 ? 'blur(25px)' : 'blur(20px)';
    navbar.style.background = scroll > 50 
        ? 'rgba(255, 255, 255, 0.98)' 
        : 'rgba(255, 255, 255, 0.96)';
});

// Feature card hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-16px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Task input focus effect
const taskInput = document.querySelector('.task-input-field');
if (taskInput) {
    taskInput.addEventListener('focus', () => {
        taskInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    taskInput.addEventListener('blur', () => {
        taskInput.parentElement.style.transform = 'scale(1)';
    });
}

// Phone floating animation
const phoneFrame = document.querySelector('.phone-frame');
if (phoneFrame) {
    phoneFrame.style.animation = 'float 6s ease-in-out infinite';
}
