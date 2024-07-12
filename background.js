const INITIAL_WORDS='你是一位专业的语言助理 @Lang Master，我会输入相关的请求，你将根据`preferences`、`instruction`和`rules`来协助我更高效掌握和使用一门语言。  `preferences` /learn：<目标学习语言，默认English> /lang:<语言偏好，默认为“English+中文解释”> /lvl:<用户的语言能力，入门（默认），日常，专业> /style:<口语，书面，正式> else 正式 /num:<> else 3 /音标：<含声调的拼音，国际音标、含声调的日语罗马音>else 音标（美、英）  `instructions` /word：单词讲解 用户用任何语言输入单词，请按以下模版输出单词相关信息： ## 📝单词： 用表格输出：**单词**，音标，词性（abbr），词根，释义（中、英） #不要使用代码块回复 ## 💬例句： 列表输出/num组*英文例句*(中文翻译)*例句来源 ## 🪞近义和反义： 列表输出询问单词的近义词和反义词，含(中文释义) ## 💡关联记忆： 利用词根关联法，列表输出8个相关的单词，含释义 /basic：脚本、高级语言或其他广义语言的学习请求 提供结构化的章节，引导用户学习 /tran：翻译 检测语言，校正并翻译为中文。模版： ## 🦜翻译： 翻译 /polish：润色 调用/tran翻译之后，润色为更优雅的中文。模版： ## 🪄润色： your polish /sum：总结 总结输入的英文，中文输出。 /chat：口语对话 检查`preferences`的偏好，使用“目标语言”和用户对话，纠正并帮助用户提升口语表达。 /help：输出支持的指令指引  `rules` - 正确按输出模版渲染 markdown - 用户学习日语时，/word 的音标使用含数字音调的罗马音音标，如：**雨**：あめ①，音标：ame - 假如单词有多个词性，应全部列出 - 提供语言服务前，确认用户的偏好 - 请一步一步思考，给用户提供专业的语言辅导'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ apiKey: 'sk-7x-u1oG_vQWFbnko0-RdwJGgwM2m6CGuzxG2gXk4CXc' });
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
  let definition = "No definition found in the response.";

  const apiKey = await chrome.storage.sync.get('apiKey').then(data => data.apiKey);

  const apiUrl = "https://winglighgt-langflow.hf.space/api/v1/run/16695af6-41c6-4b0c-a7a0-6fa69d6adf3d?stream=false";
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

    if (data.outputs && data.outputs.length > 0) {
      const firstOutput = data.outputs[0];
      if (firstOutput.outputs && firstOutput.outputs.length > 0) {
        const results = firstOutput.outputs[0].results || {};
        const message = results.message || {};
        definition = message.text || "No definition found in the response.";
      }
    }
  } catch (error) {
    console.error('Error looking up word:', error);
    throw error;
  }

    await saveToLocalStorage(word, definition);
    const { lookupCount } = await getFromLocalStorage(word);
    return { word: `${word} (已查询${lookupCount}次)`, definition };
  
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
  