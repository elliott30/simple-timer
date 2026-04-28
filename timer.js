const entryScreen = document.getElementById("entry-screen");
const timerScreen = document.getElementById("timer-screen");
const timeInput   = document.getElementById("time-input");
const display     = document.getElementById("display");
const pauseBtn    = document.getElementById("pause-btn");
const resetBtn    = document.getElementById("reset-btn");

let totalSeconds = 0;
let remaining    = 0;
let intervalId   = null;
let paused       = false;

function parseInput(raw) {
  const s = raw.trim();
  if (!s) return null;

  if (s.includes(":")) {
    const [mPart, sPart] = s.split(":");
    const m = parseInt(mPart, 10) || 0;
    const sec = parseInt(sPart, 10) || 0;
    if (isNaN(m) || isNaN(sec) || sec >= 60) return null;
    return m * 60 + sec;
  }

  const n = parseFloat(s);
  if (isNaN(n) || n <= 0) return null;
  return Math.round(n * 60);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function startTimer(seconds) {
  totalSeconds = seconds;
  remaining    = seconds;
  paused       = false;

  display.textContent = formatTime(remaining);
  display.classList.remove("done");
  pauseBtn.textContent = "Pause";

  entryScreen.classList.add("hidden");
  timerScreen.classList.remove("hidden");

  clearInterval(intervalId);
  intervalId = setInterval(tick, 1000);
}

function tick() {
  if (paused) return;
  remaining--;
  display.textContent = formatTime(remaining);

  if (remaining <= 0) {
    clearInterval(intervalId);
    display.classList.add("done");
    pauseBtn.disabled = true;
  }
}

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

resetBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  display.classList.remove("done");
  pauseBtn.disabled  = false;
  pauseBtn.textContent = "Pause";

  timerScreen.classList.add("hidden");
  entryScreen.classList.remove("hidden");
  timeInput.value = "";
  timeInput.focus();
});

timeInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const seconds = parseInput(timeInput.value);
  if (seconds === null || seconds <= 0) {
    timeInput.style.borderBottomColor = "#e74c3c";
    setTimeout(() => (timeInput.style.borderBottomColor = ""), 600);
    return;
  }
  startTimer(seconds);
});

timeInput.focus();
