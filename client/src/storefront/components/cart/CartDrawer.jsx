import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/storefront/hooks/useCart'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

export function CartDrawer() {
  const { items, count, subtotal, removeItem, updateQty, isOpen, closeCart } = useCart()

  useEffect(() => {
    if (!isOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close bag"
        className={cn(
          'absolute inset-0 bg-[var(--hm-overlay)] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-hm-elevated shadow-hm-card transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-hm-border px-5 py-4">
          <div>
            <p className="font-display text-2xl text-hm-text">Your bag</p>
            <p className="text-xs text-hm-text-muted">
              {count ? `${count} item${count === 1 ? '' : 's'}` : 'Empty'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-hm-text hover:bg-hm-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!count ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-hm-border bg-hm-bg px-6 text-center">
              <ShoppingBag className="h-8 w-8 text-hm-accent" />
              <p className="mt-4 text-sm text-hm-text-muted">No items yet.</p>
              <Link to="/categories" onClick={closeCart} className="mt-6 inline-block">
                <Button variant="primary">Shop gifts</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex gap-3 rounded-2xl border border-hm-border bg-hm-bg p-3"
                >
                  <Link
                    to={`/products/${item.id}`}
                    onClick={closeCart}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-hm-muted"
                  >
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.id}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium text-hm-text hover:text-hm-accent"
                    >
                      {item.name}
                    </Link>
                    {item.meta?.optionType === 'customized' ? (
                      <span className="mt-1 inline-flex rounded-md bg-hm-primary/10 px-2 py-0.5 text-[11px] font-semibold text-hm-primary">
                        Customized
                      </span>
                    ) : null}
                    {(item.meta?.customText || item.meta?.photoDataUrl) && (
                      <div className="mt-1.5 flex items-start gap-2">
                        {item.meta.photoDataUrl ? (
                          <img
                            src={item.meta.photoDataUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded object-cover"
                          />
                        ) : null}
                        <div className="min-w-0">
                          {item.meta.customText ? (
                            <p className="line-clamp-2 text-xs text-hm-accent">
                              Text: {item.meta.customText}
                            </p>
                          ) : null}
                          {item.meta.photoName ? (
                            <p className="truncate text-[11px] text-hm-text-muted">
                              Photo: {item.meta.photoName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-hm-text-muted">{formatCurrency(item.price)} each</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg border border-hm-border bg-hm-elevated">
                        <button
                          type="button"
                          className="inline-flex min-h-11 min-w-11 items-center justify-center"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          type="button"
                          className="inline-flex min-h-11 min-w-11 items-center justify-center"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label="Remove"
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-hm-text-muted hover:text-hm-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count ? (
          <div className="border-t border-hm-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-hm-text-muted">Subtotal</p>
              <p className="text-lg font-semibold text-hm-text">{formatCurrency(subtotal)}</p>
            </div>
            <Link to="/checkout" onClick={closeCart} className="mt-4 block">
              <Button variant="primary" className="w-full" size="lg">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
