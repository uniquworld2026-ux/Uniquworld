import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, Share, Smartphone, X } from 'lucide-react'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

const DISMISS_KEY = 'uw_install_prompt_dismissed_at'
const DISMISS_DAYS = 14

function isStandalone() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    // iOS Safari
    Boolean(window.navigator.standalone)
  )
}

function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

function isIos() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function wasDismissedRecently() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const at = Number(raw)
    if (!Number.isFinite(at)) return false
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}

/**
 * Mobile “Install Uniquworld app” suggestion — uses native install when available,
 * otherwise shows Add to Home Screen steps (especially iOS Safari).
 */
export function InstallAppPrompt() {
  const [open, setOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installing, setInstalling] = useState(false)
  const ios = isIos()

  const dismiss = useCallback(() => {
    markDismissed()
    setOpen(false)
  }, [])

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return undefined

    const onBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    const onInstalled = () => {
      setDeferredPrompt(null)
      setOpen(false)
      markDismissed()
    }
    window.addEventListener('appinstalled', onInstalled)

    let timer
    const maybeOpen = () => {
      if (isStandalone() || wasDismissedRecently()) return
      if (!isMobileViewport()) return
      // Android/Chrome: wait for native prompt when possible; still show sheet for guidance
      setOpen(true)
    }
    timer = window.setTimeout(maybeOpen, 4500)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  async function handleInstall() {
    if (!deferredPrompt) return
    setInstalling(true)
    try {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      if (choice?.outcome === 'accepted') {
        markDismissed()
        setOpen(false)
      }
    } catch {
      /* user cancelled */
    } finally {
      setInstalling(false)
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="uw-install-title"
        className={cn(
          'pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-hm-border',
          'bg-hm-elevated shadow-[0_-8px_40px_rgba(10,45,77,0.18)]',
          'animate-[uw-install-in_0.4s_ease-out]',
        )}
      >
        <div className="relative overflow-hidden px-4 pb-4 pt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,44,43,0.1),transparent_55%),linear-gradient(180deg,#f4f7fb_0%,transparent_55%)]"
          />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install suggestion"
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-hm-text-muted transition hover:bg-hm-bg-muted hover:text-hm-text"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-hm-border bg-white shadow-sm">
              <BrandLogo variant="icon" to={null} imgClassName="h-10 w-10" />
            </div>
            <div className="min-w-0 pr-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-accent">
                Install app
              </p>
              <h2 id="uw-install-title" className="mt-0.5 font-display text-xl text-hm-text">
                Add Uniquworld to your phone
              </h2>
              <p className="mt-1 text-sm leading-snug text-hm-text-muted">
                Open gifts faster — install our browser app on your home screen.
              </p>
            </div>
          </div>

          {ios ? (
            <ol className="relative mt-4 space-y-2.5 rounded-xl bg-hm-bg-muted/80 px-3 py-3 text-sm text-hm-text">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hm-primary text-[10px] font-bold text-white">
                  1
                </span>
                <span>
                  Tap <Share className="mx-0.5 inline h-3.5 w-3.5 text-hm-accent" aria-hidden />{' '}
                  <strong>Share</strong> in Safari
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hm-primary text-[10px] font-bold text-white">
                  2
                </span>
                <span>
                  Choose <strong>Add to Home Screen</strong>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hm-primary text-[10px] font-bold text-white">
                  3
                </span>
                <span>
                  Tap <strong>Add</strong> — Uniquworld opens like an app
                </span>
              </li>
            </ol>
          ) : (
            <div className="relative mt-4 flex items-center gap-2 rounded-xl bg-hm-bg-muted/80 px-3 py-2.5 text-sm text-hm-text-muted">
              <Smartphone className="h-4 w-4 shrink-0 text-hm-accent" aria-hidden />
              <span>Install once — then open Uniquworld from your home screen anytime.</span>
            </div>
          )}

          <div className="relative mt-4 flex gap-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={dismiss}>
              Not now
            </Button>
            {deferredPrompt && !ios ? (
              <Button
                type="button"
                variant="primary"
                className="flex-1 gap-1.5"
                disabled={installing}
                onClick={handleInstall}
              >
                <Download className="h-4 w-4" aria-hidden />
                {installing ? 'Installing…' : 'Install app'}
              </Button>
            ) : (
              <Button type="button" variant="primary" className="flex-1 gap-1.5" onClick={dismiss}>
                {ios ? 'Got it' : 'OK'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes uw-install-in {
          from { opacity: 0; transform: translateY(1.25rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  )
}
