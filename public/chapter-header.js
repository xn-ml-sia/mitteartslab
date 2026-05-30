class MalChapterHeader extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const logoVariant = this.getAttribute('logo-variant') || 'bottom';
    const brand = this.getAttribute('brand') || 'mitte arts lab';
    const homeHref = this.getAttribute('home-href');
    const homeLabel = this.getAttribute('home-label') || 'home';

    const rightContent = homeHref
      ? `
        <span class="mal-header-label">${label}</span>
        <span class="mal-header-sep" aria-hidden="true">·</span>
        <a class="chapter-link" href="${homeHref}">${homeLabel}</a>
      `
      : `
        <span class="mal-header-label">${label}</span>
      `;

    this.innerHTML = `
      <header class="header chapter-header">
        <div class="mal-header-left">
          <span class="mal-logo" data-mal-logo="${logoVariant}" aria-hidden="true"></span>
          <span>${brand}</span>
        </div>
        <div class="mal-header-right">
          ${rightContent}
        </div>
      </header>
    `;
  }
}

if (!customElements.get('mal-chapter-header')) {
  customElements.define('mal-chapter-header', MalChapterHeader);
}
