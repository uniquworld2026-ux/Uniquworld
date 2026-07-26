import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StoreProductForm } from '@/admin/features/stores/StoreProductForm'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { erpApi } from '@/admin/lib/erpApi'
import { Button } from '@/shared/components/ui/Button'
import { Skeleton } from '@/shared/components/ui/Skeleton'

const hooks = createErpHooks('store-products')

export function StoreProductCreatePage() {
  const navigate = useNavigate()
  const createMutation = hooks.useCreate()

  async function onSubmit(values) {
    const product = await createMutation.mutateAsync(values)
    navigate(`/admin/store-products/${product.id}/edit`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header title="Upload store product" />
      <StoreProductForm
        onSubmit={onSubmit}
        submitLabel="Create store product"
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}

export function StoreProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const updateMutation = hooks.useUpdate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['erp', 'store-products', id],
    queryFn: () => erpApi.get('store-products', id),
    enabled: Boolean(id),
  })

  async function onSubmit(values) {
    await updateMutation.mutateAsync({ id, data: values })
    navigate('/admin/store-products')
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-dashed border-admin-border bg-admin-elevated p-10 text-center">
        <p className="text-admin-text">Store product not found.</p>
        <Link to="/admin/store-products" className="mt-4 inline-block text-sm text-admin-accent">
          Back to store products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header title={`Edit · ${data.name}`} />
      <StoreProductForm
        initialValues={data}
        onSubmit={onSubmit}
        submitLabel="Update store product"
        isSubmitting={updateMutation.isPending}
      />
    </div>
  )
}

function Header({ title }) {
  return (
    <div className="flex items-center gap-3">
      <Link to="/admin/store-products">
        <Button variant="ghost" size="icon" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text">{title}</h2>
        <p className="text-sm text-admin-text-muted">Catalog · Store Products (separate from main catalog)</p>
      </div>
    </div>
  )
}
