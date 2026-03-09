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