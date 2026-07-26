import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * React Query hooks factory for a localStorage admin module.
 * @param {string} key
 * @param {{ list: Function, getById: Function, create: Function, update: Function, remove: Function }} store
 */
export function createModuleHooks(key, store) {
  const keys = {
    all: [key],
    detail: (id) => [key, id],
  }

  function useList() {
    return useQuery({
      queryKey: keys.all,
      queryFn: () => store.list(),
    })
  }

  function useDetail(id) {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => store.getById(id),
      enabled: Boolean(id),
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (payload) => store.create(payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }) => store.update(id, data),
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: keys.all })
        qc.invalidateQueries({ queryKey: keys.detail(vars.id) })
      },
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id) => store.remove(id),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  return { keys, useList, useDetail, useCreate, useUpdate, useRemove }
}
