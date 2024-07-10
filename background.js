chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ apiKey: 'sk-DUUzPwybWpG9vt9wTjobW9-b1VtUS7qBEL06QXpRtJ4' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'lookupWord') {
    lookupWord(request.word).then(sendResponse).catch(error => {
      console.error('Error looking up word:', error);
      sendResponse({ word: request.word, definition: `Error: ${error.message}` });
    });
    return true; // 保持消息通道开放，以便异步发送响应
  }
});

async function lookupWord(word) {
  const cachedData = await getFromLocalStorage(word);
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

    await saveToLocalStorage(word, definition);
    const { lookupCount } = await getFromLocalStorage(word);
    return { word: `${word} (已查询${lookupCount}次)`, definition };
  } catch (error) {
    console.error('Error looking up word:', error);
    throw error;
  }
}

function getFromLocalStorage(word) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([word], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[word]);
      }
    });
  });
}

function saveToLocalStorage(word, definition) {
  return new Promise((resolve, reject) => {
    getFromLocalStorage(word).then((data) => {
      const lookupData = data || { definition, lookupCount: 0 };
      lookupData.lookupCount += 1;
      chrome.storage.local.set({ [word]: lookupData }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}

function updateLookupCount(word) {
  getFromLocalStorage(word).then((data) => {
    if (data) {
      data.lookupCount += 1;
      chrome.storage.local.set({ [word]: data });
    }
  });
}
