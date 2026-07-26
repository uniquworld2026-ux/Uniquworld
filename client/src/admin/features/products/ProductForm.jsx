import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  calcCustomerProfit,
  calcOfferPercent,
  calcProfit,
  compactGalleryImages,
  generateSku,
  normalizeCategories,
  normalizeGalleryImages,
  productDefaults,
  productSchema,
  slugify,
} from '@/admin/features/products/productSchema'
import { listCategories } from '@/admin/features/categories/categoryStore'
import { Input, Textarea, Select, Checkbox, Radio } from '@/shared/components/forms/Field'
import { ImageUploadField } from '@/shared/components/forms/ImageUploadField'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

/**
 * @param {{
 *   initialValues?: object
 *   onSubmit: (values: object) => Promise<void> | void
 *   submitLabel?: string
 *   isSubmitting?: boolean
 * }} props
 */
export function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save product',
  isSubmitting = false,
}) {
  const isCreate = !initialValues?.id
  const categories = listCategories()
    .filter((c) => !c.status || c.status === 'published' || c.status === 'active')
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...productDefaults,
      ...initialValues,
      sku: initialValues?.sku || generateSku(initialValues?.name),
      categories: normalizeCategories(initialValues),
      category: normalizeCategories(initialValues)[0] || '',
      galleryImages: normalizeGalleryImages(initialValues),
      productCost: initialValues?.productCost ?? initialValues?.cost ?? '',
      customizationEnabled:
        typeof initialValues?.customizationEnabled === 'boolean'
          ? initialValues.customizationEnabled
          : Boolean(initialValues?.customizedPrice),
      status:
        initialValues?.status === 'active'
          ? 'published'
          : initialValues?.status || productDefaults.status,
    },
  })

  const name = watch('name')
  const imageUrl = watch('imageUrl')
  const galleryImages = watch('galleryImages') || ['', '', '']
  const selectedCategories = watch('categories') || []
  const price = watch('price')
  const compareAtPrice = watch('compareAtPrice')
  const customizationEnabled = watch('customizationEnabled')
  const customizedPrice = watch('customizedPrice')
  const customizedMarketAtPrice = watch('customizedMarketAtPrice')
  const productCost = watch('productCost')
  const serviceCost = watch('serviceCost')

  function toggleCategory(name) {
    const next = selectedCategories.includes(name)
      ? selectedCategories.filter((c) => c !== name)
      : [...selectedCategories, name]
    setValue('categories', next, { shouldValidate: true, shouldDirty: true })
    setValue('category', next[0] || '', { shouldValidate: false })
  }

  function handleFormSubmit(values) {
    const cats = normalizeCategories(values)
    const enabled = Boolean(values.customizationEnabled)
    return onSubmit({
      ...values,
      categories: cats,
      category: cats[0] || '',
      galleryImages: compactGalleryImages(values),
      customizationEnabled: enabled,
      ...(enabled
        ? {}
        : {
            customizedPrice: '',
            customizedMarketAtPrice: '',
            customizedOfferPercent: '',
            deliveryDaysCustomized: 0,
          }),
    })
  }

  function setGalleryImage(index, next) {
    const current = normalizeGalleryImages({ galleryImages })
    const updated = [...current]
    updated[index] = next || ''
    setValue('galleryImages', updated, { shouldValidate: true, shouldDirty: true })
  }

  function setCustomizationEnabled(enabled) {
    setValue('customizationEnabled', enabled, { shouldValidate: true, shouldDirty: true })
    if (!enabled) {
      setValue('customizedPrice', '', { shouldDirty: true })
      setValue('customizedMarketAtPrice', '', { shouldDirty: true })
      setValue('customizedOfferPercent', '', { shouldDirty: true })
    }
  }

  useEffect(() => {
    if (!isCreate || !name) return
    setValue('slug', slugify(name), { shouldValidate: false })
  }, [name, isCreate, setValue])

  useEffect(() => {
    setValue('offerPercent', calcOfferPercent(price, compareAtPrice), { shouldValidate: false })
  }, [price, compareAtPrice, setValue])

  useEffect(() => {
    setValue(
      'customizedOfferPercent',
      calcOfferPercent(customizedPrice, customizedMarketAtPrice),
      { shouldValidate: false },
    )
  }, [customizedPrice, customizedMarketAtPrice, setValue])

  useEffect(() => {
    const { marginCost, marginPercent } = calcProfit(price, productCost, serviceCost)
    setValue('profitMarginCost', marginCost, { shouldValidate: false })
    setValue('profitMarginPercent', marginPercent, { shouldValidate: false })
    if (productCost !== '' && productCost != null) {
      setValue('cost', productCost, { shouldValidate: false })
    }
  }, [price, productCost, serviceCost, setValue])

  useEffect(() => {
    const { marginCost, marginPercent } = calcCustomerProfit(price, compareAtPrice)
    setValue('customerProfitMarginCost', marginCost, { shouldValidate: false })
    setValue('customerProfitMarginPercent', marginPercent, { shouldValidate: false })
  }, [price, compareAtPrice, setValue])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Basic details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Product name" error={errors.name?.message} {...register('name')} />
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
            error={errors.sku?.message}
            readOnly
            className="cursor-not-allowed bg-admin-muted opacity-80"
            {...register('sku')}
          />
          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-admin-text-muted">Categories</span>
            <div
              className={cn(
                'mt-1.5 grid gap-2 rounded-lg border border-admin-border bg-admin-elevated p-3 sm:grid-cols-2',
                errors.categories && 'border-admin-danger',
              )}
            >
              {categories.length === 0 ? (
                <p className="text-sm text-admin-text-muted sm:col-span-2">
                  No published categories yet. Add some under Categories first.
                </p>
              ) : (
                categories.map((c) => (
                  <Checkbox
                    key={c.id}
                    label={c.name}
                    checked={selectedCategories.includes(c.name)}
                    onChange={() => toggleCategory(c.name)}
                  />
                ))
              )}
            </div>
            {errors.categories?.message ? (
              <p className="mt-1.5 text-xs text-admin-danger">{errors.categories.message}</p>
            ) : (
              <p className="mt-1.5 text-xs text-admin-text-muted">Select one or more categories</p>
            )}
          </div>
          <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PRODUCT_STATUS_LABELS[s] || s}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">About the product</h3>
        <div className="mt-4 grid gap-4">
          <Textarea
            label="Description"
            error={errors.description?.message}
            rows={4}
            {...register('description')}
          />
          <Textarea
            label="Instruction"
            error={errors.instruction?.message}
            rows={4}
            placeholder="Care tips, usage notes, personalization guidelines…"
            {...register('instruction')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Rating"
              type="number"
              step="0.1"
              min={1}
              max={5}
              hint="Manual rating shown on shop (1–5)"
              error={errors.rating?.message}
              {...register('rating')}
            />
            <Input
              label="Reviews"
              type="number"
              min={0}
              hint="Manual review count shown on shop"
              error={errors.reviewCount?.message}
              {...register('reviewCount')}
            />
          </div>
          <div className="rounded-xl border border-admin-border bg-admin-muted/40 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-admin-text-muted">
              Delivery info
            </h4>
            <p className="mt-1 text-sm font-medium text-admin-text">Timeline</p>
            <div
              className={cn(
                'mt-3 grid gap-4',
                customizationEnabled ? 'sm:grid-cols-2' : 'sm:grid-cols-1 max-w-xs',
              )}
            >
              <Input
                label="Product (days)"
                type="number"
                min={0}
                hint="Standard delivery timeline"
                error={errors.deliveryDaysProduct?.message}
                {...register('deliveryDaysProduct')}
              />
              {customizationEnabled ? (
                <Input
                  label="Customized product (days)"
                  type="number"
                  min={0}
                  hint="Personalized / made-to-order timeline"
                  error={errors.deliveryDaysCustomized?.message}
                  {...register('deliveryDaysCustomized')}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Pricing & inventory</h3>
        <div className="mt-4 space-y-5">
          <fieldset className="rounded-xl border border-admin-border bg-admin-muted/40 p-4">
            <legend className="px-1 text-sm font-medium text-admin-text">
              Customized product applied?
            </legend>
            <p className="mt-1 text-xs text-admin-text-muted">
              Choose Yes to sell a customized option. Choose No for product sell only.
            </p>
            <div className="mt-3 flex flex-wrap gap-6">
              <Radio
                name="customizationEnabled"
                label="Yes — with customization"
                checked={customizationEnabled === true}
                onChange={() => setCustomizationEnabled(true)}
              />
              <Radio
                name="customizationEnabled"
                label="No — product sell only"
                checked={customizationEnabled === false}
                onChange={() => setCustomizationEnabled(false)}
              />
            </div>
          </fieldset>

          <div className="rounded-xl border border-admin-border bg-admin-muted/40 p-4">
            <h4 className="text-sm font-medium text-admin-text">Product</h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                error={errors.price?.message}
                {...register('price')}
              />
              <Input
                label="Market at price (₹)"
                type="number"
                step="0.01"
                error={errors.compareAtPrice?.message}
                {...register('compareAtPrice')}
              />
              <Input
                label="Offer %"
                type="number"
                step="0.1"
                hint="Auto from price vs market"
                readOnly
                className="cursor-not-allowed bg-admin-elevated opacity-80"
                error={errors.offerPercent?.message}
                {...register('offerPercent')}
              />
            </div>
          </div>

          {customizationEnabled ? (
            <div className="rounded-xl border border-admin-border bg-admin-muted/40 p-4">
              <h4 className="text-sm font-medium text-admin-text">Customized product</h4>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <Input
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  error={errors.customizedPrice?.message}
                  {...register('customizedPrice')}
                />
                <Input
                  label="Market at price (₹)"
                  type="number"
                  step="0.01"
                  error={errors.customizedMarketAtPrice?.message}
                  {...register('customizedMarketAtPrice')}
                />
                <Input
                  label="Offer %"
                  type="number"
                  step="0.1"
                  hint="Auto from price vs market"
                  readOnly
                  className="cursor-not-allowed bg-admin-elevated opacity-80"
                  error={errors.customizedOfferPercent?.message}
                  {...register('customizedOfferPercent')}
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Min order quantity"
              type="number"
              min={1}
              error={errors.minOrderQty?.message}
              {...register('minOrderQty')}
            />
            <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
            <Input
              label="Weight (grams)"
              type="number"
              error={errors.weightGrams?.message}
              {...register('weightGrams')}
            />
          </div>

          <div className="rounded-xl border border-admin-border bg-admin-muted/40 p-4">
            <h4 className="text-sm font-medium text-admin-text">Internal purpose</h4>
            <p className="mt-1 text-xs text-admin-text-muted">
              Product margin = sell price − (product cost + service cost). Customer margin =
              market price − sell price.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Input
                label="Product cost (₹)"
                type="number"
                step="0.01"
                error={errors.productCost?.message}
                {...register('productCost')}
              />
              <Input
                label="Service cost (₹)"
                type="number"
                step="0.01"
                error={errors.serviceCost?.message}
                {...register('serviceCost')}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Product profit margin (₹)"
                type="number"
                step="0.01"
                hint="Auto from sell − costs"
                readOnly
                className="cursor-not-allowed bg-admin-elevated opacity-80"
                error={errors.profitMarginCost?.message}
                {...register('profitMarginCost')}
              />
              <Input
                label="Product profit margin %"
                type="number"
                step="0.1"
                hint="Auto from sell − costs"
                readOnly
                className="cursor-not-allowed bg-admin-elevated opacity-80"
                error={errors.profitMarginPercent?.message}
                {...register('profitMarginPercent')}
              />
              <Input
                label="Customer profit margin (₹)"
                type="number"
                step="0.01"
                hint="Auto from market − sell"
                readOnly
                className="cursor-not-allowed bg-admin-elevated opacity-80"
                error={errors.customerProfitMarginCost?.message}
                {...register('customerProfitMarginCost')}
              />
              <Input
                label="Customer profit margin %"
                type="number"
                step="0.1"
                hint="Auto from market − sell"
                readOnly
                className="cursor-not-allowed bg-admin-elevated opacity-80"
                error={errors.customerProfitMarginPercent?.message}
                {...register('customerProfitMarginPercent')}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Checkbox label="Featured" {...register('featured')} />
            <Checkbox label="Trending" {...register('trending')} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin sm:p-6">
        <h3 className="text-sm font-semibold text-admin-text">Media & SEO</h3>
        <p className="mt-1 text-xs text-admin-text-muted">
          Images and meta tags used for search engines and product discovery.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ImageUploadField
              label="Main image"
              value={imageUrl || ''}
              error={errors.imageUrl?.message}
              onChange={(next) =>
                setValue('imageUrl', next, { shouldValidate: true, shouldDirty: true })
              }
            />
            <div>
              <span className="text-xs font-medium text-admin-text-muted">
                Additional images (up to 3)
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-2 sm:gap-3">
                {[0, 1, 2].map((index) => (
                  <ImageUploadField
                    key={index}
                    size="sm"
                    label={`Gallery ${index + 1}`}
                    value={galleryImages[index] || ''}
                    error={
                      Array.isArray(errors.galleryImages)
                        ? errors.galleryImages[index]?.message
                        : undefined
                    }
                    onChange={(next) => setGalleryImage(index, next)}
                  />
                ))}
              </div>
              {typeof errors.galleryImages?.message === 'string' ? (
                <p className="mt-1.5 text-xs text-admin-danger">{errors.galleryImages.message}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label="Meta title"
              hint="Shown in search results (max 70 characters)"
              error={errors.seoTitle?.message}
              {...register('seoTitle')}
            />
            <Textarea
              label="Meta description"
              hint="Shown in search results (max 160 characters)"
              error={errors.seoDescription?.message}
              rows={4}
              {...register('seoDescription')}
            />
            <Input
              label="Meta keywords"
              hint="Comma-separated keywords for SEO"
              placeholder="Uniquworld gifts, personalized tray, walnut decor"
              error={errors.seoKeywords?.message}
              {...register('seoKeywords')}
            />
            <Input
              label="Meta tags"
              hint="Comma-separated tags for discovery and filtering"
              placeholder="gifts, home, walnut, brass"
              error={errors.seoMetaTags?.message}
              {...register('seoMetaTags')}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
