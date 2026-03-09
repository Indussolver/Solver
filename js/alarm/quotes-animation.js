const cards = document.querySelectorAll(".quote-card")

function revealCards(){

const trigger = window.innerHeight * 0.85

cards.forEach(card => {

const top = card.getBoundingClientRect().top

if(top < trigger){

card.style.opacity = "1"
card.style.transform = "translateY(0)"

}

})

}

window.addEventListener("scroll",revealCards)
const quotes = document.querySelectorAll(".big-quote");

function revealQuotes() {

const triggerPoint = window.innerHeight * 0.85;

quotes.forEach((quote) => {

const quoteTop = quote.getBoundingClientRect().top;

if (quoteTop < triggerPoint) {

quote.style.opacity = "1";
quote.style.transform = "translateY(0)";

}

});

}

/* run on scroll */

window.addEventListener("scroll", revealQuotes);

/* run once when page loads */

window.addEventListener("load", revealQuotes);
