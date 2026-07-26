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

module.exports = {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  getPublicKey,
  isConfigured,
};
