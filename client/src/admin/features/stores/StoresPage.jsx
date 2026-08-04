import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { storePartnerAdminApi } from '@/admin/lib/erpApi'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'
import { getErrorMessage } from '@/shared/lib/axios'

const hooks = createErpHooks('stores')

export function StoresPage() {
  const navigate = useNavigate()
  const { data = [], isLoading, refetch } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()
  const [partners, setPartners] = useState([])
  const [partnerForm, setPartnerForm] = useState(null)
  const [partnerError, setPartnerError] = useState('')
  const [partnerBusy, setPartnerBusy] = useState(false)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    storePartnerAdminApi.listStores().then(setPartners).catch(() => setPartners([]))
  }, [data])

  async function createPartner(e) {
    e.preventDefault()
    setPartnerBusy(true)
    setPartnerError('')
    try {
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd.entries())
      body.sendInvite = true
      body.status = 'active'
      await storePartnerAdminApi.createPartner(body)
      setPartnerForm(null)
      refetch?.()
      const list = await storePartnerAdminApi.listStores()
      setPartners(list)
    } catch (err) {
      setPartnerError(getErrorMessage(err))
    } finally {
      setPartnerBusy(false)
    }
  }

  async function openDetail(id) {
    try {
      const data = await storePartnerAdminApi.getStore(id)
      setDetail(data)
    } catch (err) {
      setPartnerError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-admin-text">Store partners</h2>
          <p className="text-sm text-admin-muted">
            Every registered store with owner email, status, and bank details. Create owners here or
            they self-register at /store/vendor.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/admin/store-withdrawals')}>
            Withdrawals
          </Button>
          <Button size="sm" onClick={() => setPartnerForm({})}>
            Create store owner
          </Button>
        </div>
      </div>

      {partnerError ? <p className="text-sm text-red-600">{partnerError}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-admin-border text-xs uppercase text-admin-muted">
            <tr>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {partners.map((s) => (
              <tr key={s.id} className="border-b border-admin-border/60">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-admin-muted">
                  {[s.ownerFirstName, s.ownerLastName].filter(Boolean).join(' ') || s.managerName || '—'}
                </td>
                <td className="px-4 py-3 text-admin-muted">{s.email || s.ownerEmail || '—'}</td>
                <td className="px-4 py-3 text-admin-muted">{s.city || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={s.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => openDetail(s.id)}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
            {!partners.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-admin-muted">
                  No partner stores yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {detail ? (
        <div className="rounded-xl border border-admin-border bg-admin-elevated p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{detail.store?.name}</h3>
              <p className="text-sm text-admin-muted">
                Code · {detail.store?.code} · Status · {detail.store?.status}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setDetail(null)}>
              Close
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <p className="text-admin-muted">Email</p>
              <p>{detail.store?.email || '—'}</p>
            </div>
            <div>
              <p className="text-admin-muted">Phone</p>
              <p>{detail.store?.phone || '—'}</p>
            </div>
            <div>
              <p className="text-admin-muted">Month earnings</p>
              <p>₹{Number(detail.balance?.monthEarnings || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-admin-muted">Available</p>
              <p>₹{Number(detail.balance?.availableBalance || 0).toFixed(2)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-admin-muted">Bank</p>
              <p>
                {detail.store?.bankName || '—'} · {detail.store?.bankAccountNumber || '—'} ·{' '}
                {detail.store?.bankIfsc || '—'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-admin-muted">Products</p>
              <p>{detail.products?.length || 0} items</p>
            </div>
          </div>
        </div>
      ) : null}

      {partnerForm ? (
        <form
          onSubmit={createPartner}
          className="grid gap-3 rounded-xl border border-admin-border bg-admin-elevated p-5 sm:grid-cols-2"
        >
          <h3 className="sm:col-span-2 text-base font-semibold">Create store owner</h3>
          {[
            ['firstName', 'Owner first name', true],
            ['lastName', 'Last name', false],
            ['email', 'Login email', true],
            ['password', 'Password (optional)', false],
            ['phone', 'Phone', false],
            ['storeName', 'Store name', true],
            ['storeCode', 'Store code', false],
            ['city', 'City', false],
            ['state', 'State', false],
            ['gstin', 'GSTIN', false],
            ['bankAccountName', 'Bank account name', false],
            ['bankAccountNumber', 'Account number', false],
            ['bankIfsc', 'IFSC', false],
            ['bankName', 'Bank name', false],
          ].map(([name, label, required]) => (
            <label key={name} className="block space-y-1 text-sm">
              <span className="text-admin-muted">{label}</span>
              <input
                name={name}
                type={name === 'password' ? 'password' : name === 'email' ? 'email' : 'text'}
                required={required}
                className="h-10 w-full rounded-lg border border-admin-border bg-admin-bg px-3"
              />
            </label>
          ))}
          <label className="sm:col-span-2 block space-y-1 text-sm">
            <span className="text-admin-muted">Address</span>
            <textarea name="address" rows={2} className="w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2" />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" size="sm" disabled={partnerBusy}>
              {partnerBusy ? 'Creating…' : 'Create & email invite'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setPartnerForm(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <AdminCrudPage
        title="Store locations"
        description="Retail / wholesale locations (ERP module). Partner stores above also appear here when synced."
        addLabel="Add store location"
        data={data}
        isLoading={isLoading}
        createMutation={createMutation}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        columns={[
          { accessorKey: 'name', header: 'Store', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
          { accessorKey: 'code', header: 'Code', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'type', header: 'Type', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'city', header: 'City', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'email', header: 'Email', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'managerName', header: 'Manager', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
        ]}
        fields={[
          { name: 'name', label: 'Store name', required: true },
          { name: 'code', label: 'Code' },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { value: 'retail', label: 'Retail' },
              { value: 'wholesale', label: 'Wholesale' },
              { value: 'partner', label: 'Partner' },
              { value: 'flagship', label: 'Flagship' },
              { value: 'pop_up', label: 'Pop-up' },
            ],
          },
          { name: 'city', label: 'City' },
          { name: 'state', label: 'State' },
          { name: 'address', label: 'Address', type: 'textarea' },
          { name: 'managerName', label: 'Manager' },
          { name: 'email', label: 'Email' },
          { name: 'phone', label: 'Phone' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending_verification', label: 'Pending verification' },
              { value: 'pending_approval', label: 'Pending approval' },
            ],
          },
        ]}
        defaults={{
          name: '',
          code: '',
          type: 'partner',
          city: '',
          state: '',
          address: '',
          managerName: '',
          email: '',
          phone: '',
          status: 'active',
        }}
        searchPlaceholder="Search stores…"
      />
    </div>
  )
}
