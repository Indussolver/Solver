document.addEventListener("DOMContentLoaded",()=>{

initNavigation();
initTheme();

});


function initNavigation(){

const links=document.querySelectorAll(".nav-link");

links.forEach(link=>{
link.addEventListener("click",()=>{

links.forEach(l=>l.classList.remove("active"));
link.classList.add("active");

});
});

}


function initTheme(){

const btn=document.getElementById("themeToggle");

if(!btn) return;

btn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

}
