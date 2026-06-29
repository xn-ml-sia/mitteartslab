/** Portfolio work card — define once in portfolio-data.js via definePortfolioCard(). */

export const SERVICES_ASSETS = '/public/assets/services';

export const MAX_PHONE_SCREENS = 5;

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isObject = (value) => value !== null && typeof value === 'object';

const isVideoAsset = (src) => /\.(webm|mp4|ogg)(\?|#|$)/i.test(src || '');

const resolveAsset = (src) =>
  src.startsWith('/') ? src : `${SERVICES_ASSETS}/${src.replace(/^\.\//, '')}`;

/** @param {string | { src: string, alt?: string }} entry @param {string} fallbackAlt */
export const image = (entry, fallbackAlt = '') => {
  if (isObject(entry)) {
    return {
      src: resolveAsset(entry.src),
      alt: entry.alt || fallbackAlt,
    };
  }

  return {
    src: resolveAsset(entry),
    alt: fallbackAlt,
  };
};

/** @param {string | { src: string, alt?: string, label?: string }} entry @param {number} index @param {string} company */
export const phoneScreen = (entry, index, company) => {
  if (isObject(entry)) {
    const alt = entry.alt || `${company} app screen ${index + 1}`;
    return {
      src: resolveAsset(entry.src),
      alt,
      label: entry.label || `Screen ${index + 1}`,
    };
  }

  const alt = `${company} app screen ${index + 1}`;
  return {
    src: resolveAsset(entry),
    alt,
    label: `Screen ${index + 1}`,
  };
};

const buildPhoneScreensFromPool = (detailImages = [], slides = []) => {
  const pool = [...detailImages, ...slides];
  const seen = new Set();
  const screens = [];

  pool.forEach((item) => {
    if (!item?.src || seen.has(item.src) || isVideoAsset(item.src) || screens.length >= MAX_PHONE_SCREENS) return;
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

/**
 * @param {{
 *   id?: string,
 *   company: string,
 *   keywords: string[],
 *   hero: string | { src: string, alt?: string },
 *   hover?: string | { src: string, alt?: string },
 *   thumbnail?: string | { src: string, alt?: string },
 *   thumbs?: Array<string | { src: string, alt?: string }>,
 *   screens?: Array<string | { src: string, alt?: string, label?: string }>,
 *   title?: string,
 *   subtitle: string,
 *   description: string,
 *   sections?: Array<{ text: string, image: string | { src: string, alt?: string }, imageAlt?: string }>,
 * }} config
 */
export const definePortfolioCard = ({
  id,
  company,
  keywords,
  hero,
  hover,
  thumbnail,
  thumbs = [],
  screens = [],
  title,
  subtitle,
  description,
  sections = [],
}) => {
  const cardId = id || slugify(company);
  const heroImage = image(hero, `${company} hero`);
  const hoverImage = image(hover ?? hero, `${company} hover`);
  const thumbImage = image(thumbnail ?? hero, company);

  const thumbImages = thumbs.map((entry, index) =>
    image(entry, `${company} detail ${index + 1}`),
  );

  const detailImages = [heroImage, ...thumbImages];
  const slides = thumbImages.length > 0 ? thumbImages : [heroImage];

  const phoneScreens =
    screens.length > 0
      ? screens.map((entry, index) => phoneScreen(entry, index, company))
      : buildPhoneScreensFromPool(detailImages, slides);

  const detailSections = sections.map((entry) => ({
    text: entry.text,
    image: image(entry.image, entry.imageAlt || `${company} case study detail`),
  }));

  return {
    id: cardId,
    company,
    keywords,
    thumbnail: thumbImage.src,
    hoverImage: hoverImage.src,
    title: title || company,
    subtitle,
    description,
    sections: detailSections,
    slides,
    detailImages,
    detailImageCount: detailImages.length,
    phoneScreens,
  };
};
