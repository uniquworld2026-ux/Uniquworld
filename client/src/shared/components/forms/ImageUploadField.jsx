import { useRef, useState } from 'react'
import { ImagePlus, Upload, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

/**
 * Drag-and-drop image upload that stores a data URL (or clears to '').
 *
 * @param {{
 *   label?: string
 *   value?: string
 *   onChange: (value: string) => void
 *   accept?: string
 *   error?: string
 *   hint?: string
 *   className?: string
 *   size?: 'md' | 'sm'
 * }} props
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  accept = 'image/*',
  error: externalError,
  hint = 'PNG, JPG up to 2 MB',
  className,
  size = 'md',
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const isSm = size === 'sm'
  const previewH = isSm ? 'h-28' : 'h-48'

  async function applyFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be under 2 MB')
      return
    }
    setError('')
    const dataUrl = await readFileAsDataUrl(file)
    onChange(dataUrl)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files?.[0]
    void applyFile(file)
  }

  const shownError = error || externalError

  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? <span className="text-xs font-medium text-admin-text-muted">{label}</span> : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          void applyFile(file)
          e.target.value = ''
        }}
      />
      {value ? (
        <div className={cn('relative overflow-hidden rounded-xl border border-admin-border bg-admin-muted', previewH)}>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/45 px-2 py-1.5 sm:px-3 sm:py-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/40 bg-white/90 text-admin-text"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              {isSm ? 'Change' : 'Replace'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove image"
              className="text-white hover:bg-white/20"
              onClick={() => {
                setError('')
                onChange('')
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragging(false)
          }}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 text-center transition',
            previewH,
            dragging
              ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
              : 'border-admin-border bg-admin-muted/40 text-admin-text-muted hover:border-admin-accent/60 hover:bg-admin-muted',
          )}
        >
          <ImagePlus className={isSm ? 'h-5 w-5' : 'h-7 w-7'} />
          <span className={cn('font-medium text-admin-text', isSm ? 'text-xs' : 'text-sm')}>
            {isSm ? 'Add image' : 'Drag & drop an image'}
          </span>
          {!isSm ? <span className="text-xs">or click to browse · {hint}</span> : null}
        </button>
      )}
      {shownError ? <span className="text-xs text-admin-danger">{shownError}</span> : null}
    </div>
  )
}
