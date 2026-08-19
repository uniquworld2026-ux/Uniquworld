/** Matches server pricing.service.js defaults */
export const ORDER_PRICING = {
  platformFeeFlat: 5,
  defaultShippingAmount: 49,
  freeShippingMin: 999,
}

export function calcOrderTotals(subtotal) {
  const sub = Math.round((Number(subtotal) || 0) * 100) / 100
  const platformFeeAmount = ORDER_PRICING.platformFeeFlat
  const shippingAmount =
    sub >= ORDER_PRICING.freeShippingMin ? 0 : ORDER_PRICING.defaultShippingAmount
  const totalAmount = Math.round((sub + platformFeeAmount + shippingAmount) * 100) / 100

  return {
    subtotal: sub,
    platformFeeAmount,
    shippingAmount,
    totalAmount,
  }
}

export function calcCartTotals(items = []) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || item.quantity || 1),
    0,
  )
  return calcOrderTotals(subtotal)
}
