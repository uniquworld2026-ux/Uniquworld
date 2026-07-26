import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input, Select, Textarea, Checkbox } from '@/shared/components/forms/Field'

const STORAGE_KEY = 'hm_admin_settings_v1'

const defaults = {
  storeName: 'Uniquworld',
  supportEmail: 'hello@uniquworld.example',
  phone: '+91 44 4000 1200',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  lowStockAlert: true,
  orderEmails: true,
  address: '12 Atelier Lane, Chennai 600004',
  taxNote: 'GST included where applicable.',
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

export function SettingsPage() {
  const [form, setForm] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  function setField(name, value) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
          Settings
        </h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          Configure store identity, alerts, and regional defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Store profile</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input
              label="Store name"
              value={form.storeName}
              onChange={(e) => setField('storeName', e.target.value)}
            />
            <Input
              label="Support email"
              type="email"
              value={form.supportEmail}
              onChange={(e) => setField('supportEmail', e.target.value)}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
            <Select
              label="Currency"
              value={form.currency}
              onChange={(e) => setField('currency', e.target.value)}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </Select>
            <Select
              label="Timezone"
              value={form.timezone}
              onChange={(e) => setField('timezone', e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="UTC">UTC</option>
            </Select>
            <div className="sm:col-span-2">
              <Textarea
                label="Address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Tax note"
                value={form.taxNote}
                onChange={(e) => setField('taxNote', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Alerts</h3>
          <div className="mt-4 space-y-3">
            <Checkbox
              label="Email admins when stock falls below threshold"
              checked={form.lowStockAlert}
              onChange={(e) => setField('lowStockAlert', e.target.checked)}
            />
            <Checkbox
              label="Send order confirmation emails to customers"
              checked={form.orderEmails}
              onChange={(e) => setField('orderEmails', e.target.checked)}
            />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="accent" size="sm">
            Save settings
          </Button>
          {saved ? (
            <span className="text-sm text-admin-success">Settings saved locally.</span>
          ) : null}
        </div>
      </form>
    </div>
  )
}
