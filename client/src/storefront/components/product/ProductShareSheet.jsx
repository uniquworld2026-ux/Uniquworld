import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Check,
  Copy,
  Download,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  X,
} from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import {
  buildProductShareText,
  copyText,
  createProductShareCard,
  downloadBlob,
  getSocialShareLinks,
  nativeShare,
} from '@/storefront/lib/productShare'

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.49 0 9.94-4.45 9.94-9.94 0-2.65-1.03-5.14-2.94-7zM12.04 20.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.88 2.4 1 2.56.12.17 1.75 2.67 4.23 3.74 1.78.77 2.13.68 2.52.64.39-.04 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.1-.22-.16-.47-.28z" />
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 8h2.5V4.5H14c-2.48 0-4.5 2.02-4.5 4.5v2H7v3.5h2.5V20H13v-5.5h2.35L16 11H13V9c0-.55.45-1 1-1Z" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 3h2.8l-6.1 7 7.2 11h-5.6l-4.4-6.7L6 21H3.2l6.5-7.4L3 3h5.8l4 6.1L17.5 3Zm-1 16.2h1.6L7.6 4.7H6L16.5 19.2Z" />
    </svg>
  )
}

function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.9 4.3 2.8 11.7c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.7.4.9 1 .9.5 0 .8-.2 1.1-.5l2.7-2.6 5.6 4.1c1 .6 1.8.3 2.1-.9l3.7-17.4c.4-1.5-.5-2.2-1.7-1.8ZM8.8 14.6l9.8-6.2c.5-.3.9-.1.5.2l-7.9 7.1-.3 3.4-2.1-4.5Z" />
    </svg>
  )
}

/**
 * Product share sheet — preview card + social / message / copy / download.
 *
 * @param {{
 *   open: boolean
 *   onClose: () => void
 *   product: {
 *     id?: string | number
 *     name: string
 *     price: number
 *     compareAt?: number
 *     offerPercent?: number
 *     image?: string
 *     images?: string[]
 *     description?: string
 *   }
 * }} props
 */
