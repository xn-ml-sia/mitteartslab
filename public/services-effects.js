export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getGsap = () => {
  const gsap = window.gsap;
  const Flip = window.Flip;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap?.timeline || !Flip || !ScrollTrigger) return null;

  if (gsap.registerPlugin) {
    gsap.registerPlugin(Flip, ScrollTrigger);
  }

  return { gsap, Flip, ScrollTrigger };
};

class ExpandEffect1 {
  constructor(el) {
    this.el = el;
    this.image = el.querySelector('.type__expand-img');
    this.texts = el.querySelectorAll('.anim');
    this.caption = el.nextElementSibling;
    this.tweens = [];
    this.init();
  }

  init() {
    const plugins = getGsap();
    if (!plugins || prefersReducedMotion()) {
      this.el.classList.add('type--open');
      return;
    }

    const { Flip } = plugins;
    this.el.classList.add('type--open');
    const flipState = Flip.getState([this.image, ...this.texts], { props: 'transform' });
    this.el.classList.remove('type--open');

    this.tweens.push(
      Flip.to(flipState, {
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: this.el,
          start: 'clamp(top bottom)',
          end: '+=135%',
          scrub: true,
        },
      }).to(
        this.caption,
        {
          ease: 'sine.inOut',
          yPercent: -150,
          opacity: 0.2,
          skewX: -8,
          scrollTrigger: {
            trigger: this.caption,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
        0,
      ),
    );
  }

  dispose() {
    this.tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    this.tweens = [];
    this.el.classList.remove('type--open');
  }
}

class ExpandEffect2 {
  constructor(el) {
    this.el = el;
    this.image = el.querySelector('.type__expand-img');
    this.texts = el.querySelectorAll('.anim');
    this.caption = el.nextElementSibling;
    this.tweens = [];
    this.init();
  }

  init() {
    const plugins = getGsap();
    if (!plugins || prefersReducedMotion()) {
      this.el.classList.add('type--open');
      return;
    }

    const { Flip } = plugins;
    this.el.classList.add('type--open');
    const flipState = Flip.getState([this.image, ...this.texts], { props: 'transform' });
    this.el.classList.remove('type--open');

    this.tweens.push(
      Flip.to(flipState, {
        ease: 'sine.inOut',
        simple: true,
        scrollTrigger: {
          trigger: this.el,
          start: 'center bottom',
          end: 'center top',
          scrub: true,
        },
      }).fromTo(
        this.caption,
        { xPercent: 15, skewX: -5 },
        {
          ease: 'sine.inOut',
          xPercent: -15,
          skewX: 5,
          opacity: 0.2,
          scrollTrigger: {
            trigger: this.caption,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
        0,
      ),
    );
  }

  dispose() {
    this.tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    this.tweens = [];
    this.el.classList.remove('type--open');
  }
}

class ExpandEffect3 {
  constructor(el) {
    this.el = el;
    this.image = el.querySelector('.type__expand-img');
    this.caption = el.nextElementSibling;
    this.tweens = [];
    this.init();
  }

  init() {
    const plugins = getGsap();
    if (!plugins || prefersReducedMotion()) {
      this.el.classList.add('type--open');
      return;
    }

    const { Flip } = plugins;
    this.el.classList.add('type--open');
    const flipState = Flip.getState(this.image);
    this.el.classList.remove('type--open');

    this.tweens.push(
      Flip.to(flipState, {
        ease: 'sine',
        simple: true,
        scrollTrigger: {
          trigger: this.el,
          start: 'center bottom',
          end: 'center top',
          scrub: true,
        },
      }).fromTo(
        this.caption,
        { lineHeight: 1.2, willChange: 'line-height' },
        {
          ease: 'sine.inOut',
          yPercent: -40,
          skewX: -2,
          lineHeight: 2,
          opacity: 0.2,
          scrollTrigger: {
            trigger: this.caption,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
        0,
      ),
    );
  }

  dispose() {
    this.tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    this.tweens = [];
    this.el.classList.remove('type--open');
  }
}

class ExpandEffect5 {
  constructor(el) {
    this.el = el;
    this.images = el.querySelectorAll('.type__expand-img');
    this.caption = el.nextElementSibling;
    this.tweens = [];
    this.init();
  }

  init() {
    const plugins = getGsap();
    if (!plugins || prefersReducedMotion()) {
      this.el.classList.add('type--open');
      return;
    }

    const { Flip } = plugins;
    this.el.classList.add('type--open');
    const flipState = Flip.getState([...this.images]);
    this.el.classList.remove('type--open');

    this.tweens.push(
      Flip.to(flipState, {
        ease: 'sine.inOut',
        simple: true,
        scrollTrigger: {
          trigger: this.el,
          start: 'top bottom',
          end: 'center top',
          scrub: true,
        },
      }).to(
        this.caption,
        {
          ease: 'sine.inOut',
          yPercent: -60,
          opacity: 0.2,
          scrollTrigger: {
            trigger: this.caption,
            start: 'top bottom',
            end: 'clamp(bottom top)',
            scrub: true,
          },
        },
        0,
      ),
    );
  }

  dispose() {
    this.tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    this.tweens = [];
    this.el.classList.remove('type--open');
  }
}

const EFFECTS = {
  1: ExpandEffect1,
  2: ExpandEffect2,
  3: ExpandEffect3,
  5: ExpandEffect5,
};

export const initEffects = (root) => {
  const instances = [];

  root.querySelectorAll('[data-services-expand]').forEach((el) => {
    const Effect = EFFECTS[el.dataset.servicesExpand];
    if (Effect) instances.push(new Effect(el));
  });

  window.ScrollTrigger?.refresh();

  return {
    dispose: () => {
      instances.forEach((instance) => instance.dispose());
      window.ScrollTrigger?.refresh();
    },
  };
};
