const OCCASIONS = {
  girlfriends_day: {
    id: 'girlfriends_day',
    slug: 'girlfriends-day',
    title: 'National Girlfriends Day',
    dateLabel: 'August 1',
    headline: 'Celebrate the special women in your life with beautiful blooms!',
    priceInr: 49,
    templates: [
      'gf-bloom',
      'gf-polaroid',
      'gf-constellation',
      'gf-letter',
      'gf-spotlight',
      'gf-balloons',
      'gf-scrapbook',
      'gf-neon',
    ],
  },
  birthday: {
    id: 'birthday',
    slug: 'birthday',
    title: 'Birthday Surprise',
    dateLabel: 'Any day',
    headline: 'A moving birthday website — candles, confetti, and their name in lights.',
    priceInr: 49,
    templates: [
      'bd-mocha',
      'bd-countdown',
      'bd-story',
      'bd-orbit',
    ],
  },
  diwali: {
    id: 'diwali',
    slug: 'diwali',
    title: 'Diwali Surprise',
    dateLabel: 'Festival of Lights',
    headline: 'Light diyas, sparkles, and a warm festive wish made just for them.',
    priceInr: 49,
    templates: [
      'dw-diya',
      'dw-rangoli',
      'dw-sparkler',
      'dw-lantern',
      'dw-cracker',
      'dw-mandala',
      'dw-foil',
      'dw-bells',
    ],
  },
};

const PRICE_PAISE = 4900;
const EXPIRY_DAYS = 30;

const isValidOccasion = (id) => Boolean(OCCASIONS[id]);
const isValidTemplate = (occasionId, templateId) =>
  OCCASIONS[occasionId]?.templates?.includes(templateId);

module.exports = {
  OCCASIONS,
  PRICE_PAISE,
  EXPIRY_DAYS,
  isValidOccasion,
  isValidTemplate,
};
