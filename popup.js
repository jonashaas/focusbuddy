document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');

  // Beim Laden den aktuellen Status abfragen
  chrome.runtime.sendMessage({ command: "status" }, (response) => {
    updateButton(response.isActive);
  });

  toggleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: toggleBtn.textContent.toLowerCase() }, (response) => {
      if (response.status === 'started') {
        updateButton(true);
      } else if (response.status === 'stopped') {
        updateButton(false);
      }
    });
  });

  function updateButton(isActive) {
    toggleBtn.textContent = isActive ? 'Stop' : 'Start';
  }
});
