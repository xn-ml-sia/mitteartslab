import { definePortfolioCard } from './portfolio-card.js';

/** Add cards here — order = grid order (round-robin into columns). See docs/design.md § Portfolio cards. */
export const PORTFOLIO_CASES = [
  definePortfolioCard({
    id: 'zalando',
    company: 'zalando',
    keywords: ['motion', 'design', 'system'],
    hero: {
      src: 'zalando-bg.png',
      alt: 'Zalando — motion, design, system',
    },
    hover: 'zalando-bg.png',
    thumbnail: 'zalando-bg.png',
    thumbs: [
      { src: 'bottomsheet.webm', alt: 'Zalando bottom sheet motion' },
      { src: 'easing.webm', alt: 'Zalando easing motion tokens' },
    ],
    screens: ['z-1.png', 'z-2.png', 'z-3.png'],
    subtitle: '',
    description:
      'Unified the brand’s identity across all digital touchpoints. By moving from "prototype-based handoffs" to "token-based implementation," I significantly reduced engineering overhead and eliminated motion discrepancies, ensuring a seamless, high-performance user experience across web and mobile.',
    sections: [
      {
        text:
          'Built a platform-agnostic motion design system to replace a fragmented, Lottie-dependent setup that was hurting runtime performance across platforms. Designed a tokenized motion primitive system — bringing micro-interactions directly into the design token layer. Eliminated the bundle overhead and gave the design system a consistent, scalable animation language across the entire product ecosystem.',
        image: 'zalando-bg3.png',
        imageAlt: 'Zalando motion and design system — product interface patterns',
      },
    ],
  }),

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
    subtitle: '',
    description:
      'Mezo — a bitcoin-native economic layer that helps developers build, grow, and ship DeFi with clearer money flows, onboarding, and trusted patterns.',
    sections: [
      {
        text:
          'Architected and implemented a unified transaction orchestration system to standardize complex, multi-step wallet interactions across diverse product modules (Vaults, Pools, Lock, and Withdrawals). By replacing fragmented signing workflows with a centralized, state-aware progress engine, I reduced user cognitive load and eliminated "transaction anxiety." This standardization ensured a consistent mental model across the entire ecosystem, significantly increasing successful transaction completion rates during high-stakes multi-signature processes.',
        image: 'mezo-thumb-1.png',
        imageAlt: 'Mezo transaction stepper — progressive signing and fee states',
      },
    ],
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
    subtitle: '',
    description:
      'Csign Agreements are signed with SSI Verifiable Credential and then certified on the blockchain.',
    sections: [
      {
        text:
          'Most identity systems rely on centralized authorities that create single points of failure and massive privacy risks. The challenge was to architect a contract-signing protocol that achieves verifiable legal identity while adhering to the principle of Self-Sovereign Identity (SSI)—where users maintain absolute control over their own credentials and data.',
        image: 'cs-mock-3.png',
        imageAlt: 'Csign identity verification — private agreement signing flow',
      },
    ],
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
    subtitle: '',
    description:
      'Launching the first crypto card means compliances, regulations and many edge cases need to be design for that first mover advantage.',
    sections: [
      {
        text:
          'Designed the user experience for a pioneering Bitcoin-backed credit product, focusing on bridging the gap between complex regulatory requirements and seamless consumer UX. Developed a robust framework for progressive disclosure to manage legal compliance without compromising usability. Implemented a transparent status-tracking system that provided real-time feedback throughout the application and card activation journey, directly contributing to higher user retention and reduced friction in the post-approval lifecycle.',
        image: 'bf-thumb-3.png',
        imageAlt: 'BlockFi rewards credit card — app earn and redeem flows',
      },
    ],
  }),
];

export const getPortfolioCase = (id) => PORTFOLIO_CASES.find((item) => item.id === id);
