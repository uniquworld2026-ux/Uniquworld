export { cn } from '@/shared/utils/cn'

/**
 * Format currency (INR by default for Uniquworld).
 * @param {number} amount
 * @param {string} [currency='INR']
 */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Delay helper for skeletons / demos.
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
