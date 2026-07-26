import { erpApi } from '@/admin/lib/erpApi'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function listCategories() {
  return erpApi.list('categories')
}

export async function getCategoryById(id) {
  return erpApi.get('categories', id)
}

export async function createCategory(payload) {
  const item = await erpApi.create('categories', {
    ...payload,
    slug: payload.slug || slugify(payload.name),
    sortOrder: Number(payload.sortOrder) || 0,
  })
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return item
}

export async function updateCategory(id, payload) {
  const item = await erpApi.update('categories', id, {
    ...payload,
    slug: payload.slug || slugify(payload.name),
    sortOrder: Number(payload.sortOrder) || 0,
  })
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return item
}

export async function deleteCategory(id) {
  await erpApi.remove('categories', id)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return true
}

/** @deprecated empty — categories are API-backed */
export const categorySeed = []

export const categoryStore = {
  list: listCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  remove: deleteCategory,
}
