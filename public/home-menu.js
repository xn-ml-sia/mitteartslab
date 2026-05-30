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

  const onDocumentKeydown = (event) => {
    if (event.key !== 'Escape') return;
    closeMenus();
  };

  menus.forEach((menu, index) => {
    const trigger = menu.querySelector('[data-menu-trigger]');
    const submenu = menu.querySelector('.home-submenu');
    if (!trigger) return;

    if (submenu && !submenu.id) submenu.id = `home-submenu-${index + 1}`;
    if (submenu) trigger.setAttribute('aria-controls', submenu.id);

    trigger.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      closeMenus();
      if (!isOpen) {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKeydown);

  return () => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    closeMenus();
  };
};
