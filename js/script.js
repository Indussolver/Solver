let timer;
let timeLeft = 25 * 60; // Default 25 minutes
let isRunning = false;
let sessionsCompleted = 0;

const display = document.getElementById('time-display');
const sessionCountDisplay = document.getElementById('session-count');
const alarmSound = document.getElementById('alarm-sound');
const body = document.body;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        body.classList.add('focus-mode'); // Enable distraction-free mode
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                completeSession();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
    body.classList.remove('focus-mode'); // Disable focus mode on pause
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60; // Reset back to 25 mins by default
    updateDisplay();
}

function setTimer(minutes) {
    pauseTimer();
    timeLeft = minutes * 60;
    updateDisplay();
}

function setCustomTimer() {
    const min = prompt("Kitne minutes ka timer set karna hai?", "15");
    if (min !== null && !isNaN(min) && min > 0) {
        setTimer(parseInt(min));
    }
}

function completeSession() {
    pauseTimer();
    alarmSound.play();
    sessionsCompleted++;
    sessionCountDisplay.textContent = sessionsCompleted;
    alert("Timer complete! Take a break."); // Fallback notification
    resetTimer();
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startTimer);
document.getElementById('pause-btn').addEventListener('click', pauseTimer);
document.getElementById('reset-btn').addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
