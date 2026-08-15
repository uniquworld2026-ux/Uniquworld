/** Background tracks — pick a preset, paste a YouTube URL, or upload an audio file. */
export const BACKGROUND_TRACKS = [
  { id: 'none', label: 'No music', url: '' },
  {
    id: 'birthday-piano',
    label: 'Happy Birthday · piano',
    url: 'https://www.youtube.com/watch?v=jQP0C5dQf4E',
  },
  {
    id: 'lofi',
    label: 'Soft lofi',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    id: 'peaceful-piano',
    label: 'Peaceful piano',
    url: 'https://www.youtube.com/watch?v=lTRiuFIHJHc',
  },
  {
    id: 'acoustic',
    label: 'Warm acoustic',
    url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
  },
  { id: 'upload', label: 'Upload song…', url: '' },
  { id: 'custom', label: 'YouTube link…', url: '' },
]

export function trackFromUrl(url) {
  if (!url) return BACKGROUND_TRACKS[0]
  const match = BACKGROUND_TRACKS.find((t) => t.url && t.url === url)
  return match || { id: 'custom', label: 'YouTube link…', url }
}
