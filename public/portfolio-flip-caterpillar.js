const updateCaterpillar = (track, forward) =>
  new Promise((resolve) => {
    const slides = gsap.utils.toArray('img', track);
    if (slides.length < 2) {
      resolve();
      return;
    }

    const first = slides[0];
    const last = slides[slides.length - 1];
    const state = Flip.getState(slides);
    const newSlide = document.createElement('img');
    gsap.set(newSlide, { scale: 0, opacity: 0 });

    if (forward) {
      newSlide.src = first.src;
      newSlide.alt = first.alt;
      track.append(newSlide);
      first.classList.add('is-carousel-hidden');
    } else {
      newSlide.src = last.src;
      newSlide.alt = last.alt;
      track.prepend(newSlide);
      last.classList.add('is-carousel-hidden');
    }

    const nextSlides = gsap.utils.toArray('img', track);

    Flip.from(state, {
      targets: nextSlides,
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

  root.querySelectorAll('.portfolio-card').forEach((card) => {
    const track = card.querySelector('.portfolio-card__carousel');
    if (!track) return;

    let isAnimating = false;
    let hoverTimeout = 0;
    let hoverInterval = 0;

    const step = async (forward = true) => {
      if (isAnimating) return;
      isAnimating = true;
      await updateCaterpillar(track, forward);
      isAnimating = false;
    };

    const onEnter = () => {
      hoverTimeout = window.setTimeout(() => {
        hoverTimeout = 0;
        step(true);
        hoverInterval = window.setInterval(() => step(true), STEP_INTERVAL_MS);
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
