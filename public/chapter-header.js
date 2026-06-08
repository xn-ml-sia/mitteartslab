class MalChapterHeader extends HTMLElement {
  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name !== 'label') return;
    const labelEl = this.querySelector('.mal-header-label');
    if (labelEl) labelEl.textContent = newValue || '';
  }

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const logoVariant = this.getAttribute('logo-variant') || 'bottom';
    const brand = this.getAttribute('brand') || 'mitte arts lab';
    const homeHref = this.getAttribute('home-href');
    const homeLabel = this.getAttribute('home-label') || 'home';

    const rightContent = homeHref
      ? `
        ${label ? `<span class="mal-header-label">${label}</span>` : ''}
        ${label ? `<span class="mal-header-sep" aria-hidden="true">·</span>` : ''}
        <a class="chapter-link" href="${homeHref}">${homeLabel}</a>
      `
      : label
        ? `<span class="mal-header-label">${label}</span>`
        : '';

    this.innerHTML = `
      <header class="header chapter-header">
        <div class="mal-header-left">
          <span class="mal-logo" data-mal-logo="${logoVariant}" aria-hidden="true"></span>
          <span>${brand}</span>
        </div>
        ${rightContent ? `<div class="mal-header-right">${rightContent}</div>` : ''}
      </header>
    `;
  }
}

if (!customElements.get('mal-chapter-header')) {
  customElements.define('mal-chapter-header', MalChapterHeader);
}
