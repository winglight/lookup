document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({ action: 'lookupWord', word: selectedText }, response => {
        if (response) {
          showFloatingWindow(response.word, response.definition);
        }
      });
    }
  });
  
  function showFloatingWindow(word, definition) {
    removeExistingFloatingWindow();
    const htmlContent = marked.parse(definition);
  
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'dictionary-floating-window';
    floatingWindow.innerHTML = `
      <h2>${word}</h2>
      <p>${htmlContent}</p>
      <button id="close-floating-window">Close</button>
    `;
  
    document.body.appendChild(floatingWindow);
  
    const closeButton = document.getElementById('close-floating-window');
    closeButton.addEventListener('click', removeExistingFloatingWindow);
  
    positionFloatingWindow(floatingWindow);
  }
  
  function removeExistingFloatingWindow() {
    const existingWindow = document.getElementById('dictionary-floating-window');
    if (existingWindow) {
      existingWindow.remove();
    }
  }
  
  function positionFloatingWindow(floatingWindow) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
  
    floatingWindow.style.position = 'absolute';
    floatingWindow.style.left = `${rect.left + window.scrollX}px`;
    floatingWindow.style.top = `${rect.bottom + window.scrollY}px`;
  }