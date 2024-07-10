document.getElementById('lookup-button').addEventListener('click', lookupWord);
document.getElementById('word-input').addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    lookupWord();
  }
});

function lookupWord() {
  const word = document.getElementById('word-input').value.trim();
  if (word) {
    chrome.runtime.sendMessage({ action: 'lookupWord', word: word }, response => {
      if (response) {
        displayResult(response.word, response.definition);
      }
    });
  }
}

function displayResult(word, definition) {
  const resultDiv = document.getElementById('result');
    const htmlContent = marked.parse(definition);
  resultDiv.innerHTML = `
    <h2>${word}</h2>
    <p>${htmlContent}</p>
  `;
}