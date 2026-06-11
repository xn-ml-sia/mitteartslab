import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

const config = {
  smaug: {
    in: {
      base: {
        duration: 200,
        easing: 'easeOutQuad',
        rotate: [35, 0],
        opacity: {
          value: 1,
          easing: 'linear',
          duration: 100,
        },
      },
      content: {
        duration: 1000,
        delay: 50,
        easing: 'easeOutElastic',
        translateX: [50, 0],
        rotate: [10, 0],
        opacity: {
          value: 1,
          easing: 'linear',
          duration: 100,
        },
      },
    },
    out: {
      base: {
        duration: 200,
        delay: 100,
        easing: 'easeInQuad',
        rotate: -35,
        opacity: 0,
      },
      content: {
        duration: 200,
        easing: 'easeInQuad',
        translateX: -30,
        rotate: -10,
        opacity: 0,
      },
    },
  },
};

const STEVE_JOBS_DESIGN_QUOTES = [
  "You can't just ask customers what they want and then try to give that to them. By the time you get it built, they'll want something new.",
  'Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple.',
  "Details matter, it's worth waiting to get it right.",
  'Simplicity is the ultimate sophistication.',
  "Innovation is saying no to a thousand things.",
];

const shuffledQuotes = () => {
  const quotes = [...STEVE_JOBS_DESIGN_QUOTES];
  for (let i = quotes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
  }
  return quotes;
};

export const initHomeSmaugTooltip = () => {
  const root = document.querySelector('[data-home-smaug-tooltip]');
  if (!(root instanceof HTMLElement)) return () => {};

  const base = root.querySelector('.home-tooltip-smaug-base');
  const content = root.querySelector('.home-tooltip-smaug-content');
  if (!(base instanceof HTMLElement) || !(content instanceof HTMLElement)) return () => {};
  let hideTimer = null;
  let quoteQueue = shuffledQuotes();
  let lastQuote = '';

  const getNextQuote = () => {
    if (quoteQueue.length === 0) quoteQueue = shuffledQuotes();
    if (quoteQueue[0] === lastQuote && quoteQueue.length > 1) {
      const first = quoteQueue.shift();
      if (first) quoteQueue.push(first);
    }
    const next = quoteQueue.shift() || STEVE_JOBS_DESIGN_QUOTES[0];
    lastQuote = next;
    return next;
  };

  const setNextQuote = () => {
    content.textContent = getNextQuote();
  };

  const fitBubbleToText = () => {
    base.style.removeProperty('width');
  };

  const onResize = () => {
    fitBubbleToText();
  };

  const animate = (dir) => {
    const variant = config.smaug[dir];
    if (!variant) return;

    if (variant.base) {
      anime.remove(base);
      anime(
        Object.assign(
          {
            targets: base,
          },
          variant.base,
        ),
      );
    }

    if (variant.content) {
      anime.remove(content);
      anime(
        Object.assign(
          {
            targets: content,
          },
          variant.content,
        ),
      );
    }
  };

  const hide = () => {
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
    animate('out');
    const totalOutDuration = 300;
    hideTimer = window.setTimeout(() => {
      root.classList.remove('is-active');
      root.setAttribute('aria-hidden', 'true');
      hideTimer = null;
    }, totalOutDuration);
  };

  const onMenuOpen = () => {
    hide();
  };

  const onMenuState = (event) => {
    const isOpen = Boolean(event?.detail?.isOpen);
    if (!isOpen) hide();
  };

  document.addEventListener('home-menu:open', onMenuOpen);
  document.addEventListener('home-menu:state', onMenuState);
  window.addEventListener('resize', onResize, { passive: true });
  setNextQuote();
  fitBubbleToText();

  return () => {
    document.removeEventListener('home-menu:open', onMenuOpen);
    document.removeEventListener('home-menu:state', onMenuState);
    window.removeEventListener('resize', onResize);
    if (hideTimer) window.clearTimeout(hideTimer);
    anime.remove(base);
    anime.remove(content);
  };
};
