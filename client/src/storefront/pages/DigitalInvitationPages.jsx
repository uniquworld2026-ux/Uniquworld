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
  INVITATION_PRICE_INR,
  getInvitationBySlug,
  invitationOccasions,
} from '@/storefront/features/digitalInvitation/occasions'
import { InvitationExperience } from '@/storefront/features/digitalInvitation/InvitationExperience'
import { digitalSurpriseApi } from '@/storefront/features/digitalSurprise/api'
import { cn } from '@/shared/utils/cn'

export function DigitalInvitationPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-hm-border bg-[#0c1424]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.28),transparent_55%)]" />
        <Container className="relative py-14 sm:py-18 md:py-20">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e8d5a8]">
            <Sparkles className="h-3.5 w-3.5" />
            Digital Invitation · ₹{INVITATION_PRICE_INR}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
            Beautiful invites, shareable in one link
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Wedding, birthday party, housewarming, or baby shower — pick a template, add date &
            venue, then unlock a private invite that never expires.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Choose an invite"
              title="Four occasions · polished digital cards"
              description="Preview a demo, personalise the details, then pay ₹39 for a lifetime private link."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {invitationOccasions.map((occ, i) => (
              <Reveal key={occ.id} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated transition hover:border-hm-accent/40">
                  <Link to={`/surprise/invitation/${occ.slug}`} className="block overflow-hidden">
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
                    <Link to={`/surprise/invitation/${occ.slug}`}>
                      <h2 className="mt-1 font-display text-xl text-hm-text transition group-hover:text-hm-primary">
                        {occ.title}
                      </h2>
                    </Link>
                    <p className="mt-2 flex-1 text-sm text-hm-text-muted">{occ.headline}</p>
                    <p className="mt-3 text-xs text-hm-text-subtle">
                      {occ.templates.length} templates · lifetime private link
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href={`/surprise/invitation/${occ.slug}/demo`} className="block">
                        <Button type="button" variant="outline" className="w-full text-sm">
                          Watch demo
                        </Button>
                      </a>
                      <Link to={`/surprise/invitation/${occ.slug}`} className="block">
                        <Button type="button" variant="primary" className="w-full gap-1.5 text-sm">
                          Create · {formatINR(INVITATION_PRICE_INR)}
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
            Looking for an interactive surprise page instead?{' '}
            <Link to="/surprise/digital" className="text-hm-accent hover:underline">
              Try Digital Surprise
            </Link>
          </p>
        </Container>
      </Section>
    </div>
  )
}

export function DigitalInvitationCustomizePage() {
  const { occasionSlug } = useParams()
  const navigate = useNavigate()
  const occasion = getInvitationBySlug(occasionSlug)

  const [templateId, setTemplateId] = useState(occasion?.templates[0]?.id || '')
  const [honoreeName, setHonoreeName] = useState('')
  const [hostName, setHostName] = useState('')
  const [message, setMessage] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [venue, setVenue] = useState('')
  const [rsvpContact, setRsvpContact] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState(null)

  useEffect(() => {
    if (occasion) setTemplateId(occasion.templates[0]?.id || '')
  }, [occasion])

  const draftMedia = useMemo(
    () => ({
      eventDate,
      eventTime,
      venue,
      rsvpContact,
    }),
    [eventDate, eventTime, venue, rsvpContact],
  )

  if (!occasion) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-hm-text">Invitation not found</h1>
        <Link to="/surprise/invitation" className="mt-4 inline-block text-hm-accent">
          ← All digital invitations
        </Link>
      </Container>
    )
  }

  async function payAndPublish() {
    setError('')
    if (honoreeName.trim().length < 2) {
      setError('Enter the name on the invitation (at least 2 characters)')
      return
    }
    if (!buyerEmail.includes('@')) {
      setError('Enter a valid email to receive your invite link')
      return
    }
    if (!eventDate.trim() || !venue.trim()) {
      setError('Add the event date and venue')
      return
    }

    setBusy(true)
    try {
      const draft = await digitalSurpriseApi.create({
        occasion: occasion.id,
        templateId,
        recipientName: honoreeName.trim(),
        senderName: hostName.trim() || undefined,
        message: message.trim() || undefined,
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim() || undefined,
        eventDate: eventDate.trim(),
        eventTime: eventTime.trim() || undefined,
        venue: venue.trim(),
        rsvpContact: rsvpContact.trim() || undefined,
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
          description: checkout.description || 'Digital Invitation',
          order_id: checkout.razorpayOrderId,
          prefill: checkout.prefill || { email: buyerEmail },
          theme: { color: '#1a2d4d' },
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

  function openPreview(nextTemplateId = templateId) {
    const params = new URLSearchParams()
    if (honoreeName.trim()) params.set('name', honoreeName.trim())
    if (hostName.trim()) params.set('from', hostName.trim())
    if (message.trim()) params.set('msg', message.trim().slice(0, 180))
    if (nextTemplateId) params.set('template', nextTemplateId)
    if (eventDate.trim()) params.set('date', eventDate.trim())
    if (eventTime.trim()) params.set('time', eventTime.trim())
    if (venue.trim()) params.set('venue', venue.trim())
    if (rsvpContact.trim()) params.set('rsvp', rsvpContact.trim())
    const q = params.toString()
    navigate(`/surprise/invitation/${occasion.slug}/demo${q ? `?${q}` : ''}`)
  }

  if (published) {
    return (
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-hm-border bg-hm-elevated p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-hm-offer-muted text-hm-success">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-hm-text">Invitation is live</h1>
          <p className="mt-2 text-sm text-hm-text-muted">
            We emailed the private link to <strong>{published.buyerEmail}</strong>. It never expires.
          </p>
          <a
            href={published.shareUrl || published.sharePath}
            className="mt-4 block break-all text-sm font-medium text-hm-accent"
          >
            {published.shareUrl || `${window.location.origin}${published.sharePath}`}
          </a>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" variant="primary" onClick={() => navigate(published.sharePath)}>
              Open invite
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
          <Link to="/surprise/invitation" className="text-sm text-hm-accent hover:underline">
            ← All digital invitations
          </Link>
          <h1 className="mt-3 font-display text-3xl text-hm-text sm:text-4xl">{occasion.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-hm-text-muted">{occasion.headline}</p>
          <p className="mt-3 text-sm font-semibold text-hm-primary">
            {formatINR(INVITATION_PRICE_INR)} · private link · never expires
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-hm-text">Choose a card style</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {occasion.templates.map((t) => {
                    const selected = templateId === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTemplateId(t.id)}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-left transition',
                          selected
                            ? 'border-hm-accent bg-hm-accent-muted ring-1 ring-hm-accent/30'
                            : 'border-hm-border bg-hm-elevated',
                        )}
                      >
                        <p className="text-xs font-semibold text-hm-text">{t.name}</p>
                        <p className="mt-0.5 text-[10px] text-hm-text-muted">{t.hint}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Name on the invite *</span>
                <input
                  value={honoreeName}
                  onChange={(e) => setHonoreeName(e.target.value)}
                  placeholder={
                    occasion.id === 'wedding'
                      ? 'Asha & Rahul'
                      : occasion.id === 'baby_shower'
                        ? 'Priya & Karthik'
                        : 'Name of the guest of honour'
                  }
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Hosted by</span>
                <input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Your name / family name"
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Short message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="We would be honoured by your presence…"
                  className="w-full rounded-xl border border-hm-border bg-hm-elevated px-3 py-2.5 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-hm-text-muted">Event date *</span>
                  <input
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Saturday, 12 Sep 2026"
                    className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-hm-text-muted">Time</span>
                  <input
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="6:30 PM onwards"
                    className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">Venue *</span>
                <input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Hall name, area, city"
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-hm-text-muted">RSVP contact</span>
                <input
                  value={rsvpContact}
                  onChange={(e) => setRsvpContact(e.target.value)}
                  placeholder="Phone or WhatsApp"
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-hm-text-muted">Your email *</span>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-hm-text-muted">Phone</span>
                  <input
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
                  />
                </label>
              </div>

              {error ? <p className="text-sm text-hm-danger">{error}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => openPreview()} className="sm:flex-1">
                  Watch demo
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={busy}
                  onClick={payAndPublish}
                  className="gap-1.5 sm:flex-1"
                >
                  {busy ? 'Processing…' : `Pay now · ${formatINR(INVITATION_PRICE_INR)}`}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-muted">
                Live preview
              </p>
              <div className="overflow-hidden rounded-2xl border border-hm-border shadow-lg">
                <div className="max-h-[70vh] overflow-y-auto">
                  <InvitationExperience
                    templateId={templateId}
                    occasionTitle={occasion.title}
                    recipientName={honoreeName || 'Guest of honour'}
                    senderName={hostName}
                    message={message || occasion.headline}
                    media={draftMedia}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
