function paletteMarkup() {
  return `
    <div class="typeLabPalettePanel">
      <input class="typeLabPaletteInput" type="text" placeholder="Run command..." />
      <div class="typeLabPaletteList"></div>
    </div>
  `;
}

export function createCommandPalette({ commands }) {
  const root = document.createElement('div');
  root.className = 'typeLabPalette';
  root.innerHTML = paletteMarkup();
  document.body.appendChild(root);
  const input = root.querySelector('.typeLabPaletteInput');
  const list = root.querySelector('.typeLabPaletteList');
  let open = false;
  let filtered = commands;

  function renderList() {
    list.innerHTML = filtered
      .map((cmd, idx) => `<button class="typeLabPaletteItem" data-cmd="${idx}" type="button">${cmd.label}</button>`)
      .join('');
    list.querySelectorAll('.typeLabPaletteItem').forEach((button) => {
      button.addEventListener('click', () => {
        const idx = Number(button.dataset.cmd);
        filtered[idx]?.run();
        close();
      });
    });
  }

  function openPalette() {
    open = true;
    root.classList.add('is-open');
    input.value = '';
    filtered = commands;
    renderList();
    input.focus();
  }

  function close() {
    open = false;
    root.classList.remove('is-open');
  }

  root.addEventListener('click', (event) => {
    if (event.target === root) close();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(q));
    renderList();
  });

  window.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!open) openPalette();
      else close();
      return;
    }
    if (event.key === 'Escape' && open) {
      close();
      return;
    }
    if (event.key === 'Enter' && open) {
      event.preventDefault();
      filtered[0]?.run();
      close();
    }
    if (event.key === 'Alt') document.body.classList.add('is-alt-held');
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Alt') document.body.classList.remove('is-alt-held');
  });

  return {
    open: openPalette,
    close,
  };
}
