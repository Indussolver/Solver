document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    // Toggle menu visibility
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove("active");
        }
    });
});
// Checkout Modal Logic
const modal = document.getElementById("checkoutModal");
const checkoutItemName = document.getElementById("checkoutItem");
const checkoutItemPrice = document.getElementById("checkoutPrice");
const checkoutForm = document.getElementById("checkoutForm");

// Jab user product pe click karega
function openCheckout(itemName, itemPrice) {
    checkoutItemName.innerText = itemName;
    checkoutItemPrice.innerText = itemPrice;
    modal.style.display = "flex"; // Modal ko show karega
}

// Jab user 'X' pe click karega
function closeCheckout() {
    modal.style.display = "none"; // Modal ko hide karega
}

// Agar user modal ke bahar (background pe) click kare, tab bhi band ho jaye
window.onclick = function(event) {
    if (event.target == modal) {
        closeCheckout();
    }
}

// Form submit hone par (Demo logic)
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Page ko reload hone se rokega
    
    // Yahan aap payment gateway ka code future me daal sakte hain
    alert("Order Confirmed! Your " + checkoutItemName.innerText + " will be delivered soon.");
    
    closeCheckout(); // Form fill hone ke baad popup band karega
    checkoutForm.reset(); // Form fields ko clear karega
});
