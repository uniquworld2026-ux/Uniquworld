import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/admin/features/products/ProductForm'
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from '@/admin/features/products/useProducts'
import { Button } from '@/shared/components/ui/Button'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { getErrorMessage } from '@/shared/lib/axios'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/admin/features/products/ProductForm'
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from '@/admin/features/products/useProducts'
import { Button } from '@/shared/components/ui/Button'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { getErrorMessage } from '@/shared/lib/axios'

export function ProductCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateProduct()
  const [error, setError] = useState('')

  async function onSubmit(values) {
    setError('')
    try {
      const product = await createMutation.mutateAsync(values)
      navigate('/admin/products', {
        replace: true,
        state: {
          flash: `"${product.name || 'Product'}" created successfully.`,
        },
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create product'))
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header title="Add Product" />
      {error ? (
        <p className="rounded-lg border border-admin-danger/30 bg-admin-danger/10 px-3 py-2 text-sm text-admin-danger">
          {error}
        </p>
      ) : null}
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
  const [error, setError] = useState('')

  async function onSubmit(values) {
    setError('')
    try {
      await updateMutation.mutateAsync({ id, data: values })
      navigate('/admin/products', {
        replace: true,
        state: {
          flash: `"${values.name || 'Product'}" updated successfully.`,
        },
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update product'))
    }
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
      {error ? (
        <p className="rounded-lg border border-admin-danger/30 bg-admin-danger/10 px-3 py-2 text-sm text-admin-danger">
          {error}
        </p>
      ) : null}
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
