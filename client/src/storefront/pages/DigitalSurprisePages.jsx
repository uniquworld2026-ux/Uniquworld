import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'
import { Reveal } from '@/storefront/components/ui/Reveal'
import { SectionHeading } from '@/storefront/components/ui/SectionHeading'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatINR, loadRazorpay } from '@/storefront/lib/commerce'
import {
  DIGITAL_PRICE_INR,
  digitalOccasions,
  getOccasionBySlug,
} from '@/storefront/features/digitalSurprise/occasions'
import { digitalSurpriseApi } from '@/storefront/features/digitalSurprise/api'
import { DigitalSurpriseExperience } from '@/storefront/features/digitalSurprise/DigitalSurpriseExperience'
import { cn } from '@/shared/utils/cn'

const PREVIEW_KEY = (occasionId) => `uw_ds_preview_once_${occasionId}`

function hasUsedPreview(occasionId) {
  try {
    return localStorage.getItem(PREVIEW_KEY(occasionId)) === '1'
  } catch {
    return false
  }
}

function markPreviewUsed(occasionId) {
  try {
    localStorage.setItem(PREVIEW_KEY(occasionId), '1')
  } catch {
    /* ignore */
  }
}

export function DigitalSurprisePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-hm-border bg-[#1a0f14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,44,43,0.35),transparent_50%)]" />
        <Container className="relative py-14 sm:py-18 md:py-20">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Digital Surprise · ₹{DIGITAL_PRICE_INR}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
            Interactive surprise websites
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Pick an occasion, preview once, personalise with their name + Insta/video, then unlock a
            private share link for 30 days.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Choose a card"
              title="Three occasions · unique interactive pages"
              description="Girlfriends Day, Birthday (13 styles), and Diwali — pick a template, preview once, unlock for ₹49."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {digitalOccasions.map((occ, i) => (
              <Reveal key={occ.id} delay={i * 0.08}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated transition hover:border-hm-accent/40">
                  <Link to={`/surprise/digital/${occ.slug}`} className="block overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={occ.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-accent">
                      {occ.dateLabel}
                    </p>
                    <Link to={`/surprise/digital/${occ.slug}`}>
                      <h2 className="mt-1 font-display text-2xl text-hm-text transition group-hover:text-hm-primary">
                        {occ.title}
                      </h2>
                    </Link>
                    <p className="mt-2 flex-1 text-sm text-hm-text-muted">{occ.headline}</p>
                    <p className="mt-3 text-xs text-hm-text-subtle">
                      {occ.templates.length} unique templates · 30-day private link
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link to={`/surprise/digital/${occ.slug}/demo`} className="block">
                        <Button type="button" variant="outline" className="w-full text-sm">
                          Watch demo
                        </Button>
                      </Link>
                      <Link to={`/surprise/digital/${occ.slug}`} className="block">
                        <Button type="button" variant="primary" className="w-full gap-1.5 text-sm">
                          Pay now · {formatINR(DIGITAL_PRICE_INR)}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-hm-text-muted">
            <Link to="/surprise/local" className="text-hm-accent hover:underline">
              Prefer Local Surprise in Chennai?
            </Link>
          </p>
        </Container>
      </Section>
    </div>
  )
}

export function DigitalSurpriseCustomizePage() {
  const { occasionSlug } = useParams()
  const navigate = useNavigate()
  const occasion = getOccasionBySlug(occasionSlug)

  const [templateId, setTemplateId] = useState(occasion?.templates[0]?.id || '')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewUsed, setPreviewUsed] = useState(() =>
    occasion ? hasUsedPreview(occasion.id) : false,
  )
  const [published, setPublished] = useState(null)

  const draftMedia = useMemo(
    () => ({
      instagramUrl: instagramUrl || null,
      videoUrl: videoUrl || null,
      photoUrl: photoUrl || null,
    }),
    [instagramUrl, videoUrl, photoUrl],
  )

  if (!occasion) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl">Occasion not found</h1>
        <Link to="/surprise/digital" className="mt-4 inline-block text-hm-accent">
          Back to Digital Surprise
        </Link>
      </Container>
    )
  }

  async function payAndPublish() {
    setError('')
    setBusy(true)
    try {
      const draft = await digitalSurpriseApi.create({
        occasion: occasion.id,
        templateId,
        recipientName,
        senderName: senderName || undefined,
        message: message || undefined,
        buyerEmail,
        buyerPhone: buyerPhone || undefined,
        instagramUrl: instagramUrl || undefined,
        videoUrl: videoUrl || undefined,
        photoUrl: photoUrl || undefined,
      })

      const checkout = await digitalSurpriseApi.checkout(draft.id)

      if (checkout.alreadyPaid) {
        setPublished(checkout.surprise)
        return
      }

      if (checkout.mockPay) {
        const activated = await digitalSurpriseApi.verifyPayment(draft.id, {
          mock: true,
          razorpayOrderId: checkout.razorpayOrderId,
        })
        setPublished(activated)
        return
      }

      const ok = await loadRazorpay()
      if (!ok) throw new Error('Unable to load Razorpay')

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: checkout.keyId,
          amount: checkout.amount,
          currency: checkout.currency || 'INR',
          name: checkout.name || 'Uniquworld',
          description: checkout.description || 'Digital Surprise',
          order_id: checkout.razorpayOrderId,
          prefill: checkout.prefill || { email: buyerEmail },
          theme: { color: '#0a2d4d' },
          handler: async (response) => {
            try {
              const activated = await digitalSurpriseApi.verifyPayment(draft.id, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              setPublished(activated)
              resolve(activated)
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        })
        rzp.open()
      })
    } catch (err) {
      setError(getErrorMessage(err, err.message || 'Could not complete payment'))
    } finally {
      setBusy(false)
    }
  }

  function openPreview() {
    if (previewUsed) {
      setError('Demo preview already used on this device. Pay ₹49 to unlock your private link.')
      return
    }
    setError('')
    markPreviewUsed(occasion.id)
    setPreviewUsed(true)
    navigate(`/surprise/digital/${occasion.slug}/demo`, {
      state: {
        recipientName: recipientName.trim() || 'Alex',
        senderName: senderName.trim() || 'Uniquworld',
        message: message.trim(),
      },
    })
  }

  if (published) {
    return (
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-hm-border bg-hm-elevated p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-hm-offer-muted text-hm-success">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-hm-text">Surprise is live</h1>
          <p className="mt-2 text-sm text-hm-text-muted">
            We emailed the private link to <strong>{published.buyerEmail}</strong>. Valid for 30 days.
          </p>
          <a
            href={published.shareUrl || published.sharePath}
            className="mt-4 block break-all text-sm font-medium text-hm-accent"
          >
            {published.shareUrl || `${window.location.origin}${published.sharePath}`}
          </a>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate(published.sharePath)}
            >
              Open page
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const url = published.shareUrl || `${window.location.origin}${published.sharePath}`
                navigator.clipboard?.writeText(url)
              }}
            >
              Copy link
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <div>
      <section className="border-b border-hm-border bg-hm-bg-muted/60 py-10">
        <Container>
          <Link to="/surprise/digital" className="text-sm text-hm-accent hover:underline">
            ← All digital occasions
          </Link>
          <h1 className="mt-3 font-display text-3xl text-hm-text sm:text-4xl">{occasion.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-hm-text-muted">{occasion.headline}</p>
          <p className="mt-3 text-sm font-semibold text-hm-primary">
            {formatINR(DIGITAL_PRICE_INR)} · private link · auto-expires in 30 days
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-hm-text">Choose a unique page style</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {occasion.templates.map((t) => {
                    const selected = templateId === t.id
                    return (
                      <div
                        key={t.id}
                        className={cn(
                          'flex flex-col rounded-xl border px-3 py-3 text-left transition',
                          selected
                            ? 'border-hm-accent bg-hm-accent-muted ring-1 ring-hm-accent/30'
                            : 'border-hm-border bg-hm-elevated',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setTemplateId(t.id)}
                          className="text-left"
                        >
                          <p className="text-xs font-semibold text-hm-text">{t.name}</p>
                          <p className="mt-0.5 text-[10px] text-hm-text-muted">{t.hint}</p>
                        </button>
                        <Button
                          type="button"
                          variant={selected ? 'primary' : 'outline'}
                          size="sm"
                          className="mt-2 w-full text-[11px]"
                          disabled={busy}
                          onClick={() => {
                            setTemplateId(t.id)
                            // Scroll to checkout actions so Pay now is obvious
                            document.getElementById('ds-pay-now')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            })
                          }}
                        >
                          Pay now · {formatINR(DIGITAL_PRICE_INR)}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Their name *</span>
                <input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={occasion.id === 'girlfriends_day' ? 'Girlfriend’s name' : 'Recipient name'}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Your name</span>
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-hm-border bg-hm-elevated px-3 py-2.5 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Instagram post / reel URL</span>
                <input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/…"
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">YouTube / Vimeo / video URL → iframe</span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=…"
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Photo URL (optional)</span>
                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Your email * (we send the link here)</span>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Phone (for Razorpay)</span>
                <input
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              {error ? <p className="text-sm text-hm-danger">{error}</p> : null}

              <div id="ds-pay-now" className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" className="flex-1" onClick={openPreview} disabled={busy}>
                  {previewUsed ? 'Demo used' : 'Full-screen demo'}
                </Button>
                <Button type="button" variant="primary" className="flex-1 gap-1.5" onClick={payAndPublish} disabled={busy}>
                  {busy ? 'Processing…' : `Pay now · ${formatINR(DIGITAL_PRICE_INR)}`}
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-hm-border">
              <div className="border-b border-hm-border bg-hm-bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-wider text-hm-text-muted">
                Live style preview
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <DigitalSurpriseExperience
                  templateId={templateId}
                  recipientName={recipientName || 'Her name'}
                  senderName={senderName}
                  message={message || occasion.headline}
                  media={draftMedia}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

export function DigitalSurpriseLivePage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const row = await digitalSurpriseApi.getBySlug(slug)
        if (!cancelled) setData(row)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Surprise unavailable'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center text-sm text-hm-text-muted">
        Loading surprise…
      </div>
    )
  }

  if (error || !data) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-hm-text">Link unavailable</h1>
        <p className="mt-2 text-sm text-hm-text-muted">{error || 'Not found'}</p>
        <Link to="/surprise/digital" className="mt-6 inline-block text-hm-accent">
          Create a new digital surprise
        </Link>
      </Container>
    )
  }

  return (
    <DigitalSurpriseExperience
      templateId={data.templateId}
      recipientName={data.recipientName}
      senderName={data.senderName}
      message={data.message}
      media={data.media}
    />
  )
}
