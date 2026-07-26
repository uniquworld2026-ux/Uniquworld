import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/admin/features/products/ProductForm'
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from '@/admin/features/products/useProducts'
import { Button } from '@/shared/components/ui/Button'
import { Skeleton } from '@/shared/components/ui/Skeleton'

export function ProductCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateProduct()

  async function onSubmit(values) {
    const product = await createMutation.mutateAsync(values)
    navigate(`/admin/products/${product.id}/edit`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header title="Add Product" />
      <ProductForm
        onSubmit={onSubmit}
        submitLabel="Create product"
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useProduct(id)
  const updateMutation = useUpdateProduct()

  async function onSubmit(values) {
    await updateMutation.mutateAsync({ id, data: values })
    navigate('/admin/products')
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
        <p className="text-admin-text">Product not found.</p>
        <Link to="/admin/products" className="mt-4 inline-block text-sm text-admin-accent">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header title={`Edit · ${data.name}`} />
      <ProductForm
        initialValues={data}
        onSubmit={onSubmit}
        submitLabel="Update product"
        isSubmitting={updateMutation.isPending}
      />
    </div>
  )
}

function Header({ title }) {
  return (
    <div className="flex items-center gap-3">
      <Link to="/admin/products">
        <Button variant="ghost" size="icon" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text">{title}</h2>
        <p className="text-sm text-admin-text-muted">Catalog · Product Management</p>
      </div>
    </div>
  )
}
