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
const quoteSection = document.querySelector(".premium-quote");

function revealQuote(){

const trigger = window.innerHeight * 0.85;

const top = quoteSection.getBoundingClientRect().top;

if(top < trigger){

quoteSection.classList.add("show");

}

}

window.addEventListener("scroll", revealQuote);
const focusSection = document.querySelector(".focus-section");

function revealFocus(){

const trigger = window.innerHeight * 0.85;

const top = focusSection.getBoundingClientRect().top;

if(top < trigger){

focusSection.classList.add("show");

}

}

window.addEventListener("scroll", revealFocus);
const howSection = document.querySelector(".how-section");

function revealHow(){

const trigger = window.innerHeight * 0.85;

const top = howSection.getBoundingClientRect().top;

if(top < trigger){

howSection.classList.add("show");

}

}

window.addEventListener("scroll", revealHow);
const disciplineQuote = document.querySelector(".discipline-quote-section");

function revealDisciplineQuote(){

const trigger = window.innerHeight * 0.85;

const top = disciplineQuote.getBoundingClientRect().top;

if(top < trigger){

disciplineQuote.classList.add("show");

}

}

window.addEventListener("scroll", revealDisciplineQuote);
const accountSection = document.querySelector(".account-section");

window.addEventListener("scroll", () => {

const position = accountSection.getBoundingClientRect().top;
const screenPosition = window.innerHeight / 1.2;

if(position < screenPosition){

accountSection.classList.add("show");

}

});
