import { formatCurrency } from '@/shared/lib/utils'
import { BRAND_LOGO_SRC } from '@/storefront/components/brand/BrandLogo'

const CARD_W = 1080
const CARD_H = 1350

/**
 * @param {{
 *   name: string
 *   price: number
 *   compareAt?: number
 *   offerPercent?: number
 *   url: string
 *   brand?: string
 * }} opts
 */
export function buildProductShareText({
  name,
  price,
  compareAt,
  offerPercent,
  url,
  brand = 'Uniquworld',
}) {
  const priceLine = formatCurrency(price)
  const extras = []
  if (compareAt && compareAt > price) extras.push(`was ${formatCurrency(compareAt)}`)
  if (offerPercent) extras.push(`${offerPercent}% off`)
  const priceBlock = extras.length ? `${priceLine} (${extras.join(' · ')})` : priceLine

  return [
    `🎁 Check out this gift on ${brand}!`,
    '',
    name,
    priceBlock,
    '',
    url,
  ].join('\n')
}

/**
 * @param {string} url
 * @param {string} text
 * @param {string} [title]
 */
export function getSocialShareLinks(url, text, title = 'Uniquworld') {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text)
  const subject = encodeURIComponent(`${title} — gift find`)

  return {
    whatsapp: `https://wa.me/?text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.split('\n')[0] || title)}&url=${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${encodeURIComponent(text.split('\n').slice(0, 4).join('\n'))}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    email: `mailto:?subject=${subject}&body=${t}`,
    sms: `sms:?body=${t}`,
  }
}

function loadImage(src, { crossOrigin = true } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawCoverImage(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

/**
 * Build a branded share card (PNG blob) with product image, name, and price.
 * Falls back to a text-only card if the product image cannot be drawn (CORS).
 *
 * @param {{
 *   name: string
 *   price: number
 *   compareAt?: number
 *   offerPercent?: number
 *   imageUrl?: string
 *   url?: string
 * }} product
 * @returns {Promise<{ blob: Blob, dataUrl: string, file: File }>}
 */
export async function createProductShareCard(product) {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create share card')

  // Background
  const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  bg.addColorStop(0, '#f8fafc')
  bg.addColorStop(0.45, '#ffffff')
  bg.addColorStop(1, '#eef4f9')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  // Accent bar
  ctx.fillStyle = '#d92c2b'
  ctx.fillRect(0, 0, CARD_W, 14)

  // Soft glow accents
  ctx.fillStyle = 'rgba(217, 44, 43, 0.06)'
  ctx.beginPath()
  ctx.arc(140, 180, 220, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(10, 45, 77, 0.06)'
  ctx.beginPath()
  ctx.arc(940, 1180, 260, 0, Math.PI * 2)
  ctx.fill()

  // Brand logo
  try {
    const logo = await loadImage(BRAND_LOGO_SRC, { crossOrigin: true })
    const logoH = 64
    const logoW = (logo.width / logo.height) * logoH
    ctx.drawImage(logo, 72, 48, logoW, logoH)
  } catch {
    ctx.fillStyle = '#0a2d4d'
    ctx.font = '700 42px Georgia, serif'
    ctx.fillText('Uniquworld', 72, 96)
  }

  // Product image panel
  const panelX = 72
  const panelY = 150
  const panelW = CARD_W - 144
  const panelH = 720
  roundRect(ctx, panelX, panelY, panelW, panelH, 36)
  ctx.fillStyle = '#e8eef4'
  ctx.fill()

  let drewProduct = false
  if (product.imageUrl) {
    try {
      const img = await loadImage(product.imageUrl, { crossOrigin: true })
      roundRect(ctx, panelX, panelY, panelW, panelH, 36)
      ctx.save()
      ctx.clip()
      drawCoverImage(ctx, img, panelX, panelY, panelW, panelH)
      ctx.restore()
      drewProduct = true
    } catch {
      drewProduct = false
    }
  }

  if (!drewProduct) {
    ctx.fillStyle = '#0a2d4d'
    ctx.font = '600 48px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Uniquworld Gift', CARD_W / 2, panelY + panelH / 2)
    ctx.textAlign = 'start'
  }

  // Offer badge
  if (product.offerPercent) {
    const badge = `${Math.round(product.offerPercent)}% OFF`
    ctx.font = '700 28px system-ui, sans-serif'
    const tw = ctx.measureText(badge).width
    const bx = panelX + panelW - tw - 56
    const by = panelY + 28
    roundRect(ctx, bx, by, tw + 36, 52, 26)
    ctx.fillStyle = '#d92c2b'
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(badge, bx + 18, by + 36)
  }

  // Product name
  ctx.fillStyle = '#0a2d4d'
  ctx.font = '700 52px Georgia, serif'
  const nameLines = wrapText(ctx, product.name, CARD_W - 160).slice(0, 2)
  let ty = panelY + panelH + 80
  nameLines.forEach((line, i) => {
    ctx.fillText(line, 72, ty + i * 62)
  })
  ty += nameLines.length * 62 + 28

  // Price
  ctx.font = '700 56px system-ui, sans-serif'
  ctx.fillStyle = '#d92c2b'
  const priceText = formatCurrency(product.price)
  ctx.fillText(priceText, 72, ty)

  if (product.compareAt && product.compareAt > product.price) {
    const priceW = ctx.measureText(priceText).width
    ctx.font = '500 34px system-ui, sans-serif'
    ctx.fillStyle = '#64748b'
    const compare = formatCurrency(product.compareAt)
    ctx.fillText(compare, 72 + priceW + 24, ty)
    const cw = ctx.measureText(compare).width
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(72 + priceW + 24, ty - 12)
    ctx.lineTo(72 + priceW + 24 + cw, ty - 12)
    ctx.stroke()
  }

  // Footer strip
  ctx.fillStyle = '#0a2d4d'
  roundRect(ctx, 72, CARD_H - 130, CARD_W - 144, 70, 20)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 28px system-ui, sans-serif'
  ctx.fillText('Shop now on Uniquworld', 100, CARD_H - 84)

  const dataUrl = canvas.toDataURL('image/png')
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not export share image'))),
      'image/png',
    )
  })
  const file = new File([blob], `uniquworld-${Date.now()}.png`, { type: 'image/png' })
  return { blob, dataUrl, file }
}

/**
 * @param {ShareData} data
 */
export async function nativeShare(data) {
  if (!navigator.share) return false
  try {
    if (data.files?.length && navigator.canShare && !navigator.canShare({ files: data.files })) {
      const { files: _f, ...rest } = data
      await navigator.share(rest)
      return true
    }
    await navigator.share(data)
    return true
  } catch (err) {
    if (err?.name === 'AbortError') return false
    throw err
  }
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
