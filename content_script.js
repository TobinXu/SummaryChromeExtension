function getMainContent() {
    // Implement a method to detect the main content of the webpage.
    // This is just a simple example.
    return document.querySelector('body').innerText;
  }
  
  function sendContentToBackground(content) {
    chrome.runtime.sendMessage({ action: 'summarize', content: content });
  }
  
  sendContentToBackground(getMainContent());
  