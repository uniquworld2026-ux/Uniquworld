import { createLocalStore } from '@/admin/lib/createLocalStore'

export const categorySeed = [
  {
    id: 'cat_1',
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Handcrafted pieces for living spaces',
    status: 'published',
    productCount: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '2026-07-10T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'cat_2',
    name: 'Corporate Gifts',
    slug: 'corporate-gifts',
    description: 'Premium gifting for teams and clients',
    status: 'published',
    productCount: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '2026-07-08T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'cat_3',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    description: 'Custom monograms and keepsakes',
    status: 'published',
    productCount: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '2026-06-20T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'cat_4',
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Artisan jewellery and accessories',
    status: 'published',
    productCount: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '2026-05-14T10:00:00.000Z',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
]

export const categoryStore = createLocalStore('hm_admin_categories_v2', categorySeed, 'cat')

export const categoryImportHeaders = [
  { key: 'name', label: 'name' },
  { key: 'slug', label: 'slug' },
  { key: 'description', label: 'description' },
  { key: 'status', label: 'status' },
  { key: 'imageUrl', label: 'imageUrl' },
]

export const categoryImportSampleRows = [
  {
    name: 'Festive Hampers',
    slug: 'festive-hampers',
    description: 'Curated hampers for festive gifting.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
  },
]

export const listCategories = () => categoryStore.list()
export const getCategoryById = (id) => categoryStore.getById(id)
export const createCategory = (payload) => categoryStore.create(payload)
export const updateCategory = (id, payload) => categoryStore.update(id, payload)
export const deleteCategory = (id) => categoryStore.remove(id)

export function bulkImportCategories(rows) {
  return rows.map((row) =>
    categoryStore.create({
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      status: row.status || 'published',
      productCount: 0,
      imageUrl: row.imageUrl || '',
    }),
  )
}
