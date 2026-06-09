const updateCaterpillar = (container, forward) =>
  new Promise((resolve) => {
    const cards = gsap.utils.toArray('img', container);
    if (cards.length < 2) {
      resolve();
      return;
    }

    const first = cards[0];
    const last = cards[cards.length - 1];
    const state = Flip.getState(cards);
    const newCard = document.createElement('img');
    gsap.set(newCard, { scale: 0, opacity: 0 });

    if (forward) {
      newCard.src = first.src;
      newCard.alt = first.alt;
      container.append(newCard);
      first.classList.add('hide');
    } else {
      newCard.src = last.src;
      newCard.alt = last.alt;
      container.prepend(newCard);
      last.classList.add('hide');
    }

    const nextCards = gsap.utils.toArray('img', container);

    Flip.from(state, {
      targets: nextCards,
      fade: true,
      absoluteOnLeave: true,
      onEnter: (els) => {
        gsap.to(els, {
          opacity: 1,
          scale: 1,
          transformOrigin: forward ? 'bottom right' : 'bottom left',
        });
      },
      onLeave: (els) => {
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          transformOrigin: forward ? 'bottom left' : 'bottom right',
          onComplete: () => {
            els[0].remove();
            resolve();
          },
        });
      },
    });
  });

const INITIAL_DELAY_MS = 600;
const STEP_INTERVAL_MS = 1000;

export const initPortfolioFlipCaterpillar = (root = document) => {
  if (typeof gsap === 'undefined' || typeof Flip === 'undefined') return null;

  gsap.registerPlugin(Flip);

  const disposers = [];

  root.querySelectorAll('[data-portfolio-flip]').forEach((card) => {
    const container = card.querySelector('[data-portfolio-flip-container]');
    if (!container) return;

    let isAnimating = false;
    let hoverTimeout = 0;
    let hoverInterval = 0;

    const step = async (forward = true) => {
      if (isAnimating) return;
      isAnimating = true;
      await updateCaterpillar(container, forward);
      isAnimating = false;
    };

    const onEnter = () => {
      hoverTimeout = window.setTimeout(() => {
        hoverTimeout = 0;
        step(true);
        hoverInterval = window.setInterval(() => {
          step(true);
        }, STEP_INTERVAL_MS);
      }, INITIAL_DELAY_MS);
    };

    const onLeave = () => {
      window.clearTimeout(hoverTimeout);
      window.clearInterval(hoverInterval);
      hoverTimeout = 0;
      hoverInterval = 0;
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    disposers.push(() => {
      window.clearTimeout(hoverTimeout);
      window.clearInterval(hoverInterval);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    });
  });

  if (disposers.length === 0) return null;

  return () => {
    disposers.forEach((dispose) => dispose());
  };
};
