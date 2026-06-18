const MAX_PHONE_SCREENS = 5;

const buildPhoneScreens = (detailImages = [], slides = []) => {
  const pool = [...detailImages, ...slides];
  const seen = new Set();
  const screens = [];

  pool.forEach((item) => {
    if (!item?.src || seen.has(item.src) || screens.length >= MAX_PHONE_SCREENS) return;
    seen.add(item.src);
    const label = (item.alt || 'Screen').split(/[—–,]/)[0].trim().slice(0, 36);
    screens.push({
      src: item.src,
      alt: item.alt || label,
      label,
    });
  });

  return screens;
};

const RAW_PORTFOLIO_CASES = [
  {
    id: 'motion-ds',
    company: 'Mezo',
    keywords: ['web3', 'defi', 'product design'],
    thumbnail: '/public/assets/services/mezo-bg.jpg',
    hoverImage: '/public/assets/services/mezo-bg.jpg',
    title: 'powered by blockchain',
    subtitle: 'make web3/defi accessible and safe',
    description:
      'Product design for Mezo — a bitcoin-native economic layer that helps developers build, grow, and ship DeFi with clearer money flows, onboarding, and trust patterns.',
    slides: [
      { src: '/public/assets/services/mezo-bg.jpg', alt: 'Mezo layered stack — your money, the bank, middlemen, you' },
      { src: '/public/assets/services/defi.png', alt: 'Mezo DeFi product detail' },
    ],
    detailImages: [
      { src: '/public/assets/services/mezo-bg.jpg', alt: 'Mezo layered stack — your money, the bank, middlemen, you' },
      { src: '/public/assets/services/defi.png', alt: 'Mezo DeFi product detail' },
    ],
    detailImageCount: 2,
    phoneScreens: [
      { src: '/public/assets/services/mez-1.png', alt: 'Mezo app screen 1', label: 'Screen 1' },
      { src: '/public/assets/services/mez-2.png', alt: 'Mezo app screen 2', label: 'Screen 2' },
      { src: '/public/assets/services/mez-3.png', alt: 'Mezo app screen 3', label: 'Screen 3' },
      { src: '/public/assets/services/mez-4.png', alt: 'Mezo app screen 4', label: 'Screen 4' },
    ],
  },
  {
    id: 'on-chain',
    company: 'Motion design system',
    keywords: ['motion system', 'component library', 'interaction design'],
    thumbnail: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg',
    hoverImage: '/public/assets/services/raw-gradients-ldrx5uab.jpg',
    title: 'motion design system',
    subtitle: 'build trust with a component library that feels alive',
    description:
      'A motion-first component library with timing tokens, interaction specs, and agent-assisted extensions so interfaces feel alive and consistent at scale.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'DeFi wallet onboarding flow' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Trading surface layout' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'On-chain data visualization' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Motion system components' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Interaction timing tokens' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'DeFi wallet onboarding' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Alive component states' },
    ],
  },
  {
    id: 'sloo',
    company: 'BlockFi',
    keywords: ['bitcoin', 'credit', 'reward'],
    thumbnail: '/public/assets/services/blockfi-bg-blue.jpg',
    hoverImage: '/public/assets/services/blockfi-bg-blue.jpg',
    title: 'blockfi visa',
    subtitle: 'bitcoin, credit, reward',
    description:
      'Product design for BlockFi — a bitcoin rewards Visa that bridges everyday credit with crypto-native value, from card reveal and rewards surfaces to checkout trust patterns.',
    slides: [
      { src: '/public/assets/services/blockfi-bg-blue.jpg', alt: 'BlockFi cards over blue geometric landscape' },
      { src: '/public/assets/services/bf-thumb-1.png', alt: 'BlockFi app screen detail 1' },
      { src: '/public/assets/services/bf-thumb-2.png', alt: 'BlockFi app screen detail 2' },
    ],
    detailImages: [
      { src: '/public/assets/services/blockfi-bg-blue.jpg', alt: 'BlockFi cards over blue geometric landscape' },
      { src: '/public/assets/services/bf-thumb-1.png', alt: 'BlockFi app screen detail 1' },
      { src: '/public/assets/services/bf-thumb-2.png', alt: 'BlockFi app screen detail 2' },
    ],
    detailImageCount: 3,
    phoneScreens: [
      { src: '/public/assets/services/bf-1.png', alt: 'BlockFi app screen 1', label: 'Screen 1' },
      { src: '/public/assets/services/bf-2.png', alt: 'BlockFi app screen 2', label: 'Screen 2' },
      { src: '/public/assets/services/bf-3.png', alt: 'BlockFi app screen 3', label: 'Screen 3' },
      { src: '/public/assets/services/bf-4.png', alt: 'BlockFi app screen 4', label: 'Screen 4' },
    ],
  },
  {
    id: 'generative',
    company: 'Generative Interfaces',
    keywords: ['generative ui', 'canvas', 'shaders'],
    thumbnail: '/public/assets/services/raw-gradients-fscayqib.jpg',
    hoverImage: '/public/assets/services/raw-gradients-ljs0kzkm.jpg',
    title: 'Generative Interfaces',
    subtitle: 'Canvas-based interaction modes',
    description:
      'Shader decks, ASCII portraits, and particle vessels — canvas-native interaction modes that treat generative media as first-class UI, not decoration.',
    slides: [
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Shader deck explorations' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'ASCII portrait pipeline' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Particle vessel prototype' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Shader deck explorations' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'ASCII portrait pipeline' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Particle vessel prototype' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Canvas interaction modes' },
    ],
  },
  {
    id: 'stoneface',
    company: 'Stoneface',
    keywords: ['generative portrait', 'shader deck', 'webgl'],
    thumbnail: '/public/assets/services/raw-gradients-ljs0kzkm.jpg',
    hoverImage: '/public/assets/services/raw-gradients-fscayqib.jpg',
    title: 'Stoneface',
    subtitle: 'generative portrait surface',
    description:
      'A shader-driven portrait system that treats likeness as a live material — tunable, unstable, and meant to be performed rather than captured.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Stoneface portrait pass' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Shader deck controls' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'WebGL output frame' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Portrait pass' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Shader controls' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Output frame' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Live material states' },
    ],
  },
  {
    id: 'second-life',
    company: 'Sloo',
    keywords: ['object stories', 'repair flows', 'circular living'],
    thumbnail: '/public/assets/services/raw-gradients-ldrx5uab.jpg',
    hoverImage: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg',
    title: 'Second Life of Objects',
    subtitle: 'a philosophy to live by',
    description:
      'Rituals and interfaces for seeing something new in the old before saying goodbye — repair, reuse, and reimagine everyday objects.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Object ritual screens' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Repair flows' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Community stories' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Ritual screens' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Repair flows' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Community stories' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Circular living patterns' },
    ],
  },
  {
    id: 'type-lab',
    company: 'Type Lab',
    keywords: ['variable type', 'skewed geometry', 'specimens'],
    thumbnail: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg',
    hoverImage: '/public/assets/services/raw-gradients-ggzjvx-n.jpg',
    title: 'Type Lab',
    subtitle: 'skewed typographic instruments',
    description:
      'Experimental type specimens and skewed layout tools for testing how far letterforms can bend before they still read.',
    slides: [
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Type specimen grid' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Skewed layout study' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Variable axis preview' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Specimen grid' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Skewed layout' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Variable preview' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Instrument panel' },
    ],
  },
  {
    id: 'mooslab',
    company: 'Mooslab',
    keywords: ['agentic ui', 'tooling', 'prototyping'],
    thumbnail: '/public/assets/services/raw-gradients-fscayqib.jpg',
    hoverImage: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg',
    title: 'Mooslab',
    subtitle: 'agent-native product surfaces',
    description:
      'Prototypes for agent-assisted workflows — states, handoffs, and controls that stay legible when software starts doing the typing.',
    slides: [
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Agent panel states' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Handoff surfaces' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Tooling prototype' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Agent states' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Handoff surfaces' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Tooling prototype' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Control patterns' },
    ],
  },
  {
    id: 'boarddashian',
    company: 'Boarddashian',
    keywords: ['dashboards', 'data ink', 'ops rhythm'],
    thumbnail: '/public/assets/services/raw-gradients-ggzjvx-n.jpg',
    hoverImage: '/public/assets/services/raw-gradients-ljs0kzkm.jpg',
    title: 'Boarddashian',
    subtitle: 'operations dashboards with taste',
    description:
      'Dense operational dashboards tuned for rhythm and scan — less chart junk, more signal about what needs a human next.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Ops dashboard layout' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Signal hierarchy study' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Alert surface' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Dashboard layout' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Signal hierarchy' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Alert surface' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Ops rhythm tiles' },
    ],
  },
  {
    id: 'skewed',
    company: 'Skewed',
    keywords: ['layout engine', 'distortion', 'responsive type'],
    thumbnail: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg',
    hoverImage: '/public/assets/services/raw-gradients-fscayqib.jpg',
    title: 'Skewed',
    subtitle: 'distorted layout playground',
    description:
      'A layout engine for skewed grids and responsive distortion — quick tests for how structure survives when geometry misbehaves.',
    slides: [
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Skewed grid study' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Distortion controls' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Responsive breakpoints' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Grid study' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Distortion controls' },
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Breakpoints' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Type stress tests' },
    ],
  },
  {
    id: 'services',
    company: 'Services',
    keywords: ['brand systems', 'illustration', 'gradient language'],
    thumbnail: '/public/assets/services/raw-gradients-ldrx5uab.jpg',
    hoverImage: '/public/assets/services/raw-gradients-ggzjvx-n.jpg',
    title: 'Services',
    subtitle: 'visual language for soft media',
    description:
      'Gradient and illustration systems for service storytelling — raw material turned into repeatable brand surfaces.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Gradient language' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Illustration set' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Brand tile system' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-ldrx5uab.jpg', alt: 'Gradient language' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Illustration set' },
      { src: '/public/assets/services/raw-illustrations-n8d3n8zf.jpg', alt: 'Brand tiles' },
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Surface specimens' },
    ],
  },
  {
    id: 'archive',
    company: 'Archive',
    keywords: ['experiments', 'sketches', 'process residue'],
    thumbnail: '/public/assets/services/raw-gradients-ljs0kzkm.jpg',
    hoverImage: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg',
    title: 'Archive',
    subtitle: 'process residue and dead ends',
    description:
      'A shelf of experiments that never shipped — sketches, shader tests, and interface dead ends kept for future theft.',
    slides: [
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Archive index' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Shader residue' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Interface sketches' },
    ],
    detailImages: [
      { src: '/public/assets/services/raw-gradients-ljs0kzkm.jpg', alt: 'Archive index' },
      { src: '/public/assets/services/raw-illustrations-lzfqw6-v.jpg', alt: 'Shader residue' },
      { src: '/public/assets/services/raw-gradients-fscayqib.jpg', alt: 'Interface sketches' },
      { src: '/public/assets/services/raw-gradients-ggzjvx-n.jpg', alt: 'Process notes' },
    ],
  },
];

export const PORTFOLIO_CASES = RAW_PORTFOLIO_CASES.map((item) => ({
  ...item,
  phoneScreens:
    item.phoneScreens?.length > 0
      ? item.phoneScreens
      : buildPhoneScreens(item.detailImages, item.slides),
}));

export const getPortfolioCase = (id) => PORTFOLIO_CASES.find((item) => item.id === id);
