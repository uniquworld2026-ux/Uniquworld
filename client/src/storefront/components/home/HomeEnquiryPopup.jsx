import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X } from 'lucide-react'
import { createCorporateEnquiry } from '@/admin/features/corporate/corporateEnquiriesStore'
import { Button } from '@/shared/components/ui/Button'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { Input, Select, TextArea } from '@/storefront/components/ui/Input'
import { cn } from '@/shared/utils/cn'

const SESSION_KEY = 'hm_home_enquiry_seen'

const MOQ_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

const WHO_OPTIONS = [
  { value: 'HR', label: 'HR' },
  { value: 'Prospector', label: 'Prospector' },
  { value: 'CEO', label: 'CEO' },
  { value: 'Other', label: 'Other' },
]

const emptyForm = {
  name: '',
  moq: 'Medium',
  who: 'HR',
  phone: '',
  description: '',
}

/**
 * Home-page enquiry popup — auto-opens once per session + floating reopen button.
 */
export function HomeEnquiryPopup() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return undefined
    const timer = window.setTimeout(() => setOpen(true), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  function markSeen() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  function dismiss() {
    markSeen()
    setOpen(false)
    setSubmitted(false)
    setErrors({})
  }

  function reopen() {
    setSubmitted(false)
    setErrors({})
    setOpen(true)
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Enter company or personal name'
    }
    if (!form.moq) {
      next.moq = 'Select MOQ'
    }
    if (!form.who) {
      next.who = 'Select your role'
    }
    const phone = form.phone.replace(/\D/g, '')
    if (!phone || phone.length < 10) {
      next.phone = 'Enter a valid 10-digit mobile number'
    }
    if (!form.description.trim() || form.description.trim().length < 8) {
      next.description = 'Please add a short description (at least 8 characters)'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const name = form.name.trim()
      createCorporateEnquiry({
        company: name,
        contact: name,
        phone: form.phone.trim(),
        moq: form.moq,
        who: form.who,
        interest: `MOQ: ${form.moq} · Role: ${form.who}`,
        message: form.description.trim(),
        source: 'home',
        status: 'new',
      })
      setSubmitted(true)
      setForm(emptyForm)
      markSeen()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={reopen}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[70] inline-flex min-h-11 items-center gap-2 rounded-full bg-hm-primary px-4 py-3 text-sm font-semibold text-white shadow-hm-elevated hover:bg-hm-primary-hover"
          aria-label="Open enquiry form"
        >
          <MessageCircle className="h-4 w-4" />
          Enquire
        </button>
      ) : null}

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
              <button
                type="button"
                aria-label="Close enquiry"
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                onClick={dismiss}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Enquiry form"
                className="relative z-10 flex max-h-[min(92svh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-hm-border bg-hm-elevated shadow-hm-elevated sm:rounded-3xl"
              >
                <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#fff0ea] via-hm-elevated to-[#e8f7f4] px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-hm-accent/20 blur-2xl" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <BrandLogo to={null} imgClassName="h-7" />
                      <h2 className="mt-2 font-display text-2xl tracking-tight text-hm-text">
                        Enquiry Form
                      </h2>
                      <p className="mt-1 text-sm text-hm-text-muted">
                        Share a few details — we&apos;ll get back within a day.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-hm-border bg-hm-elevated text-hm-text-muted hover:text-hm-text"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {submitted ? (
                  <div className="space-y-4 overflow-y-auto px-5 py-8 text-center sm:px-6">
                    <p className="font-display text-2xl text-hm-text">Thank you</p>
                    <p className="text-sm text-hm-text-muted">
                      Your enquiry is in — our team will reach out shortly.
                    </p>
                    <Button type="button" variant="primary" onClick={dismiss}>
                      Continue browsing
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-3.5 overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6"
                  >
                    <Field label="Company name or personal name" error={errors.name}>
                      <Input
                        name="name"
                        autoComplete="organization"
                        placeholder="Company / personal name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={cn(errors.name && 'border-hm-danger')}
                      />
                    </Field>

                    <Field label="MOQ (Minimum order quantity)" error={errors.moq}>
                      <Select
                        name="moq"
                        value={form.moq}
                        onChange={(e) => updateField('moq', e.target.value)}
                        className={cn(errors.moq && 'border-hm-danger')}
                      >
                        {MOQ_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label="Who?" error={errors.who}>
                      <Select
                        name="who"
                        value={form.who}
                        onChange={(e) => updateField('who', e.target.value)}
                        className={cn(errors.who && 'border-hm-danger')}
                      >
                        {WHO_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label="Mobile number" error={errors.phone}>
                      <Input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={cn(errors.phone && 'border-hm-danger')}
                      />
                    </Field>

                    <Field label="Description" error={errors.description}>
                      <TextArea
                        name="description"
                        rows={4}
                        placeholder="Tell us about your enquiry…"
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className={cn('min-h-[110px]', errors.description && 'border-hm-danger')}
                      />
                    </Field>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Submit enquiry'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={dismiss}>
                        Maybe later
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function Field({ label, error, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between gap-2 text-xs font-medium text-hm-text-muted">
        <span>{label}</span>
        {hint && !error ? <span className="font-normal text-hm-text-subtle">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-hm-danger">{error}</span> : null}
    </label>
  )
}
