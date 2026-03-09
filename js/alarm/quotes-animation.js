// js/quotes-animation.js
// IntersectionObserver approach — robust and performant.

(function(){
  // Safety: don't run unless browser supports required features
  if (!('IntersectionObserver' in window)) {
    // fallback: reveal all immediately if IO not supported
    document.querySelectorAll('.quote-card, .big-quote').forEach(el => el.classList.add('in-view'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);

  // Observe both small cards and big quotes
  document.addEventListener('DOMContentLoaded', () => {
    const nodes = document.querySelectorAll('.quote-card, .big-quote');
    nodes.forEach(n => observer.observe(n));
    // run a first check for elements already in viewport
    // (IntersectionObserver handles this, but calling ensures immediate reveal)
  });
})();
