/**
 * 8 auto-play demo pages per occasion — images from /public/gifts + emoji + motion tones.
 * Sharable via /surprise/digital/:slug/demo?name=Priya&from=Rahul
 */

export function buildDemoSlides({ name = 'You', sender = 'Someone special' }) {
  const n = (name || 'You').trim() || 'You'
  const from = (sender || 'Someone special').trim() || 'Someone special'

  return [
    {
      emoji: '🎂',
      title: 'Psst…',
      body: 'A birthday surprise is loading just for you…',
      image: '/gifts/cake.jpg',
      tone: 'cake',
      effect: 'pulse',
    },
    {
      emoji: '🎈',
      title: `Happy Birthday ${n}!`,
      body: 'Balloons up. Confetti ready. The spotlight is yours.',
      image: '/gifts/birthday.jpg',
      tone: 'party',
      effect: 'confetti',
    },
    {
      emoji: '3️⃣',
      title: 'Three…',
      body: 'Something wonderful is about to happen.',
      image: '/gifts/celebration.jpg',
      tone: 'count',
      effect: 'kenburns',
    },
    {
      emoji: '2️⃣',
      title: 'Two…',
      body: 'Hold that smile a little longer.',
      image: '/gifts/party.jpg',
      tone: 'count',
      effect: 'float',
    },
    {
      emoji: '1️⃣',
      title: 'One…',
      body: 'Here we go!',
      image: '/gifts/surprise.jpg',
      tone: 'count',
      effect: 'pulse',
    },
    {
      emoji: '🎁',
      title: 'Unwrap the joy',
      body: `Gifts, giggles, and good vibes — from ${from}.`,
      image: '/gifts/gift-red.jpg',
      tone: 'gift',
      effect: 'kenburns',
    },
    {
      emoji: '🌟',
      title: 'Name in the lights',
      body: `${n} — written in sparkle, song, and celebration.`,
      image: '/gifts/kids.jpg',
      tone: 'sky',
      effect: 'sparkle',
    },
    {
      emoji: '🔓',
      title: 'Unlock your page',
      body: 'Pay ₹39 for a private interactive birthday link that never expires. Share it with them!',
      image: '/gifts/hamper.jpg',
      tone: 'unlock',
      effect: 'confetti',
    },
  ]
}

export const DEMO_TONE_STYLES = {
  unlock: 'linear-gradient(160deg,rgba(10,45,77,0.92),rgba(31,78,121,0.75))',
  cake: 'linear-gradient(180deg,rgba(30,22,48,0.9),rgba(74,48,96,0.75))',
  party: 'linear-gradient(160deg,rgba(15,118,110,0.88),rgba(19,78,74,0.8))',
  count: 'linear-gradient(180deg,rgba(17,24,39,0.9),rgba(76,29,149,0.75))',
  gift: 'linear-gradient(180deg,rgba(59,29,15,0.9),rgba(124,45,18,0.75))',
  sky: 'radial-gradient(circle at bottom,rgba(26,16,64,0.9),rgba(5,5,16,0.95))',
}
