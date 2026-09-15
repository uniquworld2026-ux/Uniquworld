/**
 * Auto-play demo slides for digital invitations.
 * /surprise/invitation/:slug/demo?name=Asha&from=Rahul
 */

export function buildInvitationDemoSlides({
  occasionId,
  name = 'You',
  sender = 'The hosts',
  eventDate = '',
  eventTime = '',
  venue = '',
}) {
  const n = (name || 'You').trim() || 'You'
  const from = (sender || 'The hosts').trim() || 'The hosts'
  const when = [eventDate, eventTime].filter(Boolean).join(' · ') || 'Date coming soon'
  const where = (venue || '').trim() || 'Venue to be shared'

  if (occasionId === 'wedding') {
    return [
      { emoji: '💍', title: 'You’re invited', body: 'A celebration of love is being planned — just for the people who matter.', image: '/gifts/wedding.jpg', tone: 'wed', effect: 'kenburns' },
      { emoji: '✨', title: n, body: 'Together with their families, they request the honour of your presence.', image: '/gifts/flowers.jpg', tone: 'bloom', effect: 'float' },
      { emoji: '📅', title: 'Save the date', body: when, image: '/gifts/anniversary.jpg', tone: 'gold', effect: 'pulse' },
      { emoji: '📍', title: 'Join us at', body: where, image: '/gifts/decor.jpg', tone: 'venue', effect: 'kenburns' },
      { emoji: '🕊️', title: 'With love', body: `From ${from} — we can’t wait to celebrate with you.`, image: '/gifts/thankyou.jpg', tone: 'letter', effect: 'float' },
      { emoji: '🔓', title: 'Unlock your invitation', body: 'Pay ₹39 for a private digital invite link that never expires.', image: '/gifts/hamper.jpg', tone: 'unlock', effect: 'confetti' },
    ]
  }

  if (occasionId === 'housewarming') {
    return [
      { emoji: '🏠', title: 'New keys, open doors', body: 'You’re invited to a housewarming — come see the new place.', image: '/gifts/home.jpg', tone: 'home', effect: 'kenburns' },
      { emoji: '🌿', title: `Dear ${n}`, body: 'Help us fill these rooms with laughter, stories, and good food.', image: '/gifts/plant.jpg', tone: 'garden', effect: 'float' },
      { emoji: '📅', title: 'When', body: when, image: '/gifts/decor.jpg', tone: 'home', effect: 'pulse' },
      { emoji: '📍', title: 'Where', body: where, image: '/gifts/shopping.jpg', tone: 'venue', effect: 'kenburns' },
      { emoji: '🪴', title: 'From the hosts', body: `With warm wishes — ${from}`, image: '/gifts/thankyou.jpg', tone: 'letter', effect: 'float' },
      { emoji: '🔓', title: 'Unlock invitation', body: '₹39 · private share link · lifetime access.', image: '/gifts/hamper.jpg', tone: 'unlock', effect: 'confetti' },
    ]
  }

  if (occasionId === 'baby_shower') {
    return [
      { emoji: '👶', title: 'A little one is on the way', body: 'You’re invited to a baby shower filled with soft joy.', image: '/gifts/baby.jpg', tone: 'baby', effect: 'float' },
      { emoji: '☁️', title: `Hi ${n}`, body: 'Come celebrate the parents-to-be with gifts, games, and gentle wishes.', image: '/gifts/kids.jpg', tone: 'cloud', effect: 'kenburns' },
      { emoji: '📅', title: 'Shower details', body: when, image: '/gifts/celebration.jpg', tone: 'baby', effect: 'pulse' },
      { emoji: '📍', title: 'Venue', body: where, image: '/gifts/home.jpg', tone: 'venue', effect: 'kenburns' },
      { emoji: '💛', title: 'With love', body: `Hosted by ${from}`, image: '/gifts/thankyou.jpg', tone: 'letter', effect: 'float' },
      { emoji: '🔓', title: 'Unlock invitation', body: '₹39 for a private baby shower invite that stays live forever.', image: '/gifts/hamper.jpg', tone: 'unlock', effect: 'confetti' },
    ]
  }

  // birthday_party default
  return [
    { emoji: '🎉', title: 'Party time!', body: 'You’re on the list — a birthday celebration is calling.', image: '/gifts/party.jpg', tone: 'party', effect: 'confetti' },
    { emoji: '🎂', title: `Hey ${n}`, body: 'Come celebrate with cake, music, and good company.', image: '/gifts/cake.jpg', tone: 'cake', effect: 'pulse' },
    { emoji: '📅', title: 'When', body: when, image: '/gifts/birthday.jpg', tone: 'party', effect: 'kenburns' },
    { emoji: '📍', title: 'Where', body: where, image: '/gifts/celebration.jpg', tone: 'venue', effect: 'float' },
    { emoji: '🎈', title: 'Hosted by', body: from, image: '/gifts/gift-red.jpg', tone: 'gift', effect: 'pulse' },
    { emoji: '🔓', title: 'Unlock invitation', body: 'Pay ₹39 for a private party invite link that never expires.', image: '/gifts/hamper.jpg', tone: 'unlock', effect: 'confetti' },
  ]
}

export const INVITATION_DEMO_TONES = {
  wed: 'linear-gradient(160deg,rgba(26,45,77,0.92),rgba(120,53,15,0.45))',
  bloom: 'linear-gradient(180deg,rgba(74,16,32,0.88),rgba(249,168,212,0.4))',
  gold: 'linear-gradient(160deg,rgba(66,32,6,0.9),rgba(212,175,55,0.5))',
  venue: 'linear-gradient(180deg,rgba(17,24,39,0.9),rgba(55,65,81,0.75))',
  letter: 'linear-gradient(180deg,rgba(60,40,30,0.8),rgba(232,213,196,0.4))',
  unlock: 'linear-gradient(160deg,rgba(10,45,77,0.92),rgba(31,78,121,0.75))',
  home: 'linear-gradient(180deg,rgba(20,50,40,0.92),rgba(34,80,60,0.7))',
  garden: 'linear-gradient(160deg,rgba(22,60,40,0.9),rgba(74,120,80,0.5))',
  baby: 'linear-gradient(180deg,rgba(55,65,81,0.9),rgba(148,163,184,0.45))',
  cloud: 'linear-gradient(180deg,rgba(71,85,105,0.88),rgba(226,232,240,0.35))',
  party: 'linear-gradient(160deg,rgba(15,118,110,0.9),rgba(19,78,74,0.8))',
  cake: 'linear-gradient(180deg,rgba(30,22,48,0.9),rgba(74,48,96,0.7))',
  gift: 'linear-gradient(180deg,rgba(59,29,15,0.9),rgba(124,45,18,0.7))',
}
