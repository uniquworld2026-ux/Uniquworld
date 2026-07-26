import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function lineKey(product) {
  const meta = product.meta ? JSON.stringify(product.meta) : ''
  return `${product.id}::${meta}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [toast, setToast] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((v) => !v), [])

  const showToast = useCallback((message) => {
    setToast(message)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const addItem = useCallback(
    (product, qty = 1, { open = true } = {}) => {
      const addQty = Number(qty) > 0 ? Number(qty) : product.qty || 1
      const key = lineKey(product)

      setItems((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: i.qty + addQty, price: product.price ?? i.price } : i,
          )
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
            tag: product.tag,
            meta: product.meta,
            qty: addQty,
          },
        ]
      })
      showToast(`Added “${product.name}” to bag`)
      if (open) setIsOpen(true)
    },
    [showToast],
  )

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      toast,
      clearToast: () => setToast(null),
    }),
    [
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      toast,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
