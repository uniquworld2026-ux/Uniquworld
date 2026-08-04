import { useEffect, useState } from 'react'
import { storePartnerAdminApi } from '@/admin/lib/erpApi'
import { Button } from '@/shared/components/ui/Button'
import { StatusBadge } from '@/admin/components/crud/AdminCrudPage'
import { getErrorMessage } from '@/shared/lib/axios'

export function StoreWithdrawalsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    storePartnerAdminApi
      .listWithdrawals()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function setStatus(id, status) {
    try {
      await storePartnerAdminApi.updateWithdrawal(id, { status })
      load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">Store withdrawals</h1>
        <p className="text-sm text-admin-muted">
          Pay store owners to their bank account after delivered-order earnings.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-admin-muted">Loading…</p> : null}
      <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-admin-border text-xs uppercase text-admin-muted">
            <tr>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((w) => (
              <tr key={w.id} className="border-b border-admin-border/60">
                <td className="px-4 py-3">{w.storeName}</td>
                <td className="px-4 py-3 font-medium">₹{Number(w.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-admin-muted">
                  {w.bankName || '—'} · {w.bankAccountNumber || '—'} · {w.bankIfsc || '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={w.status} />
                </td>
                <td className="px-4 py-3 text-admin-muted">
                  {w.createdAt ? new Date(w.createdAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {w.status === 'pending' ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setStatus(w.id, 'processing')}>
                        Process
                      </Button>
                      <Button size="sm" onClick={() => setStatus(w.id, 'paid')}>
                        Mark paid
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setStatus(w.id, 'rejected')}>
                        Reject
                      </Button>
                    </>
                  ) : null}
                  {w.status === 'processing' ? (
                    <Button size="sm" onClick={() => setStatus(w.id, 'paid')}>
                      Mark paid
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
            {!loading && !items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-admin-muted">
                  No withdrawal requests.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
