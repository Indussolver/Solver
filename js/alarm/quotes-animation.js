document.addEventListener("DOMContentLoaded", function(){

const quotes = document.querySelectorAll(".big-quote");

quotes.forEach((quote, index) => {

setTimeout(() => {

quote.classList.add("show");

}, index * 400);

});

});
