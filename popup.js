const summarizeButton = document.getElementById('summarize');
const summaryContainer = document.getElementById('summary-container');
const summaryContent = document.getElementById('summary-content');

summarizeButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content_script.js']
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showSummary') {
    summaryContent.textContent = request.summary;
    summaryContainer.style.display = 'block';
  }
});
