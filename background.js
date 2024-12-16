let isActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "start") {
    startAlarm();
    sendResponse({ status: "started" });
  } else if (request.command === "stop") {
    stopAlarm();
    sendResponse({ status: "stopped" });
  } else if (request.command === "status") {
    sendResponse({ isActive: isActive });
  }
  return true; // Asynchrone Kommunikation erlauben
});

function startAlarm() {
  if (!isActive) {
    isActive = true;
    chrome.alarms.create("focusAlarm", { delayInMinutes: 1, periodInMinutes: 1 });
    // Ändere das Icon auf das "stop"-Icon, wenn der Timer läuft
    chrome.action.setIcon({ path: { 48: "icons/iconstop48.png" } });
    playSound();
    console.log("FocusBuddy Timer gestartet.");
  }
}

function stopAlarm() {
  chrome.alarms.clear("focusAlarm", () => {
    console.log("FocusBuddy Timer gestoppt.");
  });
  isActive = false;
  // Setze das Icon zurück auf das "start"-Icon, wenn der Timer gestoppt wird
  chrome.action.setIcon({ path: { 48: "icons/iconstart48.png" } });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusAlarm") {
    playSound();
    console.log("Erinnerungston abgespielt.");
  }
});

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source = 'sounds/reminder.mp3', volume = 1) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'testing' // details for using the API
  });
}
