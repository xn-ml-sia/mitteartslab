const ICON = {
  i01: '/public/assets/portfolio-hero/icon-01.svg',
  i02: '/public/assets/portfolio-hero/icon-02.svg',
  i03: '/public/assets/portfolio-hero/icon-03.svg',
  i04: '/public/assets/portfolio-hero/icon-04.svg',
  i05: '/public/assets/portfolio-hero/icon-05.svg',
  i06: '/public/assets/portfolio-hero/icon-06.svg',
  i07: '/public/assets/portfolio-hero/icon-07.svg',
  i08: '/public/assets/portfolio-hero/icon-08.svg',
  i09: '/public/assets/portfolio-hero/icon-09.svg',
  i10: '/public/assets/portfolio-hero/icon-10.svg',
  i11: '/public/assets/portfolio-hero/icon-11.svg',
  i12: '/public/assets/portfolio-hero/icon-12.svg',
} as const;

export const HERO_ROWS = [
  {
    group: 'blockchain',
    icons: [
      { src: ICON.i10, label: 'mining' },
      { src: ICON.i07, label: 'onchain' },
      { src: ICON.i03, label: 'yield' },
      { src: ICON.i11, label: 'cloud' },
    ],
  },
  {
    group: 'security',
    icons: [
      { src: ICON.i02, label: 'lock' },
      { src: ICON.i06, label: 'secure' },
      { src: ICON.i09, label: 'vault' },
      { src: ICON.i01, label: 'key' },
    ],
  },
  {
    group: 'defi',
    icons: [
      { src: ICON.i08, label: 'bitcoin' },
      { src: ICON.i12, label: 'compute' },
      { src: ICON.i05, label: 'growth' },
      { src: ICON.i04, label: 'launch' },
    ],
  },
] as const;

export const HERO_COLS = 4;

const _srcs = HERO_ROWS.flatMap((row) => row.icons.map((icon) => icon.src));
if (new Set(_srcs).size !== _srcs.length) {
  throw new Error('HERO_ROWS must not repeat icon sources');
}
