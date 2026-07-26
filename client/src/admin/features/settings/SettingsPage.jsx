import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Globe2, Mail, Store } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input, Select, Textarea, Checkbox } from '@/shared/components/forms/Field'
import { AdminPageStats } from '@/admin/components/crud/AdminPageStats'
import { erpApi } from '@/admin/lib/erpApi'

const emptyForm = {
  storeName: '',
  supportEmail: '',
  phone: '',
  currency: '',
  timezone: '',
  lowStockAlert: false,
  orderEmails: false,
  address: '',
  taxNote: '',
}

function asFormValue(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...emptyForm }
  return {
    ...emptyForm,
    ...value,
    lowStockAlert: Boolean(value.lowStockAlert),
    orderEmails: Boolean(value.orderEmails),
  }
}

export function SettingsPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(false)

  const settingsQuery = useQuery({
    queryKey: ['erp', 'settings'],
    queryFn: () => erpApi.list('settings'),
  })

  const storeDoc = (settingsQuery.data || []).find((item) => item.key === 'store')
  const storeDocId = storeDoc?.id
  const storeValue = storeDoc?.value

  useEffect(() => {
    if (!settingsQuery.isSuccess) return
    setForm(asFormValue(storeValue))
  }, [settingsQuery.isSuccess, storeDocId, storeValue])

  const saveMutation = useMutation({
    mutationFn: async (nextForm) => {
      if (storeDoc?.id) {
        return erpApi.update('settings', storeDoc.id, {
          key: 'store',
          label: 'Store settings',
          value: nextForm,
          status: 'active',
        })
      }
      return erpApi.create('settings', {
        key: 'store',
        label: 'Store settings',
        value: nextForm,
        status: 'active',
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp', 'settings'] })
      setSaved(true)
    },
  })

  function setField(name, value) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    saveMutation.mutate(form)
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

      <AdminPageStats
        stats={[
          {
            label: 'Store name',
            value: form.storeName ? 'Set' : 'Missing',
            hint: form.storeName || 'Required',
            tone: form.storeName ? 'success' : 'warning',
            icon: Store,
          },
          {
            label: 'Support email',
            value: form.supportEmail ? 'Set' : 'Missing',
            hint: form.supportEmail || 'Required',
            tone: form.supportEmail ? 'success' : 'warning',
            icon: Mail,
          },
          {
            label: 'Region',
            value: form.currency || '—',
            hint: form.timezone || 'Not set',
            tone: 'accent',
            icon: Globe2,
          },
          {
            label: 'Alerts',
            value: [form.lowStockAlert, form.orderEmails].filter(Boolean).length,
            hint: 'Active notification toggles',
            tone: 'default',
            icon: Bell,
          },
        ]}
      />

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
              <option value="">Select currency</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </Select>
            <Select
              label="Timezone"
              value={form.timezone}
              onChange={(e) => setField('timezone', e.target.value)}
            >
              <option value="">Select timezone</option>
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
          <Button type="submit" variant="accent" size="sm" loading={saveMutation.isPending}>
            Save settings
          </Button>
          {saved ? (
            <span className="text-sm text-admin-success">Settings saved.</span>
          ) : null}
          {saveMutation.isError ? (
            <span className="text-sm text-admin-danger">
              {saveMutation.error?.message || 'Failed to save settings.'}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  )
}
