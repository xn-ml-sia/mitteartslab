const DEFAULT_HERO_IMAGE = '/public/assets/portfolio-hero-carousel/bonsai.png';

export const initPortfolioOkpaletteHero = () => {
  const wrap = document.querySelector('.portfolio-okpalette-hero-wrap');
  if (!wrap || document.body.classList.contains('has-image')) return;

  const button =
    wrap.querySelector('.example-image-btn[data-src]') ||
    document.querySelector('.example-image-btn[data-src]');

  if (button) {
    button.click();
    return;
  }

  const fileInput = document.getElementById('fileInput');
  if (!fileInput) return;

  fetch(DEFAULT_HERO_IMAGE)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch ${DEFAULT_HERO_IMAGE}`);
      return response.blob();
    })
    .then((blob) => {
      const file = new File([blob], 'bonsai.png', { type: blob.type || 'image/png' });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInput.files = transfer.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    })
    .catch((error) => {
      console.warn('[portfolio] Could not auto-load hero image:', error);
    });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => initPortfolioOkpaletteHero());
  }, { once: true });
} else {
  requestAnimationFrame(() => initPortfolioOkpaletteHero());
}
