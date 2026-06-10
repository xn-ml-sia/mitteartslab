const REVEAL_CLASS = 'is-revealed';

const MOBILE_MAX_WIDTH = 767;

const DESKTOP_IN_VIEW_OBSERVER = {
  threshold: 0.1,
  rootMargin: '0px 0px -10% 0px',
};

const MOBILE_HALF_IN_VIEW_OBSERVER = {
  threshold: 0.5,
};

const isMobileViewport = () =>
  window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

export const initPortfolioCardReveal = (root = document) => {
  const cards = [...root.querySelectorAll('.portfolio-card')];
  if (cards.length === 0) return null;

  const disposers = cards.map((card) => {
    let scrollLocked = false;

    const reveal = () => {
      card.classList.add(REVEAL_CLASS);
    };

    const hide = () => {
      if (scrollLocked) return;
      card.classList.remove(REVEAL_CLASS);
    };

    const lockAndReveal = () => {
      scrollLocked = true;
      reveal();
    };

    const onEnter = () => reveal();
    const onLeave = () => hide();

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (isMobileViewport() && entry.intersectionRatio < 0.5) return;
          lockAndReveal();
          observer.disconnect();
        });
      },
      isMobileViewport() ? MOBILE_HALF_IN_VIEW_OBSERVER : DESKTOP_IN_VIEW_OBSERVER,
    );

    observer.observe(card);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
    };
  });

  return () => {
    disposers.forEach((dispose) => dispose());
  };
};
