export const DIGITAL_PRICE_INR = 49

export const digitalOccasions = [
  {
    id: 'girlfriends_day',
    slug: 'girlfriends-day',
    title: 'National Girlfriends Day',
    dateLabel: 'August 1',
    headline: 'Celebrate the special women in your life with beautiful blooms!',
    blurb: 'A romantic interactive page — enter her name, add Insta / video, preview once, then unlock for ₹49.',
    image: '/gifts/flowers.jpg',
    accent: '#d92c2b',
    templates: [
      { id: 'gf-bloom', name: 'Bloom Cascade', hint: 'Falling petals + name reveal' },
      { id: 'gf-polaroid', name: 'Polaroid Stack', hint: 'Flip memories' },
      { id: 'gf-constellation', name: 'Heart Stars', hint: 'Constellation of love' },
      { id: 'gf-letter', name: 'Love Letter', hint: 'Typewriter message' },
      { id: 'gf-spotlight', name: 'Insta Spotlight', hint: 'Feature her post' },
      { id: 'gf-balloons', name: 'Soft Balloons', hint: 'Floating wishes' },
      { id: 'gf-scrapbook', name: 'Scrapbook', hint: 'Page-turn story' },
      { id: 'gf-neon', name: 'Neon Night', hint: 'City lights + name' },
    ],
  },
  {
    id: 'birthday',
    slug: 'birthday',
    title: 'Birthday Surprise',
    dateLabel: 'Any day',
    headline: 'Candles, confetti, and their name in lights — a birthday site that moves.',
    blurb: 'Pick a lively template, add a message & media, preview once, pay ₹49 for a private 30-day link.',
    image: '/gifts/birthday.jpg',
    accent: '#d4af37',
    templates: [
      { id: 'bd-cake', name: 'Candle Wish', hint: 'Blow & confetti' },
      { id: 'bd-balloons', name: 'Balloon Pop', hint: 'Tap to celebrate' },
      { id: 'bd-countdown', name: 'Countdown', hint: '3…2…1 surprise' },
      { id: 'bd-unwrap', name: 'Gift Unwrap', hint: 'Open the present' },
      { id: 'bd-carousel', name: 'Spin Gallery', hint: 'Photo carousel' },
      { id: 'bd-fireworks', name: 'Name Sky', hint: 'Firework finale' },
      { id: 'bd-karaoke', name: 'Happy Song', hint: 'Lyric scroll' },
      { id: 'bd-tunnel', name: 'Party Tunnel', hint: 'Confetti rush' },
    ],
  },
  {
    id: 'diwali',
    slug: 'diwali',
    title: 'Diwali Surprise',
    dateLabel: 'Festival of Lights',
    headline: 'Diyas, sparklers, and a warm festive wish made just for them.',
    blurb: 'Eight glowing templates — light diyas, rise lanterns, share your Diwali page for ₹49.',
    image: '/gifts/festival.jpg',
    accent: '#c45c26',
    templates: [
      { id: 'dw-diya', name: 'Light the Diya', hint: 'Tap to glow' },
      { id: 'dw-rangoli', name: 'Rangoli Bloom', hint: 'Colour unfold' },
      { id: 'dw-sparkler', name: 'Sparkler Trail', hint: 'Follow the light' },
      { id: 'dw-lantern', name: 'Sky Lanterns', hint: 'Rise & shine' },
      { id: 'dw-cracker', name: 'Cracker Burst', hint: 'Name fireworks' },
      { id: 'dw-mandala', name: 'Mandala Spin', hint: 'Sacred geometry' },
      { id: 'dw-foil', name: 'Gold Foil Card', hint: 'Shimmer greet' },
      { id: 'dw-bells', name: 'Temple Lights', hint: 'Bells & glow' },
    ],
  },
]

export function getOccasionBySlug(slug) {
  return digitalOccasions.find((o) => o.slug === slug) || null
}

export function getOccasionById(id) {
  return digitalOccasions.find((o) => o.id === id) || null
}
