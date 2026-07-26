import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import {
  STORE_PRODUCT_STATUSES,
  STORE_PRODUCT_STATUS_LABELS,
  generateStoreSku,
  normalizeGallery,
  slugify,
  storeProductDefaults,
  toApiPayload,
  toFormValues,
} from '@/admin/features/stores/storeProductSchema'
import { Input, Textarea, Select, Checkbox } from '@/shared/components/forms/Field'
import { ImageUploadField } from '@/shared/components/forms/ImageUploadField'
import { Button } from '@/shared/components/ui/Button'

const storeHooks = createErpHooks('stores')

/**
 * Dedicated uploader for /store channel products (separate from main Product Management).
 */
export function StoreProductForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save store product',
  isSubmitting = false,
}) {
  const isCreate = !initialValues?.id
  const { data: stores = [] } = storeHooks.useList()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...storeProductDefaults,
      ...toFormValues(initialValues),
      sku: initialValues?.sku || generateStoreSku(initialValues?.name),
      galleryImages: normalizeGallery(initialValues),
    },
  })

  const name = watch('name')
  const imageUrl = watch('imageUrl')
  const galleryImages = watch('galleryImages') || ['', '', '']
  const featured = watch('featured')

  useEffect(() => {
    if (!isCreate || !name) return
    setValue('slug', slugify(name), { shouldValidate: false })
  }, [name, isCreate, setValue])

  function setGalleryImage(index, next) {
    const current = normalizeGallery({ galleryImages })
    const updated = [...current]
    updated[index] = next || ''
    setValue('galleryImages', updated, { shouldDirty: true })
  }

  function handleFormSubmit(values) {
    return onSubmit(toApiPayload(values))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Basic details</h3>
        <p className="mt-1 text-xs text-admin-text-muted">
          These products appear on <span className="font-medium">/store</span> only — not the main gift catalog.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Product name"
              error={errors.name?.message}
              required
              {...register('name', { required: 'Name is required' })}
            />
          </div>
          <Input
            label="Slug"
            hint="Auto-filled from product name"
            error={errors.slug?.message}
            {...register('slug')}
          />
          <Input
            label="SKU"
            hint="Auto-generated"
            className="cursor-not-allowed bg-admin-muted opacity-80"
            readOnly
            {...register('sku')}
          />
          <Select label="Linked store (optional)" {...register('storeId')}>
            <option value="">— All / unassigned —</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code || s.type})
              </option>
            ))}
          </Select>
          <Input label="Category" {...register('category')} />
          <Select label="Status" {...register('status')}>
            {STORE_PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STORE_PRODUCT_STATUS_LABELS[s] || s}
              </option>
            ))}
          </Select>
          <div className="flex items-end pb-1">
            <Checkbox
              label="Featured on /store"
              checked={Boolean(featured)}
              onChange={(e) => setValue('featured', e.target.checked, { shouldDirty: true })}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Pricing & stock</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label="Price (INR)"
            type="number"
            min={0}
            step="0.01"
            error={errors.price?.message}
            {...register('price', { required: 'Price is required' })}
          />
          <Input
            label="Compare at price"
            type="number"
            min={0}
            step="0.01"
            {...register('compareAtPrice')}
          />
          <Input label="Stock" type="number" min={0} {...register('stock')} />
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">About</h3>
        <div className="mt-4 grid gap-4">
          <Textarea label="Description" rows={4} {...register('description')} />
          <Input
            label="Tags"
            hint="Comma-separated (e.g. wholesale, bulk, dealer)"
            {...register('tags')}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Images</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <ImageUploadField
            label="Primary image"
            value={imageUrl}
            onChange={(v) => setValue('imageUrl', v, { shouldDirty: true })}
          />
          <div className="space-y-3">
            <span className="text-xs font-medium text-admin-text-muted">Gallery (up to 3)</span>
            {galleryImages.map((img, i) => (
              <ImageUploadField
                key={i}
                label={`Gallery ${i + 1}`}
                size="sm"
                value={img}
                onChange={(v) => setGalleryImage(i, v)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
