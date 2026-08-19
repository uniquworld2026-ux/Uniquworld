const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const razorpayService = require('../services/razorpay.service');
const orderService = require('../services/order.service');
const orderRepository = require('../repositories/order.repository');

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
    if (!razorpayService.verifyWebhookSignature(raw, signature)) {
      throw ApiError.unauthorized('Invalid Razorpay webhook signature');
    }

    const event = JSON.parse(raw.toString('utf8'));
    const type = event.event;
    const paymentEntity = event.payload?.payment?.entity;
    const razorpayOrderId = paymentEntity?.order_id;
    if (!razorpayOrderId) {
      return ApiResponse.ok(res, { ignored: true }, 'No order id on event');
    }

    const localPayment = await orderRepository.findPaymentByGatewayOrderId(razorpayOrderId);
    if (!localPayment?.orderId) {
      logger.warn('Razorpay webhook: payment row not found', { razorpayOrderId, type });
      return ApiResponse.ok(res, { ignored: true }, 'Order payment not found');
    }

    const order = await orderRepository.findById(localPayment.orderId);
    if (!order) return ApiResponse.ok(res, { ignored: true }, 'Order not found');

    if (type === 'payment.captured' || type === 'order.paid') {
      await orderService.fulfillPaidOrder(order, {
        razorpayOrderId,
        razorpayPaymentId: paymentEntity?.id,
        extraMeta: { syncedFrom: 'webhook', event: type },
      });
    } else if (type === 'payment.failed') {
      await orderService.reconcileOrderPayment(order, { allowStaleFail: true });
    }

    return ApiResponse.ok(res, { handled: type }, 'Webhook processed');
  })
);

module.exports = router;
