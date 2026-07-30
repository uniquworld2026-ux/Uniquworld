/**
 * Convert Instagram / YouTube / Vimeo / common video URLs into embeddable iframe src.
 */

export function instagramEmbedUrl(raw) {
  if (!raw) return null
  try {
    const u = new URL(raw.trim())
    if (!/instagram\.com$/i.test(u.hostname.replace(/^www\./, '')) && !u.hostname.includes('instagram.com')) {
      return null
    }
    // /p/CODE/ or /reel/CODE/ or /tv/CODE/
    const m = u.pathname.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)
    if (!m) return null
    return `https://www.instagram.com/${m[1]}/${m[2]}/embed`
  } catch {
    return null
  }
}

export function videoEmbedUrl(raw) {
  if (!raw) return null
  try {
    const u = new URL(raw.trim())
    const host = u.hostname.replace(/^www\./, '').toLowerCase()

    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') || u.pathname.match(/\/embed\/([^/]+)/)?.[1] || u.pathname.match(/\/shorts\/([^/]+)/)?.[1]
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
    }
    // Direct mp4 / webm — use as video src (caller handles)
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname)) {
      return { type: 'direct', src: raw.trim() }
    }
    return null
  } catch {
    return null
  }
}

export function resolveMediaEmbeds({ instagramUrl, videoUrl } = {}) {
  const instagram = instagramEmbedUrl(instagramUrl)
  const video = videoEmbedUrl(videoUrl)
  return { instagram, video }
}
