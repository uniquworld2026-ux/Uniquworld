/** Auto-play demo story pages (8–12) per occasion — emoji + surprise UI copy */

export function buildDemoSlides({ occasionId, name = 'You', sender = 'Someone special' }) {
  const n = name.trim() || 'You'
  const from = sender.trim() || 'Someone special'

  if (occasionId === 'girlfriends_day') {
    return [
      { emoji: '💖', title: 'Hey…', body: 'This little surprise is only for you.', tone: 'rose' },
      { emoji: '🌹', title: `Hi ${n}`, body: 'National Girlfriends Day is here — and you deserve blooms.', tone: 'bloom' },
      { emoji: '✨', title: 'You make days brighter', body: 'Ordinary moments feel magical with you.', tone: 'gold' },
      { emoji: '💌', title: 'A soft secret', body: 'Someone wanted you to feel celebrated today.', tone: 'letter' },
      { emoji: '🌸', title: 'Petals for you', body: 'Imagine a whole garden opening just for your smile.', tone: 'bloom' },
      { emoji: '🥰', title: 'You are loved', body: 'Not for a day — for every little laugh you share.', tone: 'rose' },
      { emoji: '🎀', title: 'Pretty reminder', body: 'You are thoughtful, brave, and wonderfully you.', tone: 'candy' },
      { emoji: '🌙', title: 'Under soft lights', body: 'A neon night wish written with your name.', tone: 'neon' },
      { emoji: '🫶', title: 'From the heart', body: `${from} made this just for ${n}.`, tone: 'rose' },
      { emoji: '💐', title: 'Almost unlocked', body: 'Preview ends soon — unlock the full page to share.', tone: 'gold' },
      { emoji: '🔓', title: 'Pay · create link', body: '₹49 unlocks a private 30-day surprise link.', tone: 'unlock' },
    ]
  }

  if (occasionId === 'diwali') {
    return [
      { emoji: '🪔', title: 'Shubh Diwali', body: 'A festival of lights is waiting for you…', tone: 'diya' },
      { emoji: '✨', title: `Namaste ${n}`, body: 'May your path glow brighter than sparklers.', tone: 'spark' },
      { emoji: '🎆', title: 'Crackers in the sky', body: 'Joy bursts, colours dance, wishes rise.', tone: 'burst' },
      { emoji: '🏮', title: 'Lanterns rising', body: 'One light for hope. One for love. One for you.', tone: 'lantern' },
      { emoji: '🔶', title: 'Rangoli bloom', body: 'Patterns unfold — luck, laughter, togetherness.', tone: 'rangoli' },
      { emoji: '🙏', title: 'Warm wishes', body: 'May sweet moments fill your home this season.', tone: 'foil' },
      { emoji: '💫', title: 'Golden foil', body: 'A shimmer card sealed with your name.', tone: 'foil' },
      { emoji: '🔔', title: 'Temple bells', body: 'Hear the soft chime of celebration.', tone: 'bells' },
      { emoji: '💛', title: `For ${n}`, body: `Crafted with care by ${from}.`, tone: 'diya' },
      { emoji: '🎁', title: 'Your surprise page', body: 'Interactive lights, motion, and a shareable link.', tone: 'spark' },
      { emoji: '🔓', title: 'Unlock now', body: 'Pay ₹49 · private link · expires in 30 days.', tone: 'unlock' },
    ]
  }

  // birthday (default)
  return [
    { emoji: '🎂', title: 'Psst…', body: 'A birthday surprise is loading…', tone: 'cake' },
    { emoji: '🎈', title: `Happy Birthday ${n}!`, body: 'Balloons up. Confetti ready. You ready?', tone: 'party' },
    { emoji: '3️⃣', title: 'Three…', body: 'Something wonderful is about to happen.', tone: 'count' },
    { emoji: '2️⃣', title: 'Two…', body: 'Hold that smile.', tone: 'count' },
    { emoji: '1️⃣', title: 'One…', body: 'Here we go!', tone: 'count' },
    { emoji: '🎉', title: 'Surprise!', body: 'Today the spotlight is all yours.', tone: 'burst' },
    { emoji: '🎁', title: 'Unwrap the joy', body: 'Gifts, giggles, and good vibes incoming.', tone: 'gift' },
    { emoji: '🌟', title: 'Name in the sky', body: `${n} — written in lights and laughter.`, tone: 'sky' },
    { emoji: '🎤', title: 'Sing it loud', body: 'Happy birthday to you… ♪', tone: 'song' },
    { emoji: '💝', title: 'From someone who cares', body: `${from} wanted this moment to feel special.`, tone: 'love' },
    { emoji: '🚀', title: 'Orbit of wishes', body: 'Cake · Gift · Joy · Love — spinning just for you.', tone: 'orbit' },
    { emoji: '🔓', title: 'Unlock your page', body: 'Pay ₹49 for a private interactive link (30 days).', tone: 'unlock' },
  ]
}

export const DEMO_TONE_STYLES = {
  rose: 'linear-gradient(160deg,#4a1020,#a61d3a 50%,#f07170)',
  bloom: 'linear-gradient(180deg,#5b2140,#f9a8d4)',
  gold: 'linear-gradient(160deg,#422006,#d4af37)',
  letter: 'linear-gradient(180deg,#f7efe6,#e8d5c4)',
  candy: 'linear-gradient(180deg,#ffe4ec,#ffb7c5)',
  neon: 'linear-gradient(180deg,#050510,#1a0a2e)',
  unlock: 'linear-gradient(160deg,#0a2d4d,#1f4e79)',
  diya: 'linear-gradient(180deg,#1a0a00,#7c2d12)',
  spark: 'radial-gradient(circle at center,#422006,#0c0a09)',
  burst: 'linear-gradient(180deg,#1c1917,#7f1d1d)',
  lantern: 'linear-gradient(180deg,#0c1440,#1e1b4b)',
  rangoli: 'linear-gradient(160deg,#3b0764,#9a3412)',
  foil: 'linear-gradient(135deg,#78350f,#fbbf24 50%,#78350f)',
  bells: 'linear-gradient(180deg,#1e1b4b,#312e81)',
  cake: 'linear-gradient(180deg,#1e1630,#4a3060)',
  party: 'linear-gradient(160deg,#0f766e,#134e4a)',
  count: 'linear-gradient(180deg,#111827,#4c1d95)',
  gift: 'linear-gradient(180deg,#3b1d0f,#7c2d12)',
  sky: 'radial-gradient(circle at bottom,#1a1040,#050510)',
  song: 'linear-gradient(180deg,#0c0a14,#2d1b3d)',
  love: 'radial-gradient(circle at center,#831843,#1f0612 70%)',
  orbit: 'radial-gradient(circle at 50% 40%,#312e81,#0f172a 65%)',
}
