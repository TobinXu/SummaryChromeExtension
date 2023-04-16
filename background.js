async function fetchSummary(content) {
    const apiKey = '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';
    const apiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  
    const prompt = `Please summarize the following content:\n\n${content}\n\nSummary: `;
    const maxTokens = 1000;
  
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: maxTokens,
        n: 1,
        stop: null,
        temperature: 0.7
      })
    });
  
    const jsonResponse = await response.json();
    return jsonResponse.choices[0].text.trim();
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
      const content = request.content;
      fetchSummary(content).then((summary) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            code: `document.querySelector('body').innerText = \`${summary}\`;`
          });
        });
        chrome.runtime.sendMessage({ action: 'showSummary', summary: summary });
      });
    }
  });
  