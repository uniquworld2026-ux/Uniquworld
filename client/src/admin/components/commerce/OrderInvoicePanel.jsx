import { useRef } from 'react'
import { Download, Mail, Printer } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

/** Admin invoice preview + print/download + email trigger. */
export function OrderInvoicePanel({ html, orderNumber, onSendEmail, sending = false, className }) {
  const frameRef = useRef(null)

  function printInvoice() {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.focus()
    frame.contentWindow.print()
  }

  function downloadHtml() {
    const blob = new Blob([html || ''], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${orderNumber || 'order'}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!html) {
    return (
      <div className={cn('rounded-2xl border border-admin-border bg-admin-elevated p-8 text-center', className)}>
        <p className="text-sm text-admin-text-muted">Invoice preview unavailable.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={printInvoice}>
          <Printer className="h-4 w-4" />
          Print invoice
        </Button>
        <Button size="sm" variant="outline" onClick={downloadHtml}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button size="sm" variant="accent" disabled={sending} onClick={() => onSendEmail?.('invoice')}>
          <Mail className="h-4 w-4" />
          {sending ? 'Sending…' : 'Email invoice to customer'}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-white shadow-admin">
        <iframe
          ref={frameRef}
          title={`Invoice ${orderNumber}`}
          srcDoc={html}
          className="h-[720px] w-full bg-white"
        />
      </div>
    </div>
  )
}
