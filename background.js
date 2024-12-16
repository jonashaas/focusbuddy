chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "start") {
    startAlarm();
    sendResponse({ status: "started" });
  } else if (request.command === "stop") {
    stopAlarm();
    sendResponse({ status: "stopped" });
  }
});

function startAlarm() {
  // Einen Alarm erstellen, der jede Minute ausgelöst wird
  chrome.alarms.create("focusAlarm", { delayInMinutes: 1, periodInMinutes: 1 });
}

function stopAlarm() {
  // Alle aktiven Alarme löschen
  chrome.alarms.clear("focusAlarm");
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusAlarm") {
    playSound();
  }
});

function playSound() {
  const audio = new Audio(chrome.runtime.getURL("sounds/reminder.mp3"));
  audio.play();
}
