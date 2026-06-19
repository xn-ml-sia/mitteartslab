import { definePortfolioCard } from './portfolio-card.js';

/** Add cards here — order = grid order (round-robin into columns). See docs/design.md § Portfolio cards. */
export const PORTFOLIO_CASES = [
  definePortfolioCard({
    id: 'mezo',
    company: 'Mezo',
    keywords: ['web3', 'defi', 'fintech'],
    hero: {
      src: 'mezo-bg.jpg',
      alt: 'Mezo layered stack — your money, the bank, middlemen, you',
    },
    thumbs: [{ src: 'defi.png', alt: 'Mezo DeFi product detail' }],
    screens: ['mez-1.png', 'mez-2.png', 'mez-3.png', 'mez-4.png'],
    title: 'powered by blockchain',
    subtitle: 'make web3 accessible and safe',
    description:
      'Product design for Mezo — a bitcoin-native economic layer that helps developers build, grow, and ship DeFi with clearer money flows, onboarding, and trust patterns.',
  }),

  definePortfolioCard({
    id: 'csign',
    company: 'csign',
    keywords: ['web3', 'identity', 'ssi'],
    hero: { src: 'cs-bg.png', alt: 'Csign identity system — gradient field' },
    thumbs: [
      { src: 'cs-mock-1.png', alt: 'Csign credential wallet home' },
      { src: 'cs-mock-2.png', alt: 'Csign identity verification flow' },
    ],
    screens: ['cs-1.png', 'cs-2.png', 'cs-3.png'],
    title: 'self-sovereign identity',
    subtitle: '100% private agreements',
    description:
      'Agreements are signed with SSI Verifiable Credential and then certified on the blockchain.',
  }),

  definePortfolioCard({
    id: 'blockfi',
    company: 'BlockFi',
    keywords: ['fintech', 'credit card', 'reward'],
    hero: {
      src: 'blockfi-bg-blue.jpg',
      alt: 'BlockFi cards over blue geometric landscape',
    },
    thumbs: [
      { src: 'bf-thumb-1.png', alt: 'BlockFi app screen detail 1' },
      { src: 'bf-thumb-2.png', alt: 'BlockFi app screen detail 2' },
    ],
    screens: ['bf-1.png', 'bf-2.png', 'bf-3.png', 'bf-4.png'],
    title: 'blockfi visa',
    subtitle: 'Industry First Crypto Reward Credit Card',
    description:
      'Launched the first crypto card means compliances, regulations and many edge cases need to be design for that first mover advantage.',
  }),
];

export const getPortfolioCase = (id) => PORTFOLIO_CASES.find((item) => item.id === id);
