import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Download, Mail, Printer, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

/** Admin invoice preview + print/download + email trigger. */
export function OrderInvoicePanel({
  html,
  orderNumber,
  stored = false,
  savedAt,
  onSendEmail,
  onGenerateSave,
  sending = false,
  generating = false,
  className,
}) {
  const frameRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  function printInvoice() {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.focus()
    frame.contentWindow.print()
  }

  async function downloadPdf() {
    const sheet = frameRef.current?.contentDocument?.querySelector('.sheet')
    if (!sheet) return
    setDownloading(true)
    setDownloadError('')
    try {
      const canvas = await html2canvas(sheet, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        windowWidth: 820,
      })
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const img = canvas.toDataURL('image/jpeg', 0.95)
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(img, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 8) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save(`invoice-${orderNumber || 'order'}.pdf`)
    } catch {
      setDownloadError('Could not create the PDF. Try Print invoice and choose Save as PDF.')
    } finally {
      setDownloading(false)
    }
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
      <div className="flex flex-wrap items-center gap-2">
        {stored ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Saved{savedAt ? ` · ${new Date(savedAt).toLocaleString('en-IN')}` : ''}
          </span>
        ) : (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
            Preview only — not saved yet
          </span>
        )}

        {onGenerateSave ? (
          <Button size="sm" variant="accent" disabled={generating} onClick={onGenerateSave}>
            {stored ? <RefreshCw className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {generating ? 'Saving…' : stored ? 'Regenerate & save' : 'Generate & save'}
          </Button>
        ) : null}

        <Button size="sm" variant="outline" onClick={printInvoice}>
          <Printer className="h-4 w-4" />
          Print invoice
        </Button>
        <Button size="sm" variant="outline" disabled={downloading} onClick={downloadPdf}>
          <Download className="h-4 w-4" />
          {downloading ? 'Creating PDF…' : 'Download PDF'}
        </Button>
        {onSendEmail ? (
          <Button size="sm" variant="outline" disabled={sending} onClick={() => onSendEmail('invoice')}>
            <Mail className="h-4 w-4" />
            {sending ? 'Sending…' : 'Email invoice to customer'}
          </Button>
        ) : null}
      </div>

      {downloadError ? <p className="text-sm text-red-600">{downloadError}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-white shadow-admin">
        <iframe
          ref={frameRef}
          title={`Invoice ${orderNumber}`}
          srcDoc={html}
          className="h-[960px] w-full bg-white"
        />
      </div>
    </div>
  )
}
