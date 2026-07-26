import { Check, ShoppingBag } from 'lucide-react'
import { useCart } from '@/storefront/hooks/useCart'

export function CartToast() {
  const { toast } = useCart()

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-hm-border bg-hm-elevated px-4 py-3 shadow-hm-card">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hm-success/15 text-hm-success">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-hm-text">{toast}</p>
        <ShoppingBag className="h-4 w-4 text-hm-accent" />
      </div>
    </div>
  )
}
