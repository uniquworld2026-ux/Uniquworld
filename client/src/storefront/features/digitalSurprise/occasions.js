export const DIGITAL_PRICE_INR = 39

export const digitalOccasions = [
  {
    id: 'birthday',
    slug: 'birthday',
    title: 'Birthday Surprise',
    dateLabel: 'Any day',
    headline: 'Candles, confetti, and their name in lights — a birthday site that moves.',
    blurb: 'Pick a lively template, add a message & media, preview once, pay ₹39 for a private lifetime link.',
    image: '/gifts/birthday.jpg',
    accent: '#d4af37',
    templates: [
      { id: 'bd-mocha', name: 'ft. Tuji Bunny - interactive', hint: '7-card animated story · cake cut' },
      { id: 'bd-countdown', name: 'Countdown', hint: '3…2…1 surprise' },
      { id: 'bd-story', name: 'Story Slides', hint: 'Tap-through chapters' },
      { id: 'bd-orbit', name: 'Gift Orbit', hint: 'Icons circle their name' },
    ],
  },
]

export function getOccasionBySlug(slug) {
  return digitalOccasions.find((o) => o.slug === slug) || null
}

export function getOccasionById(id) {
  return digitalOccasions.find((o) => o.id === id) || null
}
