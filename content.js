document.addEventListener('mouseup', () => {
  handleSelectedText();
});

document.addEventListener('dblclick', () => {
  handleSelectedText();
});

let timeoutId;
let floatingWindow;

function handleSelectedText() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    // 添加鼠标悬停事件监听
    document.addEventListener('mouseover', mouseOverHandler);
  }
}

function mouseOverHandler(event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0 && window.getSelection().containsNode(event.target, true)) {
    // 如果鼠标悬停在选中的文本上
    document.removeEventListener('mouseover', mouseOverHandler);
    chrome.runtime.sendMessage({ action: 'lookupWord', word: selectedText }, response => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (response) {
        showFloatingWindow(response.word, response.definition);
        startAutoCloseTimer();
      }
    });
  }
}

function showFloatingWindow(word, definition) {
  removeExistingFloatingWindow();
  const htmlContent = marked.parse(definition);

  floatingWindow = document.createElement('div');
  floatingWindow.id = 'dictionary-floating-window';
  floatingWindow.innerHTML = `
    <h2>${word}</h2>
    <p>${htmlContent}</p>
    <button id="close-floating-window">Close</button>
  `;

  document.body.appendChild(floatingWindow);

  const closeButton = document.getElementById('close-floating-window');
  closeButton.addEventListener('click', removeExistingFloatingWindow);

  floatingWindow.addEventListener('mouseleave', startAutoCloseTimer);
  floatingWindow.addEventListener('mouseenter', cancelAutoCloseTimer);

  positionFloatingWindow(floatingWindow);
}

function removeExistingFloatingWindow() {
  if (floatingWindow) {
    floatingWindow.remove();
    floatingWindow = null;
  }
  cancelAutoCloseTimer();
}

function positionFloatingWindow(floatingWindow) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  floatingWindow.style.position = 'absolute';
  floatingWindow.style.left = `${rect.left + window.scrollX}px`;
  floatingWindow.style.top = `${rect.bottom + window.scrollY}px`;
}

function startAutoCloseTimer() {
  cancelAutoCloseTimer();
  timeoutId = setTimeout(removeExistingFloatingWindow, 2000); // 2秒后自动关闭
}

function cancelAutoCloseTimer() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}