export function ProductShareSheet({ open, onClose, product }) {
  const [cardUrl, setCardUrl] = useState('')
  const [cardBlob, setCardBlob] = useState(null)
  const [cardFile, setCardFile] = useState(null)
  const [building, setBuilding] = useState(false)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)

  const imageUrl = product?.images?.[0] || product?.image || ''
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const shareText = useMemo(
    () =>
      product
        ? buildProductShareText({
            name: product.name,
            price: product.price,
            compareAt: product.compareAt,
            offerPercent: product.offerPercent,
            url,
            imageUrl,
            description: product.description,
          })
        : '',
    [product, url, imageUrl],
  )

  const links = useMemo(() => getSocialShareLinks(url, shareText, product?.name), [url, shareText, product?.name])

  useEffect(() => {
    if (!open || !product) return undefined
    let cancelled = false
    setBuilding(true)
    setStatus('')
    setCopied(false)
    setCardUrl('')
    setCardBlob(null)
    setCardFile(null)

    createProductShareCard({
      name: product.name,
      price: product.price,
      compareAt: product.compareAt,
      offerPercent: product.offerPercent,
      imageUrl,
      url,
    })
      .then((card) => {
        if (cancelled) return
        setCardUrl(card.dataUrl)
        setCardBlob(card.blob)
        setCardFile(card.file)
      })
      .catch(() => {
        if (!cancelled) setStatus('Preview ready — image card unavailable for this photo.')
      })
      .finally(() => {
        if (!cancelled) setBuilding(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, product, imageUrl, url])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !product) return null

  const channels = [
    { id: 'whatsapp', label: 'WhatsApp', href: links.whatsapp, Icon: WhatsAppIcon, tone: 'bg-[#25D366] text-white', prefersImage: true },
    { id: 'facebook', label: 'Facebook', href: links.facebook, Icon: FacebookIcon, tone: 'bg-[#1877F2] text-white' },
    { id: 'twitter', label: 'X', href: links.twitter, Icon: XIcon, tone: 'bg-hm-text text-white' },
    { id: 'telegram', label: 'Telegram', href: links.telegram, Icon: TelegramIcon, tone: 'bg-[#229ED9] text-white', prefersImage: true },
    { id: 'sms', label: 'Message', href: links.sms, Icon: MessageCircle, tone: 'bg-hm-primary text-white' },
    { id: 'email', label: 'Email', href: links.email, Icon: Mail, tone: 'bg-hm-muted text-hm-text' },
  ]

  async function handleCopy() {
    try {
      await copyText(shareText)
      setCopied(true)
      setStatus('Message copied — paste it anywhere.')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setStatus('Could not copy. Select the message below instead.')
    }
  }

  async function handleCopyLink() {
    try {
      await copyText(url)
      setStatus('Link copied.')
    } catch {
      setStatus('Could not copy link.')
    }
  }

  async function handleNativeShare() {
    try {
      const data = {
        title: product.name,
        text: shareText,
        url,
        ...(cardFile ? { files: [cardFile] } : {}),
      }
      const shared = await nativeShare(data)
      if (shared) {
        setStatus('Shared.')
        onClose?.()
      }
    } catch {
      setStatus('Share not available — use an app below or copy the message.')
    }
  }

  /**
   * WhatsApp / Telegram: share product image + text (price + pay link) when possible;
   * otherwise open the app with photo URL, price, and buy link in the message.
   */
  async function handleChannelClick(channel, event) {
    if (!channel.prefersImage) return
    event.preventDefault()

    if (
      cardFile &&
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      (!navigator.canShare || navigator.canShare({ files: [cardFile] }))
    ) {
      try {
        await navigator.share({
          files: [cardFile],
          title: product.name,
          text: shareText,
        })
        setStatus(
          channel.id === 'whatsapp'
            ? 'Pick WhatsApp to send image, price & pay link.'
            : 'Shared.',
        )
        onClose?.()
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }

    window.open(
      channel.href,
      channel.id === 'email' || channel.id === 'sms' ? '_self' : '_blank',
      'noopener,noreferrer',
    )
    setStatus(
      channel.id === 'whatsapp'
        ? 'WhatsApp opened with product photo, price, and pay link.'
        : 'Opened with product details and pay link.',
    )
  }

  function handleDownload() {
    if (!cardBlob) {
      setStatus('Share image is still preparing.')
      return
    }
    downloadBlob(cardBlob, `${String(product.name || 'uniquworld').replace(/\s+/g, '-').slice(0, 40)}.png`)
    setStatus('Image downloaded.')
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close share"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share product"
        className="relative z-10 flex max-h-[min(94svh,720px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-hm-border bg-hm-elevated shadow-hm-elevated sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-hm-border px-5 py-3.5">
          <div>
            <h2 className="text-base font-semibold text-hm-text">Share gift</h2>
            <p className="text-xs text-hm-text-muted">Image · price · pay link for any app</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-hm-text-muted hover:bg-hm-muted hover:text-hm-text"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {/* Live product preview */}
          <div className="overflow-hidden rounded-2xl border border-hm-border bg-gradient-to-br from-hm-bg via-hm-elevated to-hm-muted/40">
            <div className="flex gap-3 p-3">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-hm-muted">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-hm-text">
                  {product.name}
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-bold text-hm-accent">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAt && product.compareAt > product.price ? (
                    <span className="text-xs text-hm-text-muted line-through">
                      {formatCurrency(product.compareAt)}
                    </span>
                  ) : null}
                  {product.offerPercent ? (
                    <span className="rounded-full bg-hm-accent/10 px-2 py-0.5 text-[10px] font-semibold text-hm-accent">
                      {Math.round(product.offerPercent)}% off
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Generated share card */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-hm-text-muted">
              Share image
            </p>
            <div className="overflow-hidden rounded-2xl border border-hm-border bg-hm-bg">
              {building ? (
                <div className="flex aspect-[4/5] items-center justify-center text-sm text-hm-text-muted">
                  Creating share card…
                </div>
              ) : cardUrl ? (
                <img src={cardUrl} alt="Share preview" className="w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-hm-text-muted">
                  <Share2 className="h-6 w-6 opacity-40" />
                  Product preview above is ready to share as text.
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-hm-text-muted">
                Message
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-medium text-hm-accent hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="max-h-28 overflow-y-auto whitespace-pre-wrap rounded-xl border border-hm-border bg-hm-bg px-3 py-2.5 font-sans text-xs leading-relaxed text-hm-text">
              {shareText}
            </pre>
          </div>

          {/* Social grid */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-hm-text-muted">
              Share to
            </p>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {channels.map((channel) => {
                const { id, label, href, Icon, tone, prefersImage } = channel
                return (
                  <a
                    key={id}
                    href={href}
                    target={id === 'email' || id === 'sms' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    onClick={prefersImage ? (e) => handleChannelClick(channel, e) : undefined}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-hm-border bg-hm-bg px-2 py-3 text-center transition hover:border-hm-accent/40 hover:bg-hm-muted/50"
                  >
                    <span
                      className={cn(
                        'inline-flex h-11 w-11 items-center justify-center rounded-full',
                        tone,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-medium text-hm-text">{label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {status ? (
            <p className="rounded-lg bg-hm-muted/60 px-3 py-2 text-xs text-hm-text-muted" role="status">
              {status}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="outline" size="sm" className="h-11" onClick={handleCopyLink}>
              <Link2 className="h-4 w-4" />
              Copy link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-11"
              onClick={handleDownload}
              disabled={!cardBlob}
            >
              <Download className="h-4 w-4" />
              Save image
            </Button>
          </div>

          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
            <Button variant="primary" size="lg" className="w-full" onClick={handleNativeShare}>
              <Share2 className="h-4 w-4" />
              Share via device
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="w-full" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              Copy share message
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
