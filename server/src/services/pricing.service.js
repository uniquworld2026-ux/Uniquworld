const config = require('../config');

/** Flipkart / Meesho style order totals — product + flat platform fee + shipping. */
function calcOrderTotals(subtotal) {
  const sub = Math.round((Number(subtotal) || 0) * 100) / 100;
  const platformFeeAmount = config.commerce.platformFeeFlat;
  const shippingAmount =
    sub >= config.commerce.freeShippingMin ? 0 : config.commerce.defaultShippingAmount;
  const taxAmount = 0;
  const discountAmount = 0;
  const totalAmount =
    Math.round((sub + platformFeeAmount + shippingAmount + taxAmount - discountAmount) * 100) /
    100;

  return {
    subtotal: sub,
    platformFeeAmount,
    shippingAmount,
    taxAmount,
    discountAmount,
    totalAmount,
    freeShippingMin: config.commerce.freeShippingMin,
    codEnabled: config.commerce.codEnabled,
  };
}

module.exports = {
  calcOrderTotals,
};
