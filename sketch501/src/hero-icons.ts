const ICON = {
  mining: '/public/assets/portfolio-hero/icon-mining.png',
  onchain: '/public/assets/portfolio-hero/icon-onchain.png',
  lock: '/public/assets/portfolio-hero/icon-lock.png',
  secure: '/public/assets/portfolio-hero/icon-secure.png',
  key: '/public/assets/portfolio-hero/icon-01.png',
  vault: '/public/assets/portfolio-hero/icon-04.png',
  yield: '/public/assets/portfolio-hero/icon-05.png',
  compute: '/public/assets/portfolio-hero/icon-06.png',
  cloud: '/public/assets/portfolio-hero/icon-08.png',
  bitcoin: '/public/assets/portfolio-hero/icon-09.png',
  growth: '/public/assets/portfolio-hero/icon-11.png',
  launch: '/public/assets/portfolio-hero/icon-12.png',
} as const;

export const HERO_ROWS = [
  {
    group: 'blockchain',
    icons: [
      { src: ICON.mining, label: 'mining' },
      { src: ICON.onchain, label: 'onchain' },
      { src: ICON.yield, label: 'yield' },
      { src: ICON.cloud, label: 'cloud' },
    ],
  },
  {
    group: 'security',
    icons: [
      { src: ICON.lock, label: 'lock' },
      { src: ICON.secure, label: 'secure' },
      { src: ICON.vault, label: 'vault' },
      { src: ICON.key, label: 'key' },
    ],
  },
  {
    group: 'defi',
    icons: [
      { src: ICON.bitcoin, label: 'bitcoin' },
      { src: ICON.compute, label: 'compute' },
      { src: ICON.growth, label: 'growth' },
      { src: ICON.launch, label: 'launch' },
    ],
  },
] as const;

export const HERO_COLS = 4;

const _srcs = HERO_ROWS.flatMap((row) => row.icons.map((icon) => icon.src));
if (new Set(_srcs).size !== _srcs.length) {
  throw new Error('HERO_ROWS must not repeat icon sources');
}
