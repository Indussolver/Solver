// 1. HTML Elements ko JavaScript se connect karna (IDs aur Classes ke through)
const elements = {
    display: document.getElementById('time-display'),
    startBtn: document.getElementById('start-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    resetBtn: document.getElementById('reset-btn'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    customBtn: document.getElementById('custom-btn'),
    sessionCount: document.getElementById('session-count'),
    alarm: document.getElementById('alarm-sound'),
    body: document.body
};

// 2. State Variables (Timer ka data)
let timerInterval;
let timeLeft = 25 * 60; // Default timer 25 minutes ka hai
let isRunning = false;
let sessions = 0;

// 3. Seconds ko MM:SS format mein dikhane ka function
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 4. Screen aur Browser Tab par time update karna
function updateDisplay() {
    const formatted = formatTime(timeLeft);
    elements.display.textContent = formatted;
    document.title = `${formatted} - timeflow`; // Tab me time dikhega
}

// 5. Focus Mode Toggle (CSS se connected: baki cheezein hide karne ke liye)
function toggleFocusMode(active) {
    if (active) {
        elements.body.classList.add('focus-mode');
    } else {
        elements.body.classList.remove('focus-mode');
    }
}

// 6. Timer Start karna
function startTimer() {
    if (isRunning) return; // Agar pehle se chal raha hai toh dobara start na ho
    
    isRunning = true;
    toggleFocusMode(true); // Focus mode on
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            sessionComplete();
        }
    }, 1000); // Har 1 second (1000ms) me update hoga
}

// 7. Timer Pause karna
function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval); // Interval rokna
    toggleFocusMode(false); // Focus mode off
}

// 8. Timer Reset karna (Jo mode selected hai wahi time wapas aayega)
function resetTimer() {
    pauseTimer();
    
    const activeMode = document.querySelector('.mode-btn.active');
    
    if (activeMode && activeMode.dataset.time) {
        timeLeft = parseInt(activeMode.dataset.time) * 60;
    } else {
        timeLeft = 25 * 60; // Default fallback
    }
    
    updateDisplay();
}

// 9. Focus ya Break mode set karna
function setMode(minutes, btnElement) {
    pauseTimer();
    
    // Purane button se 'active' hatana aur naye pe lagana (CSS ke liye)
    elements.modeBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    
    timeLeft = minutes * 60;
    updateDisplay();
}

// 10. Jab Timer 00:00 ho jaye
function sessionComplete() {
    pauseTimer();
    
    // Sound play karna
    elements.alarm.play().catch(e => console.log("Sound play error:", e));
    
    // Session counter badhana
    sessions++;
    elements.sessionCount.textContent = sessions;
    
    // Browser Notification bhejna
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("timeflow by indus", { body: "Session complete! Great focus." });
    } else {
        alert("Session complete! Great focus.");
    }
    
    resetTimer(); // Agle session ke liye timer ready karna
}

// --- EVENT LISTENERS (Buttons par click hone ka intezaar karna) ---

elements.startBtn.addEventListener('click', startTimer);
elements.pauseBtn.addEventListener('click', pauseTimer);
elements.resetBtn.addEventListener('click', resetTimer);

// Focus aur Break buttons ke liye logic
elements.modeBtns.forEach(btn => {
    if (btn.id !== 'custom-btn') {
        btn.addEventListener('click', (e) => {
            setMode(parseInt(e.target.dataset.time), e.currentTarget);
        });
    }
});

// Custom Timer ke liye prompt box lana
elements.customBtn.addEventListener('click', (e) => {
    const input = prompt("Enter custom minutes:", "15");
    
    // Check karna ki user ne sahi number dala hai ya nahi
    if (input !== null && input.trim() !== "" && !isNaN(input) && input > 0) {
        const minutes = parseInt(input);
        elements.customBtn.dataset.time = minutes;
        elements.customBtn.textContent = `Custom (${minutes}m)`; // Button ka text update karna
        setMode(minutes, e.currentTarget);
    }
});

// Page load hote hi Notification ki permission maangna
if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

// Shuru mein time screen par dikhana
updateDisplay();
