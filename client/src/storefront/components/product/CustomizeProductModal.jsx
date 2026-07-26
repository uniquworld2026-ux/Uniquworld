import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MIN_IMAGE_BYTES = 112 * 1024

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

/**
 * Customize Product modal — Upload Photos / Enter Text.
 */
export function CustomizeProductModal({
  open,
  onClose,
  onContinue,
  productName,
  initialText = '',
  initialPhotoName = '',
  initialPhotoDataUrl = '',
}) {
  const inputRef = useRef(null)
  const [tab, setTab] = useState('photos')
  const [customText, setCustomText] = useState(initialText)
  const [photoName, setPhotoName] = useState(initialPhotoName)
  const [photoDataUrl, setPhotoDataUrl] = useState(initialPhotoDataUrl)
  const [error, setError] = useState('')

  if (!open) return null

  async function applyFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Upload only JPG, JPEG, or PNG.')
      return
    }
    if (file.size < MIN_IMAGE_BYTES) {
      setError('File size should be at least 112KB.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('File size should be under 10MB.')
      return
    }
    setError('')
    const dataUrl = await readFileAsDataUrl(file)
    setPhotoName(file.name)
    setPhotoDataUrl(dataUrl)
  }

  function handleContinue() {
    if (!customText.trim() && !photoDataUrl) {
      setError('Please upload a photo or enter text to continue.')
      return
    }
    onContinue?.({
      customText: customText.trim(),
      photoName,
      photoDataUrl,
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(92svh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-hm-elevated shadow-hm-elevated sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-20 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-hm-elevated text-hm-text shadow-hm-soft"
          aria-label="Close customize"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12">
          <h2 className="text-center text-xl font-bold text-hm-text">Customize Product</h2>
          {productName ? (
            <p className="mt-1 text-center text-xs text-hm-text-muted">{productName}</p>
          ) : null}

          <div className="mt-5 flex border-b border-hm-border">
            <button
              type="button"
              onClick={() => setTab('photos')}
              className={cn(
                'min-h-11 flex-1 pb-2.5 text-sm font-semibold',
                tab === 'photos'
                  ? 'border-b-2 border-hm-primary text-hm-primary'
                  : 'text-hm-text-muted',
              )}
            >
              Upload Photos
            </button>
            <button
              type="button"
              onClick={() => setTab('text')}
              className={cn(
                'min-h-11 flex-1 pb-2.5 text-sm font-semibold',
                tab === 'text'
                  ? 'border-b-2 border-hm-primary text-hm-primary'
                  : 'text-hm-text-muted',
              )}
            >
              Enter Text
            </button>
          </div>

          <div className="mt-5 min-h-[200px] sm:min-h-[280px]">
            {tab === 'photos' ? (
              <div className="space-y-4">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="sr-only"
                  onChange={(e) => {
                    void applyFile(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-hm-border bg-hm-muted/50 sm:h-48"
                >
                  {photoDataUrl ? (
                    <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-hm-text-muted">
                      <ImagePlus className="h-12 w-12" />
                      <span className="text-xs">Tap to upload photo</span>
                    </div>
                  )}
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-hm-primary text-lg font-bold text-white">
                    +
                  </span>
                </button>

                <div>
                  <p className="text-sm font-semibold text-hm-text">Instructions</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-hm-text-muted">
                    <li>File size should be 112KB - 10MB only.</li>
                    <li>Upload only JPG, JPEG, PNG.</li>
                    <li>Please upload a good quality image.</li>
                    <li>Please ensure you have rights to use the image.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-hm-text">Your text</span>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={5}
                    placeholder="Enter name, message, or engraving text…"
                    className="w-full rounded-xl border border-hm-border bg-hm-bg px-3 py-2.5 text-sm text-hm-text outline-none focus:border-hm-accent focus:ring-2 focus:ring-hm-ring"
                  />
                </label>
                <p className="text-xs text-hm-text-muted">
                  Keep it short and clear so we can personalize accurately.
                </p>
              </div>
            )}
          </div>

          {error ? <p className="mt-3 text-center text-xs text-hm-danger">{error}</p> : null}

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-5 w-full"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
