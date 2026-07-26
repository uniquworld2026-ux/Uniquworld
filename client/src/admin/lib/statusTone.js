export function statusTone(status) {
  const s = String(status || '').toLowerCase()
  if (['active', 'published', 'paid', 'delivered', 'approved', 'completed', 'sent'].includes(s)) {
    return 'success'
  }
  if (['draft', 'pending', 'processing', 'low', 'scheduled', 'open'].includes(s)) {
    return 'warning'
  }
  if (['archived', 'cancelled', 'rejected', 'failed', 'inactive', 'out_of_stock'].includes(s)) {
    return 'danger'
  }
  if (['info', 'shipped', 'new', 'unread'].includes(s)) {
    return 'info'
  }
  return 'default'
}
