document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const addPromptBtn = document.getElementById('add-prompt-btn');
  const promptList = document.getElementById('prompt-list');
  const localStorageKey = 'aiPrompts';

  let prompts = [];

  // Load prompts from localStorage
  function loadPrompts() {
    const storedPrompts = localStorage.getItem(localStorageKey);
    if (storedPrompts) {
      prompts = JSON.parse(storedPrompts);
      renderPrompts();
    }
  }

  // Save prompts to localStorage
  function savePrompts() {
    localStorage.setItem(localStorageKey, JSON.stringify(prompts));
  }

  // Render prompts in the UI
  function renderPrompts() {
    promptList.innerHTML = ''; // Clear existing list items
    prompts.forEach(promptText => {
      const listItem = document.createElement('li');
      listItem.textContent = promptText;
      promptList.appendChild(listItem);
    });
  }

  // Add new prompt
  addPromptBtn.addEventListener('click', () => {
    const promptText = promptInput.value.trim();

    if (promptText !== '') {
      prompts.push(promptText);
      savePrompts();
      renderPrompts(); // Re-render the list with the new item
      promptInput.value = ''; // Clear the input field
    }
  });

  // Initial load
  loadPrompts();
  console.log("ai_prompt.js loaded, DOM ready, localStorage handled.");
});
