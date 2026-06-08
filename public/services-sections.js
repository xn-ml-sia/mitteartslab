const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const SERVICES_SECTIONS = [
  {
    id: 'blockchain',
    effect: 1,
    layout: 'content--left',
    image: '/public/assets/services/raw-gradients-ggzjvx-n.png',
    imageLabel: 'blockchain product design',
    caption:
      'You are building something on-chain and need a designer who already speaks the language — DeFi, wallets, trading surfaces, on-chain data. I turn protocol complexity into flows people understand, with UI your engineers can actually ship.',
    headline: `
      Your product lives<br />
      on-chain. It should<br />
      feel clear enough to
      <span class="type__expand type__expand--inline type__expand--reveal">
        __EXPAND_IMAGE__
        <span class="anim skewed">use.</span>
      </span>
    `,
  },
  {
    id: 'motion-ds',
    effect: 2,
    layout: 'content--center',
    image: '/public/assets/services/raw-gradients-ldrx5uab.png',
    imageLabel: 'motion design system',
    caption:
      'You need a design system that does not sit still in a Figma file. I build motion into the foundation — components, tokens, interaction specs — and use agents to document, extend, and keep the system moving with your product.',
    headline: `
      Most teams add motion<br />
      too late. I build<br />
      <span class="type__expand type__expand--reveal type__expand--center">
        <span class="aright">systems </span>
        __EXPAND_IMAGE__
        <span class="anim skewed">that move</span>
      </span>
      <br />
      from day one.
    `,
  },
  {
    id: 'ai-community',
    effect: 3,
    layout: 'content--right',
    image: '/public/assets/services/raw-illustrations-n8d3n8zf.png',
    imageLabel: 'AI design community',
    caption:
      'You want designers on your team who are confident with AI — not guessing at prompts in isolation. I run workshops, share practical setups, and build the community around agent-first design so capability spreads across your whole team.',
    headline: `
      Hiring one designer<br />
      is not enough.<br />
      <span class="type__expand type__expand--full">
        __EXPAND_IMAGE__
      </span>
      I grow the room<br />
      around them.
    `,
  },
  {
    id: 'how-we-work',
    effect: 5,
    layout: 'content--line',
    blockClass: 'aleft',
    caption:
      'Project-based for a launch or feature. Retainer for ongoing system work. Workshops for teams leveling up on motion and AI. Tell me what you are building and where you are stuck — we will find the right shape.',
    headlineHtml: `
      A
      <span class="type__expand type__expand--mini">
        <span class="type__expand-img type__expand-img--tiny">
          <span class="type__expand-img-inner" style="background-image: url('/public/assets/services/raw-gradients-fscayqib.png');" role="img" aria-label="project engagement"></span>
        </span>
      </span>
      sprint for launch,
      <span class="type__expand type__expand--mini">
        <span class="type__expand-img type__expand-img--tiny">
          <span class="type__expand-img-inner" style="background-image: url('/public/assets/services/raw-gradients-ljs0kzkm.png');" role="img" aria-label="system retainer"></span>
        </span>
      </span>
      a system,<br />
      or a
      <span class="type__expand type__expand--mini">
        <span class="type__expand-img type__expand-img--tiny">
          <span class="type__expand-img-inner" style="background-image: url('/public/assets/services/raw-illustrations-lzfqw6-v.png');" role="img" aria-label="team workshop"></span>
        </span>
      </span>
      workshop<br />
      for your team — tell me
      <span class="type__expand type__expand--mini">
        <span class="type__expand-img type__expand-img--tiny">
          <span class="type__expand-img-inner" style="background-image: url('/public/assets/services/raw-gradients-ggzjvx-n.png');" role="img" aria-label="collaboration"></span>
        </span>
      </span>
      what you are<br />
      building and we will<br />
      find the fit.
    `,
  },
];

const renderExpandImage = ({ image, imageLabel }) => `
  <span class="type__expand-img">
    <span
      class="type__expand-img-inner"
      style="background-image: url('${image}');"
      role="img"
      aria-label="${escapeHtml(imageLabel)}"
    ></span>
  </span>
`;

const renderSection = (section) => {
  const expandImage =
    section.image && section.imageLabel
      ? renderExpandImage({ image: section.image, imageLabel: section.imageLabel })
      : '';
  const typeHtml =
    section.headlineHtml ?? section.headline.replace('__EXPAND_IMAGE__', expandImage);
  const blockClasses = ['services-codrops-block', section.blockClass]
    .filter(Boolean)
    .join(' ');

  return `
    <section class="services-codrops-content ${section.layout} services-codrops-content--${section.id}">
      <h2 class="services-codrops-type" data-services-expand="${section.effect}" id="services-section-${section.id}-title">
        ${typeHtml}
      </h2>
      <p class="${blockClasses}">${escapeHtml(section.caption)}</p>
    </section>
  `;
};

const renderHeader = () => `
  <header class="header chapter-header services-list-header">
    <div class="mal-header-left">
      <span class="mal-logo" data-mal-logo="bottom" aria-hidden="true"></span>
      <span>mitte arts lab</span>
    </div>
    <div class="mal-header-right">
      <span class="mal-header-label">services</span>
    </div>
  </header>
`;

export const renderPage = () => `
  <div class="services-page-list">
    ${renderHeader()}
    <div class="services-codrops-stack">
      ${SERVICES_SECTIONS.map(renderSection).join('')}
    </div>
  </div>
`;
