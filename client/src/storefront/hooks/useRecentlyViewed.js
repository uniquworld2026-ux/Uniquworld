const KEY = 'hm_recently_viewed'

export function pushRecentlyViewed(productId) {
  if (!productId || typeof window === 'undefined') return
  try {
    const prev = JSON.parse(localStorage.getItem(KEY) || '[]')
    const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function getRecentlyViewedIds() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
