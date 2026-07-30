import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, Share, X } from 'lucide-react'
import { BRAND_ICON_SRC } from '@/storefront/components/brand/BrandLogo'
import { cn } from '@/shared/utils/cn'

const DISMISS_KEY = 'uw_install_prompt_dismissed_at'
const DISMISS_DAYS = 14
const TAGLINE = 'Make a Moment, Unique the world.'

function isStandalone() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    Boolean(window.navigator.standalone)
  )
}

function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
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
 * First-visit install ask — Worklogz-style card for Uniquworld.
 * Tagline: Make a Moment, Unique the world.
 */
export function InstallAppPrompt() {
  const [open, setOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installing, setInstalling] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const ios = isIos()

  const dismiss = useCallback(() => {
    markDismissed()
    setOpen(false)
    setShowIosHelp(false)
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

    const timer = window.setTimeout(() => {
      if (isStandalone() || wasDismissedRecently()) return
      if (!isMobileViewport()) return
      setOpen(true)
    }, 2200)

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
    if (showIosHelp) {
      dismiss()
      return
    }
    if (ios && !deferredPrompt) {
      setShowIosHelp(true)
      return
    }
    if (!deferredPrompt) {
      setShowIosHelp(true)
      return
    }
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
      /* cancelled */
    } finally {
      setInstalling(false)
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="uw-install-title"
        className={cn(
          'pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white',
          'shadow-[0_12px_40px_rgba(10,45,77,0.18)]',
          'animate-[uw-install-in_0.35s_ease-out]',
        )}
      >
        <div className="relative px-4 pb-4 pt-4">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <img
              src={BRAND_ICON_SRC}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0 pt-0.5">
              <h2 id="uw-install-title" className="text-[17px] font-bold leading-snug text-[#0a2d4d]">
                Install Uniquworld App
              </h2>
              <p className="mt-1 text-sm leading-snug text-slate-500">{TAGLINE}</p>
            </div>
          </div>

          {showIosHelp ? (
            <ol className="mt-3 space-y-2 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="font-bold text-[#0a2d4d]">1.</span>
                <span>
                  Tap <Share className="mx-0.5 inline h-3.5 w-3.5 text-[#d92c2b]" aria-hidden /> Share
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0a2d4d]">2.</span>
                <span>Choose Add to Home Screen</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0a2d4d]">3.</span>
                <span>Tap Add — open Uniquworld like an app</span>
              </li>
            </ol>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={installing}
              onClick={handleInstall}
              className={cn(
                'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl',
                'bg-[#0a2d4d] text-sm font-semibold text-white transition hover:bg-[#071f36]',
                'disabled:cursor-wait disabled:opacity-70',
              )}
            >
              <Download className="h-4 w-4" aria-hidden />
              {installing ? 'Installing…' : showIosHelp ? 'Got it' : 'Install App'}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 px-1 text-sm font-medium text-slate-500 transition hover:text-[#0a2d4d]"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes uw-install-in {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  )
}
