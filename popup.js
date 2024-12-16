document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleBtn");

  // Beim Laden den aktuellen Status abfragen
  chrome.runtime.sendMessage({ command: "status" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Fehler beim Abrufen des Status:", chrome.runtime.lastError.message);
      updateButton(false); // Fallback zu "nicht aktiv"
    } else if (response && response.isActive !== undefined) {
      updateButton(response.isActive);
    }
  });

  // Start/Stop-Button-Logik
  toggleBtn.addEventListener("click", () => {
    const command = toggleBtn.textContent.toLowerCase();
    chrome.runtime.sendMessage({ command: command }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Fehler bei der Kommunikation mit background.js:", chrome.runtime.lastError.message);
        return;
      }

      if (response && response.status === "started") {
        updateButton(true);
      } else if (response && response.status === "stopped") {
        updateButton(false);
      }
    });
  });

  // Button-Text aktualisieren
  function updateButton(isActive) {
    toggleBtn.textContent = isActive ? "Stop" : "Start";
  }
});
