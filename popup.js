const summarizeButton = document.getElementById('summarize');
const summaryContainer = document.getElementById('summary-container');
const summaryContent = document.getElementById('summary-content');
const loadingSpinner = document.getElementById('loading-spinner');

function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}

summarizeButton.addEventListener('click', () => {
  showLoadingSpinner();
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
    hideLoadingSpinner();
  }
});
