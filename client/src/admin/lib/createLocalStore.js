/**
 * Generic localStorage CRUD store for admin modules.
 * @param {string} storageKey
 * @param {object[]} seed
 * @param {string} [idPrefix='row']
 */
export function createLocalStore(storageKey, seed, idPrefix = 'row') {
  function readStore() {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) {
        localStorage.setItem(storageKey, JSON.stringify(seed))
        return [...seed]
      }
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [...seed]
    } catch {
      return [...seed]
    }
  }

  function writeStore(rows) {
    localStorage.setItem(storageKey, JSON.stringify(rows))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hm-catalog-changed'))
    }
    return rows
  }

  return {
    list() {
      return readStore().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    },
    getById(id) {
      return readStore().find((r) => r.id === id) ?? null
    },
    create(payload) {
      const rows = readStore()
      const now = new Date().toISOString()
      const row = {
        ...payload,
        id: `${idPrefix}_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }
      writeStore([row, ...rows])
      return row
    },
    update(id, payload) {
      const rows = readStore()
      const index = rows.findIndex((r) => r.id === id)
      if (index === -1) throw new Error('Record not found')
      const updated = {
        ...rows[index],
        ...payload,
        id,
        updatedAt: new Date().toISOString(),
      }
      rows[index] = updated
      writeStore(rows)
      return updated
    },
    remove(id) {
      writeStore(readStore().filter((r) => r.id !== id))
      return true
    },
    reset() {
      writeStore(seed)
      return [...seed]
    },
  }
}
