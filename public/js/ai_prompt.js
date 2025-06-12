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
    }
    renderPrompts(); // Always render, even if empty, to ensure UI consistency
  }

  // Save prompts to localStorage
  function savePrompts() {
    localStorage.setItem(localStorageKey, JSON.stringify(prompts));
  }

  // Render prompts in the UI
  function renderPrompts() {
    promptList.innerHTML = ''; // Clear existing list items
    prompts.forEach((promptText, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = promptText;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '삭제';
      deleteButton.className = 'btn btn-delete'; // Added classes
      // deleteButton.style.marginLeft = '10px'; // Margin will be handled by CSS .btn or #prompt-list li .btn-delete
      deleteButton.setAttribute('data-index', index);

      deleteButton.addEventListener('click', function() {
        // 'this' refers to the button clicked
        const promptIndex = parseInt(this.getAttribute('data-index'), 10);
        deletePrompt(promptIndex);
      });

      listItem.appendChild(deleteButton);
      promptList.appendChild(listItem);
    });
  }

  // Delete prompt by index
  function deletePrompt(index) {
    if (index >= 0 && index < prompts.length) {
      prompts.splice(index, 1); // Remove the item from the array
      savePrompts();          // Update localStorage
      renderPrompts();        // Re-render the list
    } else {
      console.error('Invalid index for deletePrompt:', index);
    }
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
  console.log("ai_prompt.js loaded, DOM ready, localStorage and delete functionality handled.");
});
