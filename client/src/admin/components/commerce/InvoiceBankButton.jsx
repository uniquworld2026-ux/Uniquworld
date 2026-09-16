import { useEffect, useState } from 'react'
import { Landmark } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { getErrorMessage } from '@/shared/lib/axios'

const FIELDS = [
  ['accountName', 'Account name'],
  ['bankName', 'Bank name'],
  ['accountNumber', 'Account number'],
  ['ifsc', 'IFSC'],
  ['branch', 'Branch'],
  ['swift', 'SWIFT'],
  ['upi', 'UPI ID'],
]

const empty = () => Object.fromEntries(FIELDS.map(([key]) => [key, '']))

/** Enter bank / remittance details and save them onto invoices. */
export function InvoiceBankForm({ onSaved }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    erpApi
      .getInvoiceBank()
      .then((bank) => setForm({ ...empty(), ...(bank || {}) }))
      .catch(() => {})
  }, [])

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const bank = await erpApi.saveInvoiceBank(form)
      setForm({ ...empty(), ...(bank || {}) })
      setSuccess('Bank details saved. They now print on invoices.')
      onSaved?.()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={save}
      className="rounded-2xl border-2 border-red-500 bg-white p-5 text-neutral-900 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-semibold text-neutral-900">Enter bank details</h3>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Type account details here, then click Save. Press Enter in a field to save too.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block text-neutral-600">{label}</span>
            <input
              value={form[key] || ''}
              onChange={(e) => {
                setSuccess('')
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }}
              className="h-10 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-red-500"
            />
          </label>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-green-700">{success}</p> : null}
    </form>
  )
}
