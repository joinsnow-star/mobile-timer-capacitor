// timer-worker.js

let workDuration = 90 * 60,
    restDuration = 20 * 60,
    microBreakDuration = 10,
    minMicroInterval = 8 * 60,
    maxMicroInterval = 10 * 60;

let mainTimerInterval = null;
let microTimerInterval = null;
let microBreakCountdownInterval = null;

let currentMainTime = workDuration;
let currentMicroTime = 0;
let currentMicroBreakCountdown = microBreakDuration;

let isWorking = true;
let isPaused = true; // Start paused
let isMicroBreaking = false;
let pauseCount = 0;
let pauseLog = []; // Store pause timestamps (as simple Date.now() for example)

function getRandomMicroInterval() {
    const minVal = Math.min(minMicroInterval, maxMicroInterval);
    const maxVal = Math.max(minMicroInterval, maxMicroInterval);
    if (minVal === maxVal) return minVal; // Avoid issues if min === max
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

function postStateUpdate() {
    self.postMessage({
        type: 'tick',
        currentMainTime: currentMainTime,
        currentMicroBreakCountdown: currentMicroBreakCountdown,
        isWorking: isWorking,
        isPaused: isPaused,
        isMicroBreaking: isMicroBreaking,
        pauseCount: pauseCount,
        pauseLog: pauseLog // Send pause log data
    });
}

function startMainTimer() {
    console.log("Worker: startMainTimer called. isPaused:", isPaused);
    if (isPaused) return;

    clearInterval(mainTimerInterval);
    clearInterval(microTimerInterval);
    console.log("Worker: Intervals cleared");

    mainTimerInterval = setInterval(() => {
        if (isPaused || isMicroBreaking) return;

        currentMainTime--;
        // console.log("Worker: Main time tick", currentMainTime); // Debug log

        if (currentMainTime < 0) {
            isWorking = !isWorking;
            currentMainTime = isWorking ? workDuration : restDuration;
            console.log("Worker: State changed. isWorking:", isWorking);
            self.postMessage({ type: 'playSound', sound: 'main' }); // Tell main thread to play sound
            self.postMessage({ type: 'clearLogs' }); // Tell main thread to clear logs
            pauseCount = 0; // Reset pause count on state change
            pauseLog = [];

            if (isWorking) {
                startMicroBreakTimer();
            } else {
                clearInterval(microTimerInterval);
                currentMicroTime = 0;
            }
        }
        postStateUpdate(); // Post update every tick

    }, 1000);

    if (isWorking) {
        startMicroBreakTimer();
    }
    postStateUpdate(); // Initial state update
}

function startMicroBreakTimer() {
    if (!isWorking || isPaused) return;

    clearInterval(microTimerInterval);
    currentMicroTime = getRandomMicroInterval();
    console.log(`Worker: Next micro-break in ${currentMicroTime} seconds`);

    microTimerInterval = setInterval(() => {
        if (isPaused || isMicroBreaking) return;

        currentMicroTime--;
        // console.log(`Worker: Micro time left: ${currentMicroTime}`); // Debug log

        if (currentMicroTime <= 0) {
            triggerMicroBreak();
        }
        // No need to post update here, main timer tick handles it
    }, 1000);
}

function triggerMicroBreak() {
    if (!isWorking || isMicroBreaking) return;

    isMicroBreaking = true;
    clearInterval(microTimerInterval); // Pause the interval timer
    console.log("Worker: Triggering micro-break");
    self.postMessage({ type: 'playSound', sound: 'micro' }); // Tell main thread to play sound
    self.postMessage({ type: 'logMicroBreak' }); // Tell main thread to log it

    currentMicroBreakCountdown = microBreakDuration;
    postStateUpdate(); // Update display to show countdown start

    microBreakCountdownInterval = setInterval(() => {
        currentMicroBreakCountdown--;
        postStateUpdate(); // Update countdown display

        if (currentMicroBreakCountdown < 0) {
            endMicroBreak();
        }
    }, 1000);
}

function endMicroBreak() {
    clearInterval(microBreakCountdownInterval);
    isMicroBreaking = false;
    console.log("Worker: Ending micro-break");
    postStateUpdate(); // Update display to reset micro timer
    startMicroBreakTimer(); // Restart the micro-break interval timer
}

function pauseTimer() {
    if (isPaused) return; // Already paused
    isPaused = true;
    console.log("Worker: Paused");
    if (isWorking && !isMicroBreaking) { // Only log pauses during work time
        pauseCount++;
        pauseLog.push(Date.now()); // Store timestamp
        console.log("Worker: Pause logged", pauseCount, pauseLog);
    }
    postStateUpdate(); // Update UI state
}

function resumeTimer() {
    if (!isPaused) return; // Already running
    isPaused = false;
    console.log("Worker: Resumed");
    // Restart timers if they were stopped (e.g., initial state or after reset)
    if (!mainTimerInterval && currentMainTime > 0) {
        startMainTimer();
    } else if (!microTimerInterval && isWorking && !isMicroBreaking) {
        startMicroBreakTimer();
    }
    postStateUpdate(); // Update UI state
}

function resetTimer() {
    console.log("Worker: Resetting timer");
    clearInterval(mainTimerInterval);
    clearInterval(microTimerInterval);
    clearInterval(microBreakCountdownInterval);
    mainTimerInterval = null;
    microTimerInterval = null;
    microBreakCountdownInterval = null;

    isWorking = true;
    isPaused = true; // Reset to paused state
    isMicroBreaking = false;
    currentMainTime = workDuration;
    currentMicroTime = 0;
    currentMicroBreakCountdown = microBreakDuration;
    pauseCount = 0; // Reset pause count
    pauseLog = []; // Reset pause log

    postStateUpdate(); // Send reset state to main thread
    self.postMessage({ type: 'clearLogs' }); // Tell main thread to clear logs
}

// Listen for messages from the main thread
self.onmessage = function(event) {
    const { command, data } = event.data;
    console.log("Worker received command:", command, data);

    switch (command) {
        case 'start':
            if (isPaused) { // Only resume if paused
                 resumeTimer();
            } else { // If not paused (e.g. already running), maybe start fresh? Or ignore? Let's ignore for now.
                console.log("Worker: Received start command but already running.");
            }
            break;
        case 'pause':
            pauseTimer();
            break;
        case 'reset':
            resetTimer();
            break;
        case 'updateSettings':
            if (data) {
                workDuration = data.workDuration ?? workDuration;
                restDuration = data.restDuration ?? restDuration;
                microBreakDuration = data.microBreakDuration ?? microBreakDuration;
                minMicroInterval = data.minMicroInterval ?? minMicroInterval;
                maxMicroInterval = data.maxMicroInterval ?? maxMicroInterval;
                console.log("Worker: Settings updated", { workDuration, restDuration, microBreakDuration, minMicroInterval, maxMicroInterval });
                // Apply new settings immediately by resetting
                resetTimer();
            }
            break;
    }
};

// Initial state post when worker starts (optional, main thread can request it)
// resetTimer(); // Start in a defined reset state