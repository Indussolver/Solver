let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;
let sessions = 0;

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

// Format seconds into MM:SS
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Update the main display and browser tab title
function updateDisplay() {
    const formatted = formatTime(timeLeft);
    elements.display.textContent = formatted;
    document.title = `${formatted} - timeflow`; 
}

// Smoothly hide distractions
function toggleFocusMode(active) {
    if (active) {
        elements.body.classList.add('focus-mode');
    } else {
        elements.body.classList.remove('focus-mode');
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    toggleFocusMode(true);
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            sessionComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    toggleFocusMode(false);
}

function resetTimer() {
    pauseTimer();
    const activeMode = document.querySelector('.mode-btn.active');
    // Check if a mode is active, otherwise default to 25
    timeLeft = (activeMode && activeMode.dataset.time) ? parseInt(activeMode.dataset.time) * 60 : 25 * 60;
    updateDisplay();
}

function setMode(minutes, btnEvent) {
    pauseTimer();
    
    // Update active button styling
    elements.modeBtns.forEach(btn => btn.classList.remove('active'));
    if (btnEvent) btnEvent.currentTarget.classList.add('active');
    
    timeLeft = minutes * 60;
    updateDisplay();
}

function sessionComplete() {
    pauseTimer();
    elements.alarm.play();
    sessions++;
    elements.sessionCount.textContent = sessions;
    
    // Modern Browser Notification
    if (Notification.permission === "granted") {
        new Notification("timeflow by indus", { body: "Session complete! Great focus." });
    } else {
        alert("Session complete! Great focus.");
    }
    resetTimer();
}

// --- Event Listeners ---
elements.startBtn.addEventListener('click', startTimer);
elements.pauseBtn.addEventListener('click', pauseTimer);
elements.resetBtn.addEventListener('click', resetTimer);

elements.modeBtns.forEach(btn => {
    if (btn.id !== 'custom-btn') {
        btn.addEventListener('click', (e) => setMode(parseInt(e.target.dataset.time), e));
    }
});

// Custom Timer Logic
elements.customBtn.addEventListener('click', (e) => {
    const input = prompt("Enter custom minutes:", "15");
    if (input && !isNaN(input) && input > 0) {
        elements.customBtn.dataset.time = input;
        setMode(parseInt(input), e);
        elements.customBtn.textContent = `Custom (${input}m)`;
    }
});

// Ask for notification permission on load
if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

// Initial Call
updateDisplay();
