async function fetchSummary(content) {
    const apiKey = '';
    const apiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  
    const prompt = `Please summarize the following content:\n\n${content}\n\nSummary: `;
    const maxTokens = 100;
  
    try {
      const response = await fetch(corsProxy + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: maxTokens,
          n: 1,
          stop: null,
          temperature: 0.7
        })
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const jsonResponse = await response.json();
      return jsonResponse.choices[0].text.trim();
    } catch (error) {
      console.error('Error fetching summary:', error);
      return 'An error occurred while fetching the summary. Please try again.';
    }
  }
  
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
      const content = request.content;
      fetchSummary(content)
        .then((summary) => {
            console.log('summary', summary.slice(0, 10))
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              code: `document.querySelector('body').innerText = \`${summary}\`;`
            });
          });
          chrome.runtime.sendMessage({ action: 'showSummary', summary: summary });
        })
        .catch((error) => {
          console.error('Error:', error);
          chrome.runtime.sendMessage({
            action: 'showSummary',
            summary: 'An error occurred while fetching the summary. Please try again.'
          });
        });
    }
  });
  