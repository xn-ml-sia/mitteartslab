const REVEAL_CLASS = 'is-revealed';

const SCROLL_OBSERVER = {
  threshold: 0.2,
  rootMargin: '0px 0px -10% 0px',
};

export const initPortfolioCardReveal = (root = document) => {
  const cards = [...root.querySelectorAll('.portfolio-card')];
  if (cards.length === 0) return null;

  let scrollEnabled = false;

  const enableScroll = () => {
    scrollEnabled = true;
  };

  window.addEventListener('scroll', enableScroll, { passive: true, once: true });

  const disposers = cards.map((card) => {
    let scrollLocked = false;

    const reveal = () => {
      card.classList.add(REVEAL_CLASS);
    };

    const hide = () => {
      if (scrollLocked) return;
      card.classList.remove(REVEAL_CLASS);
    };

    const onEnter = () => reveal();
    const onLeave = () => hide();

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !scrollEnabled) return;
        scrollLocked = true;
        reveal();
        observer.disconnect();
      });
    }, SCROLL_OBSERVER);

    observer.observe(card);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
    };
  });

  return () => {
    window.removeEventListener('scroll', enableScroll);
    disposers.forEach((dispose) => dispose());
  };
};
