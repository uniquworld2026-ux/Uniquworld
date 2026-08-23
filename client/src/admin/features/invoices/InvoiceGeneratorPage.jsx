import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { InvoiceGstTabs } from '@/admin/components/commerce/InvoiceGstTabs'
import { OrderInvoicePanel } from '@/admin/components/commerce/OrderInvoicePanel'
import { Button } from '@/shared/components/ui/Button'
import { getErrorMessage } from '@/shared/lib/axios'

const emptyItem = () => ({ description: '', quantity: 1, rate: 0, hsn: '9985' })

function defaultInvoiceNumber() {
  const d = new Date()
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `INV-${stamp}-${String(Math.floor(Math.random() * 900) + 100)}`
}

const inputClass =
  'w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-admin-accent'

export function InvoiceGeneratorPage() {
  const [gstMode, setGstMode] = useState('with')
  const [form, setForm] = useState({
    invoiceNumber: defaultInvoiceNumber(),
    invoiceDate: new Date().toISOString().slice(0, 10),
    gstPercent: 18,
    discount: 0,
    shipping: 0,
    notes: '',
    customer: {
      name: '',
      email: '',
      phone: '',
      gstin: '',
      state: '',
      address: '',
    },
    items: [emptyItem(), emptyItem()],
  })

  const payload = useMemo(
    () => ({
      ...form,
      gstMode,
      items: form.items.filter((item) => item.description.trim()),
    }),
    [form, gstMode],
  )

  const previewMutation = useMutation({
    mutationFn: () => erpApi.previewCustomInvoice(payload),
  })

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateCustomer(key, value) {
    setForm((prev) => ({ ...prev, customer: { ...prev.customer, [key]: value } }))
  }

  function updateItem(index, key, value) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }))
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }))
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-admin-accent">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Billing</span>
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-admin-text">Invoice Generator</h2>
          <p className="mt-1 max-w-2xl text-sm text-admin-text-muted">
            Create professional invoices for manual billing, corporate orders, or offline payments.
            Switch between GST tax invoices and simple bills without GST.
          </p>
        </div>
        <InvoiceGstTabs value={gstMode} onChange={setGstMode} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="space-y-5 rounded-2xl border border-admin-border bg-admin-elevated p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-admin-text-muted">Invoice number</span>
              <input
                className={inputClass}
                value={form.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-admin-text-muted">Invoice date</span>
              <input
                type="date"
                className={inputClass}
                value={form.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </label>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-admin-text">Customer</h3>
            <div className="mt-3 grid gap-3">
              <input
                className={inputClass}
                placeholder="Customer / company name"
                value={form.customer.name}
                onChange={(e) => updateCustomer('name', e.target.value)}
              />
              {gstMode === 'with' ? (
                <input
                  className={inputClass}
                  placeholder="Customer GSTIN (optional)"
                  value={form.customer.gstin}
                  onChange={(e) => updateCustomer('gstin', e.target.value)}
                />
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Email"
                  value={form.customer.email}
                  onChange={(e) => updateCustomer('email', e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Phone"
                  value={form.customer.phone}
                  onChange={(e) => updateCustomer('phone', e.target.value)}
                />
              </div>
              <input
                className={inputClass}
                placeholder="State (place of supply)"
                value={form.customer.state}
                onChange={(e) => updateCustomer('state', e.target.value)}
              />
              <textarea
                className={inputClass}
                rows={2}
                placeholder="Billing address"
                value={form.customer.address}
                onChange={(e) => updateCustomer('address', e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-admin-text">Line items</h3>
              <Button size="sm" variant="outline" type="button" onClick={addItem}>
                <Plus className="h-4 w-4" />
                Add row
              </Button>
            </div>
            <div className="mt-3 space-y-3">
              {form.items.map((item, index) => (
                <div key={index} className="rounded-xl border border-admin-border bg-admin-bg p-3">
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <input
                      type="number"
                      min="1"
                      className={inputClass}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                    />
                    {gstMode === 'with' ? (
                      <input
                        className={inputClass}
                        placeholder="HSN"
                        value={item.hsn}
                        onChange={(e) => updateItem(index, 'hsn', e.target.value)}
                      />
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      className="justify-center"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {gstMode === 'with' ? (
              <label className="block text-sm">
                <span className="mb-1 block text-admin-text-muted">GST %</span>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.gstPercent}
                  onChange={(e) => updateField('gstPercent', Number(e.target.value))}
                />
              </label>
            ) : null}
            <label className="block text-sm">
              <span className="mb-1 block text-admin-text-muted">Shipping</span>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.shipping}
                onChange={(e) => updateField('shipping', Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-admin-text-muted">Discount</span>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.discount}
                onChange={(e) => updateField('discount', Number(e.target.value))}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block text-admin-text-muted">Notes</span>
            <textarea
              className={inputClass}
              rows={2}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Payment terms, PO reference, etc."
            />
          </label>

          <Button
            variant="accent"
            disabled={previewMutation.isPending || !form.customer.name.trim()}
            onClick={() => previewMutation.mutate()}
          >
            {previewMutation.isPending ? 'Generating…' : 'Generate invoice preview'}
          </Button>

          {previewMutation.error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {getErrorMessage(previewMutation.error)}
            </p>
          ) : null}
        </section>

        <section>
          {previewMutation.data?.html ? (
            <OrderInvoicePanel
              html={previewMutation.data.html}
              orderNumber={previewMutation.data.invoiceNumber || form.invoiceNumber}
            />
          ) : (
            <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-elevated p-8 text-center">
              <div>
                <FileText className="mx-auto h-10 w-10 text-admin-text-muted" />
                <p className="mt-3 text-sm text-admin-text-muted">
                  Fill in customer and line items, then generate a {gstMode === 'with' ? 'GST tax' : 'non-GST'}{' '}
                  invoice preview.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
