// HTML Elements
const elements = {
    display: document.getElementById('time-display'),
    startBtn: document.getElementById('start-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    resetBtn: document.getElementById('reset-btn'),
    
    modeBtns: document.querySelectorAll('.mode-btn'),
    customToggleBtn: document.getElementById('custom-toggle-btn'),
    customArea: document.getElementById('custom-input-area'),
    customInput: document.getElementById('custom-minutes'),
    setCustomBtn: document.getElementById('set-custom-btn'),
    
    sessionCount: document.getElementById('session-count'),
    totalTimeDisplay: document.getElementById('total-focus-time'),
    alarm: document.getElementById('alarm-sound'),
    body: document.body
};

// State
let timerInterval;
let defaultFocusTime = 25 * 60;
let timeLeft = defaultFocusTime;
let isRunning = false;
let sessions = 0;
let totalFocusMinutes = 0; // Performance tracking

// Helper: Format Time
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Update Display & Tab Title
function updateDisplay() {
    const formatted = formatTime(timeLeft);
    elements.display.textContent = formatted;
    document.title = `${formatted} - Timeflow`; // T capital
}

// Focus Mode Animation Trigger
function toggleFocusMode(active) {
    if (active) {
        elements.body.classList.add('focus-mode');
        elements.customArea.classList.add('hidden'); // Hide custom input if active
    } else {
        elements.body.classList.remove('focus-mode');
    }
}

// Timer Controls
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
    
    if (activeMode && activeMode.dataset.time) {
        timeLeft = parseInt(activeMode.dataset.time) * 60;
    } else {
        timeLeft = defaultFocusTime;
    }
    updateDisplay();
}

// Mode Selection (Focus/Break)
function setMode(minutes, btnElement) {
    pauseTimer();
    elements.customArea.classList.add('hidden'); // Hide custom area when switching modes
    
    elements.modeBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    
    timeLeft = minutes * 60;
    updateDisplay();
}

// Organised Custom Timer Logic
function toggleCustomArea() {
    elements.customArea.classList.toggle('hidden');
    if (!elements.customArea.classList.contains('hidden')) {
        elements.customInput.focus(); // Auto-focus input
    }
}

function handleSetCustom() {
    const minutes = parseInt(elements.customInput.value);
    
    if (minutes && minutes > 0 && minutes <= 180) { // Limit 3 hours
        // Update the Custom button to show the time
        elements.customToggleBtn.dataset.time = minutes;
        
        // Treat this button as active
        elements.modeBtns.forEach(btn => btn.classList.remove('active'));
        elements.customToggleBtn.classList.add('active');
        
        setMode(minutes, elements.customToggleBtn);
        elements.customInput.value = ''; // Clear input
    } else {
        alert("Enter minutes between 1 and 180.");
    }
}

// Session Complete logic
function sessionComplete() {
    const activeMode = document.querySelector('.mode-btn.active');
    const isFocusSession = activeMode && activeMode.textContent.includes('Focus');
    const isCustomSession = activeMode && activeMode.id === 'custom-toggle-btn';

    pauseTimer();
    elements.alarm.play().catch(e => console.log("Sound error:", e));
    
    // Track performance only if it was a Focus or Custom session (not Break)
    if (isFocusSession || isCustomSession) {
        sessions++;
        // Calculate minutes added (handles custom times correctly)
        const minutesAdded = activeMode.dataset.time ? parseInt(activeMode.dataset.time) : 25;
        totalFocusMinutes += minutesAdded;
        
        // Update UI
        elements.sessionCount.textContent = sessions;
        elements.totalTimeDisplay.textContent = totalFocusMinutes;
        
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Timeflow", { body: `Focus session complete! (+${minutesAdded} min)` });
        }
    } else {
        // Break complete
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Timeflow", { body: `Break over. Ready to focus?` });
        }
    }
    
    resetTimer();
}

// --- Event Listeners ---
elements.startBtn.addEventListener('click', startTimer);
elements.pauseBtn.addEventListener('click', pauseTimer);
elements.resetBtn.addEventListener('click', resetTimer);

// Mode buttons (excluding Custom)
elements.modeBtns.forEach(btn => {
    if (btn.id !== 'custom-toggle-btn') {
        btn.addEventListener('click', (e) => {
            setMode(parseInt(e.target.dataset.time), e.currentTarget);
        });
    }
});

// Organised Custom Events
elements.customToggleBtn.addEventListener('click', toggleCustomArea);
elements.setCustomBtn.addEventListener('click', handleSetCustom);
// Allow pressing 'Enter' inside input
elements.customInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSetCustom();
    }
});

// Notifications
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Init
updateDisplay();
