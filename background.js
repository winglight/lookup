chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ apiKey: 'sk-DUUzPwybWpG9vt9wTjobW9-b1VtUS7qBEL06QXpRtJ4' });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'lookupWord') {
      lookupWord(request.word).then(sendResponse);
      return true; // 保持消息通道开放，以便异步发送响应
    }
  });
  
  async function lookupWord(word) {
    const cachedData = getFromLocalStorage(word);
    if (cachedData) {
      updateLookupCount(word);
      const { definition, lookupCount } = cachedData;
      return { word: `${word} (已查询${lookupCount}次)`, definition };
    }
  
    const apiKey = await chrome.storage.sync.get('apiKey').then(data => data.apiKey);
  
    const apiUrl = "https://ai.zhnbhl.cn/api/v1/run/eb76f1d6-85d3-43c9-9c4d-a027833ccedd?stream=false";
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    };
    const payload = {
      "input_value": `Define the word: ${word}`,
      "output_type": "chat",
      "input_type": "chat",
      "tweaks": {
        "GroqModel-snATY": {},
        "ChatInput-rBilA": {},
        "ChatOutput-ZT9GJ": {},
        "Prompt-GDHj8": {}
      }
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
  
      let definition = "No definition found in the response.";
      if (data.outputs && data.outputs.length > 0) {
        const firstOutput = data.outputs[0];
        if (firstOutput.outputs && firstOutput.outputs.length > 0) {
          const results = firstOutput.outputs[0].results || {};
          const message = results.message || {};
          definition = message.text || "No definition found in the response.";
        }
      }
  
      saveToLocalStorage(word, definition);
      const { lookupCount } = getFromLocalStorage(word);
      return { word: `${word} (已查询${lookupCount}次)`, definition };
    } catch (error) {
      console.error('Error looking up word:', error);
      return { word, definition: `Error: ${error.message}` };
    }
  }
  
  function getFromLocalStorage(word) {
    const storedData = localStorage.getItem(word);
    return storedData ? JSON.parse(storedData) : null;
  }
  
  function saveToLocalStorage(word, definition) {
    const lookupData = getFromLocalStorage(word) || { definition, lookupCount: 0 };
    lookupData.lookupCount += 1;
    localStorage.setItem(word, JSON.stringify(lookupData));
  }
  
  function updateLookupCount(word) {
    const lookupData = getFromLocalStorage(word);
    if (lookupData) {
      lookupData.lookupCount += 1;
      localStorage.setItem(word, JSON.stringify(lookupData));
    }
  }
  