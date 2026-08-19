const crypto = require('crypto');
const Razorpay = require('razorpay');
const config = require('../config');
const ApiError = require('../utils/ApiError');

let client = null;

const getClient = () => {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw ApiError.badRequest(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    );
  }
  if (!client) {
    client = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return client;
};

const createOrder = async ({ amountPaise, receipt, notes = {} }) => {
  const rzp = getClient();
  return rzp.orders.create({
    amount: amountPaise,
    currency: config.commerce.currency || 'INR',
    receipt,
    notes,
  });
};

const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body)
    .digest('hex');
  return expected === razorpaySignature;
};

const verifyWebhookSignature = (rawBody, signature) => {
  if (!config.razorpay.webhookSecret) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
};

const getPublicKey = () => config.razorpay.keyId || null;

const isConfigured = () => Boolean(config.razorpay.keyId && config.razorpay.keySecret);

const fetchOrder = async (razorpayOrderId) => {
  if (!razorpayOrderId) return null;
  return getClient().orders.fetch(razorpayOrderId);
};

const fetchOrderPayments = async (razorpayOrderId) => {
  if (!razorpayOrderId) return [];
  const data = await getClient().orders.fetchPayments(razorpayOrderId);
  return data?.items || [];
};

/** Inspect Razorpay order: captured payment vs failed-only vs still open. */
const inspectOrder = async (razorpayOrderId) => {
  const rzpOrder = await fetchOrder(razorpayOrderId);
  const payments = await fetchOrderPayments(razorpayOrderId);
  const captured = payments.find((p) => p.status === 'captured' || p.status === 'authorized') || null;
  const inProgress = payments.some((p) => ['created', 'authorized'].includes(p.status));
  const failedOnly =
    payments.length > 0 &&
    payments.every((p) => p.status === 'failed') &&
    !inProgress &&
    rzpOrder?.status !== 'paid';
  return {
    rzpOrder,
    payments,
    captured,
    failedOnly,
    isPaid: Boolean(captured) || rzpOrder?.status === 'paid',
  };
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchOrder,
  fetchOrderPayments,
  inspectOrder,
  getPublicKey,
  isConfigured,
};
