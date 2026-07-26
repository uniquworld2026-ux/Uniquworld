/**
 * Local surprise venues — Chennai only.
 * Coordinates are real landmark positions for Google Maps search / embed.
 */

export const CHENNAI_CITY = {
  name: 'Chennai',
  state: 'Tamil Nadu',
  lat: 13.0827,
  lng: 80.2707,
  zoom: 11,
}

/** @param {{ lat: number, lng: number, name?: string }} place */
export function googleMapsSearchUrl({ lat, lng, name }) {
  const query = name
    ? encodeURIComponent(`${name}, Chennai, Tamil Nadu`)
    : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

/** @param {{ lat: number, lng: number, zoom?: number }} place */
export function googleMapsEmbedUrl({ lat, lng, zoom = 15 }) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
}

export const chennaiSurpriseLocations = [
  {
    id: 'marina-beach',
    name: 'Marina Beach',
    area: 'Triplicane',
    category: 'Beach sunset',
    address: 'Marina Beach Road, Triplicane, Chennai, Tamil Nadu 600005',
    lat: 13.0541,
    lng: 80.2837,
    rating: 4.8,
    bestFor: ['Sunset proposal', 'Flower walk', 'Surprise picnic'],
    blurb: 'India’s iconic urban beach — golden-hour walks and open-air proposals by the Bay of Bengal.',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'elliots-beach',
    name: "Elliot's Beach",
    area: 'Besant Nagar',
    category: 'Beach promenade',
    address: "Elliot's Beach, Besant Nagar, Chennai, Tamil Nadu 600090",
    lat: 12.9992,
    lng: 80.2719,
    rating: 4.7,
    bestFor: ['Candlelight setup', 'Quiet proposal', 'Evening stroll'],
    blurb: 'Calmer than Marina — promenade vibes, Karl Schmidt Memorial, and café pockets nearby.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'broken-bridge',
    name: 'Broken Bridge',
    area: 'Adyar',
    category: 'Scenic viewpoint',
    address: 'Broken Bridge, Srinivasapuram, Adyar, Chennai, Tamil Nadu 600028',
    lat: 13.0063,
    lng: 80.2763,
    rating: 4.6,
    bestFor: ['Photo surprise', 'Proposal backdrop', 'Sunrise moment'],
    blurb: 'Dramatic estuary views where Adyar meets the sea — a favourite for candid surprise shoots.',
    image:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'semmozhi-poonga',
    name: 'Semmozhi Poonga',
    area: 'Teynampet',
    category: 'Botanical garden',
    address: 'Cathedral Road, Teynampet, Chennai, Tamil Nadu 600006',
    lat: 13.0505,
    lng: 80.2514,
    rating: 4.5,
    bestFor: ['Garden décor', 'Day proposal', 'Photo walk'],
    blurb: 'Lush botanical garden in the city — trails, lawns, and soft light for intimate setups.',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'anna-nagar-tower-park',
    name: 'Anna Nagar Tower Park',
    area: 'Anna Nagar',
    category: 'City park',
    address: 'Tower Park, Anna Nagar, Chennai, Tamil Nadu 600040',
    lat: 13.085,
    lng: 80.2101,
    rating: 4.4,
    bestFor: ['Family surprise', 'Balloon décor', 'Evening meetup'],
    blurb: 'Central green space with the iconic tower — easy access for décor and group surprises.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'guindy-national-park',
    name: 'Guindy National Park',
    area: 'Guindy',
    category: 'Nature reserve',
    address: 'Guindy National Park, Guindy, Chennai, Tamil Nadu 600032',
    lat: 13.0067,
    lng: 80.2206,
    rating: 4.5,
    bestFor: ['Nature walk', 'Quiet proposal', 'Wildlife photo gift'],
    blurb: 'One of India’s rare city national parks — shade, deer trails, and a peaceful surprise setting.',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mylapore',
    name: 'Mylapore Kapaleeshwarar Temple Area',
    area: 'Mylapore',
    category: 'Heritage street',
    address: 'Kapaleeshwarar Temple, Mylapore, Chennai, Tamil Nadu 600004',
    lat: 13.0339,
    lng: 80.2695,
    rating: 4.7,
    bestFor: ['Cultural surprise', 'Temple visit gift', 'Heritage walk'],
    blurb: 'Temple tanks, kolam streets, and classic Chennai charm — ideal for meaningful local surprises.',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'express-avenue',
    name: 'Express Avenue',
    area: 'Royapettah',
    category: 'Mall meetup',
    address: 'Express Avenue, Whites Road, Royapettah, Chennai, Tamil Nadu 600014',
    lat: 13.0587,
    lng: 80.2642,
    rating: 4.3,
    bestFor: ['Gift reveal', 'Indoor décor', 'Rainy-day surprise'],
    blurb: 'Central mall hub for gift handovers, indoor setups, and climate-proof surprise moments.',
    image:
      'https://images.unsplash.com/photo-1519567241048-7dcaafdbf586?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'phoenix-marketcity',
    name: 'Phoenix Marketcity',
    area: 'Velachery',
    category: 'Mall meetup',
    address: 'Phoenix Marketcity, Velachery Road, Chennai, Tamil Nadu 600042',
    lat: 12.9915,
    lng: 80.217,
    rating: 4.4,
    bestFor: ['Shopping surprise', 'Food court reveal', 'Group celebration'],
    blurb: 'South Chennai’s go-to lifestyle mall — easy parking and plenty of reveal spots.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'leela-palace',
    name: 'The Leela Palace Chennai',
    area: 'MRC Nagar',
    category: 'Fine dining',
    address: 'The Leela Palace, MRC Nagar, Raja Annamalai Puram, Chennai, Tamil Nadu 600028',
    lat: 13.0108,
    lng: 80.2519,
    rating: 4.8,
    bestFor: ['Candlelight dinner', 'Anniversary', 'Luxury proposal'],
    blurb: 'Sea-facing luxury hotel — private dining and polished setups for premium surprises.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'chetpet-eco-park',
    name: 'Chetpet Eco Park',
    area: 'Chetpet',
    category: 'Lake park',
    address: 'Chetpet Eco Park, Chetpet, Chennai, Tamil Nadu 600031',
    lat: 13.0735,
    lng: 80.242,
    rating: 4.4,
    bestFor: ['Lake walk', 'Family surprise', 'Morning décor'],
    blurb: 'Lakeside trails and open lawns — a calm mid-city canvas for décor and meetups.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cholamandal',
    name: "Cholamandal Artists' Village",
    area: 'Injambakkam',
    category: 'Art village',
    address: "Cholamandal Artists' Village, Injambakkam, Chennai, Tamil Nadu 600115",
    lat: 12.9895,
    lng: 80.2525,
    rating: 4.6,
    bestFor: ['Art surprise', 'Creative proposal', 'Gallery walk'],
    blurb: 'Artist colony on ECR — sculptures, studios, and a unique backdrop for creative surprises.',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
  },
]

export const chennaiLocationAreas = [
  'All areas',
  ...Array.from(new Set(chennaiSurpriseLocations.map((l) => l.area))).sort(),
]

export const chennaiLocationCategories = [
  'All types',
  ...Array.from(new Set(chennaiSurpriseLocations.map((l) => l.category))).sort(),
]
