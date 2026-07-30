/**
 * 8 auto-play demo pages per occasion — images from /public/gifts + emoji + motion tones.
 * Sharable via /surprise/digital/:slug/demo?name=Priya&from=Rahul
 */

export function buildDemoSlides({ occasionId, name = 'You', sender = 'Someone special' }) {
  const n = (name || 'You').trim() || 'You'
  const from = (sender || 'Someone special').trim() || 'Someone special'

  if (occasionId === 'girlfriends_day') {
    return [
      {
        emoji: '💖',
        title: 'A little secret…',
        body: 'Someone prepared a blooming surprise just for you.',
        image: '/gifts/flowers.jpg',
        tone: 'rose',
        effect: 'float',
      },
      {
        emoji: '🌹',
        title: `Hi ${n}`,
        body: 'National Girlfriends Day — celebrate the woman who lights up every room.',
        image: '/gifts/relationship.jpg',
        tone: 'bloom',
        effect: 'kenburns',
      },
      {
        emoji: '✨',
        title: 'You make days brighter',
        body: 'Ordinary moments turn magical when you’re around.',
        image: '/gifts/anniversary.jpg',
        tone: 'gold',
        effect: 'sparkle',
      },
      {
        emoji: '💌',
        title: 'Soft words',
        body: 'A love note folded into petals — opened only for you.',
        image: '/gifts/thankyou.jpg',
        tone: 'letter',
        effect: 'float',
      },
      {
        emoji: '🌸',
        title: 'Garden of wishes',
        body: 'Imagine every bloom saying your name in colour.',
        image: '/gifts/plant.jpg',
        tone: 'bloom',
        effect: 'kenburns',
      },
      {
        emoji: '🥰',
        title: 'You are cherished',
        body: `From ${from} — with all the warmth a heart can hold.`,
        image: '/gifts/gift-red.jpg',
        tone: 'rose',
        effect: 'pulse',
      },
      {
        emoji: '🌙',
        title: 'Neon night wish',
        body: `${n} — glowing softly under city lights and quiet dreams.`,
        image: '/gifts/surprise.jpg',
        tone: 'neon',
        effect: 'sparkle',
      },
      {
        emoji: '🔓',
        title: 'Unlock the full page',
        body: 'Pay ₹49 for a private interactive link — valid 30 days. Share the magic.',
        image: '/gifts/hamper.jpg',
        tone: 'unlock',
        effect: 'confetti',
      },
    ]
  }

  if (occasionId === 'diwali') {
    return [
      {
        emoji: '🪔',
        title: 'Shubh Diwali',
        body: 'Lights are waking… a festive surprise is on its way.',
        image: '/gifts/festival.jpg',
        tone: 'diya',
        effect: 'pulse',
      },
      {
        emoji: '✨',
        title: `Namaste ${n}`,
        body: 'May sparklers write your name across the night sky.',
        image: '/gifts/celebration.jpg',
        tone: 'spark',
        effect: 'sparkle',
      },
      {
        emoji: '🎆',
        title: 'Sky of colour',
        body: 'Crackers, laughter, and sweets — joy in every spark.',
        image: '/gifts/party.jpg',
        tone: 'burst',
        effect: 'confetti',
      },
      {
        emoji: '🏮',
        title: 'Lanterns rising',
        body: 'One light for hope. One for family. One for you.',
        image: '/gifts/decor.jpg',
        tone: 'lantern',
        effect: 'float',
      },
      {
        emoji: '🔶',
        title: 'Rangoli bloom',
        body: 'Patterns unfold — luck, love, and togetherness.',
        image: '/gifts/home.jpg',
        tone: 'rangoli',
        effect: 'kenburns',
      },
      {
        emoji: '🙏',
        title: 'Warm wishes',
        body: `From ${from} — may sweetness fill your home this season.`,
        image: '/gifts/chocolate.jpg',
        tone: 'foil',
        effect: 'pulse',
      },
      {
        emoji: '💫',
        title: 'Golden shimmer',
        body: `${n} — may your lights never dim.`,
        image: '/gifts/spa.jpg',
        tone: 'foil',
        effect: 'sparkle',
      },
      {
        emoji: '🔓',
        title: 'Unlock Diwali page',
        body: '₹49 · private interactive surprise · auto-expires in 30 days.',
        image: '/gifts/hamper.jpg',
        tone: 'unlock',
        effect: 'confetti',
      },
    ]
  }

  // birthday — 8 pages
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
      body: 'Pay ₹49 for a private interactive birthday link (30 days). Share it with them!',
      image: '/gifts/hamper.jpg',
      tone: 'unlock',
      effect: 'confetti',
    },
  ]
}

export const DEMO_TONE_STYLES = {
  rose: 'linear-gradient(160deg,rgba(74,16,32,0.92),rgba(166,29,58,0.75))',
  bloom: 'linear-gradient(180deg,rgba(91,33,64,0.88),rgba(249,168,212,0.55))',
  gold: 'linear-gradient(160deg,rgba(66,32,6,0.9),rgba(212,175,55,0.55))',
  letter: 'linear-gradient(180deg,rgba(60,40,30,0.75),rgba(232,213,196,0.45))',
  neon: 'linear-gradient(180deg,rgba(5,5,16,0.92),rgba(26,10,46,0.8))',
  unlock: 'linear-gradient(160deg,rgba(10,45,77,0.92),rgba(31,78,121,0.75))',
  diya: 'linear-gradient(180deg,rgba(26,10,0,0.9),rgba(124,45,18,0.7))',
  spark: 'radial-gradient(circle at center,rgba(66,32,6,0.85),rgba(12,10,9,0.95))',
  burst: 'linear-gradient(180deg,rgba(28,25,23,0.88),rgba(127,29,29,0.7))',
  lantern: 'linear-gradient(180deg,rgba(12,20,64,0.9),rgba(30,27,75,0.8))',
  rangoli: 'linear-gradient(160deg,rgba(59,7,100,0.88),rgba(154,52,18,0.65))',
  foil: 'linear-gradient(135deg,rgba(120,53,15,0.85),rgba(251,191,36,0.45))',
  cake: 'linear-gradient(180deg,rgba(30,22,48,0.9),rgba(74,48,96,0.75))',
  party: 'linear-gradient(160deg,rgba(15,118,110,0.88),rgba(19,78,74,0.8))',
  count: 'linear-gradient(180deg,rgba(17,24,39,0.9),rgba(76,29,149,0.75))',
  gift: 'linear-gradient(180deg,rgba(59,29,15,0.9),rgba(124,45,18,0.75))',
  sky: 'radial-gradient(circle at bottom,rgba(26,16,64,0.9),rgba(5,5,16,0.95))',
}
