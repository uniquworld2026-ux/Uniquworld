const OCCASIONS = {
  birthday: {
    id: 'birthday',
    slug: 'birthday',
    title: 'Birthday Surprise',
    dateLabel: 'Any day',
    headline: 'A moving birthday website — candles, confetti, and their name in lights.',
    priceInr: 39,
    kind: 'surprise',
    templates: ['bd-mocha', 'bd-countdown', 'bd-story', 'bd-orbit'],
  },
  wedding: {
    id: 'wedding',
    slug: 'wedding',
    title: 'Wedding Invitation',
    dateLabel: 'Save the date',
    headline: 'An elegant digital invite for your ceremony.',
    priceInr: 39,
    kind: 'invitation',
    templates: ['inv-wed-classic', 'inv-wed-garden', 'inv-wed-midnight', 'inv-wed-mandala'],
  },
  birthday_party: {
    id: 'birthday_party',
    slug: 'birthday-party',
    title: 'Birthday Party Invite',
    dateLabel: 'Celebrate',
    headline: 'A lively party invite with time, place, and a personal note.',
    priceInr: 39,
    kind: 'invitation',
    templates: ['inv-bd-confetti', 'inv-bd-balloon', 'inv-bd-neon', 'inv-bd-story'],
  },
  housewarming: {
    id: 'housewarming',
    slug: 'housewarming',
    title: 'Housewarming Invite',
    dateLabel: 'New home',
    headline: 'Invite friends and family to your new place.',
    priceInr: 39,
    kind: 'invitation',
    templates: ['inv-hw-keys', 'inv-hw-hearth', 'inv-hw-garden', 'inv-hw-minimal'],
  },
  baby_shower: {
    id: 'baby_shower',
    slug: 'baby-shower',
    title: 'Baby Shower Invite',
    dateLabel: 'Little joy',
    headline: 'A gentle invite for the baby shower.',
    priceInr: 39,
    kind: 'invitation',
    templates: ['inv-bs-cloud', 'inv-bs-bloom', 'inv-bs-star', 'inv-bs-letter'],
  },
};

const PRICE_PAISE = 3900;

const isValidOccasion = (id) => Boolean(OCCASIONS[id]);
const isValidTemplate = (occasionId, templateId) =>
  OCCASIONS[occasionId]?.templates?.includes(templateId);

module.exports = {
  OCCASIONS,
  PRICE_PAISE,
  isValidOccasion,
  isValidTemplate,
};
