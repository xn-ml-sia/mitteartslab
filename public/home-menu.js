export const initHomeMenus = () => {
  const menus = Array.from(document.querySelectorAll('[data-menu]'));
  if (menus.length === 0) return () => {};

  const closeMenus = () => {
    menus.forEach((menu) => {
      menu.classList.remove('is-open');
      const trigger = menu.querySelector('[data-menu-trigger]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const onDocumentClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-menu]')) return;
    closeMenus();
  };

  menus.forEach((menu) => {
    const trigger = menu.querySelector('[data-menu-trigger]');
    if (!trigger) return;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = menu.classList.contains('is-open');
      closeMenus();
      if (!isOpen) {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', onDocumentClick);
  return () => {
    document.removeEventListener('click', onDocumentClick);
    closeMenus();
  };
};
