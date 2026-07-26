import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { erpApi } from '@/admin/lib/erpApi'

/**
 * React Query hooks for ERP modules backed by /api/v1/erp/*
 */
export function createErpHooks(moduleKey) {
  const keys = {
    all: ['erp', moduleKey],
    detail: (id) => ['erp', moduleKey, id],
  }

  function useList(params) {
    return useQuery({
      queryKey: [...keys.all, params || {}],
      queryFn: () => erpApi.list(moduleKey, params),
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (payload) => erpApi.create(moduleKey, payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }) => erpApi.update(moduleKey, id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id) => erpApi.remove(moduleKey, id),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  return { keys, useList, useCreate, useUpdate, useRemove }
}

export function useErpCommerceOrders() {
  return useQuery({
    queryKey: ['erp', 'commerce', 'orders'],
    queryFn: () => erpApi.listOrders(),
  })
}

export function useErpPayments() {
  return useQuery({
    queryKey: ['erp', 'commerce', 'payments'],
    queryFn: () => erpApi.listPayments(),
  })
}

export function useErpShipments() {
  return useQuery({
    queryKey: ['erp', 'commerce', 'shipments'],
    queryFn: () => erpApi.listShipments(),
  })
}

export function useErpCustomers() {
  return useQuery({
    queryKey: ['erp', 'commerce', 'customers'],
    queryFn: () => erpApi.listCustomers(),
  })
}
