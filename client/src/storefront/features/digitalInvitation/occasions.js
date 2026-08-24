export const INVITATION_PRICE_INR = 39

export const invitationOccasions = [
  {
    id: 'wedding',
    slug: 'wedding',
    title: 'Wedding Invitation',
    dateLabel: 'Save the date',
    headline: 'An elegant digital invite for your ceremony — date, venue, and RSVP in one link.',
    blurb: 'Choose a refined template, add couple names & venue details, then share a lifetime private link.',
    image: '/gifts/wedding.jpg',
    accent: '#1a2d4d',
    templates: [
      { id: 'inv-wed-classic', name: 'Classic Scroll', hint: 'Ivory frame · serif names' },
      { id: 'inv-wed-garden', name: 'Garden Bloom', hint: 'Floral border · soft light' },
      { id: 'inv-wed-midnight', name: 'Midnight Gold', hint: 'Deep navy · foil accents' },
      { id: 'inv-wed-mandala', name: 'Mandala Seal', hint: 'Heritage pattern · warm glow' },
    ],
  },
  {
    id: 'birthday_party',
    slug: 'birthday-party',
    title: 'Birthday Party Invite',
    dateLabel: 'Celebrate',
    headline: 'Send a lively party invite with time, place, and a warm personal note.',
    blurb: 'Pick a fun template, add the birthday star & party details, unlock a shareable invite link.',
    image: '/gifts/party.jpg',
    accent: '#0f766e',
    templates: [
      { id: 'inv-bd-confetti', name: 'Confetti Pop', hint: 'Bright burst · bold name' },
      { id: 'inv-bd-balloon', name: 'Balloon Lane', hint: 'Floating balloons · soft sky' },
      { id: 'inv-bd-neon', name: 'Neon Bash', hint: 'Night lights · party energy' },
      { id: 'inv-bd-story', name: 'Story Card', hint: 'Clean invite · clear details' },
    ],
  },
  {
    id: 'housewarming',
    slug: 'housewarming',
    title: 'Housewarming Invite',
    dateLabel: 'New home',
    headline: 'Invite friends and family to your new place — map-ready venue and warm welcome.',
    blurb: 'Home-themed templates with host names, address, and timing in a polished digital card.',
    image: '/gifts/home.jpg',
    accent: '#1f4e3d',
    templates: [
      { id: 'inv-hw-keys', name: 'Keys & Welcome', hint: 'Doorstep moment · soft green' },
      { id: 'inv-hw-hearth', name: 'Hearth Light', hint: 'Warm interior · calm type' },
      { id: 'inv-hw-garden', name: 'Courtyard', hint: 'Outdoor gathering · plants' },
      { id: 'inv-hw-minimal', name: 'Minimal Home', hint: 'Clean lines · easy RSVP' },
    ],
  },
  {
    id: 'baby_shower',
    slug: 'baby-shower',
    title: 'Baby Shower Invite',
    dateLabel: 'Little joy',
    headline: 'A gentle invite for the baby shower — parents’ names, date, and venue in one page.',
    blurb: 'Soft templates with shower details, a short note, and a private lifetime share link.',
    image: '/gifts/baby.jpg',
    accent: '#4a5568',
    templates: [
      { id: 'inv-bs-cloud', name: 'Soft Clouds', hint: 'Airy pastels · gentle type' },
      { id: 'inv-bs-bloom', name: 'Tiny Bloom', hint: 'Floral seal · quiet elegance' },
      { id: 'inv-bs-star', name: 'Little Star', hint: 'Night sky · soft sparkle' },
      { id: 'inv-bs-letter', name: 'Letter Press', hint: 'Paper texture · classic card' },
    ],
  },
]

export const INVITATION_OCCASION_IDS = new Set(invitationOccasions.map((o) => o.id))

export function isInvitationOccasion(id) {
  return INVITATION_OCCASION_IDS.has(id)
}

export function getInvitationBySlug(slug) {
  return invitationOccasions.find((o) => o.slug === slug) || null
}

export function getInvitationById(id) {
  return invitationOccasions.find((o) => o.id === id) || null
}
