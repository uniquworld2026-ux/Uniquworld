const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { optionalAuthenticate } = require('../../middlewares/auth.middleware');
const digitalSurpriseController = require('../../controllers/digitalSurprise.controller');
const {
  createDigitalSurpriseSchema,
  verifyDigitalPaymentSchema,
} = require('../../validators/digitalSurprise.validator');

const router = express.Router();

router.get('/occasions', digitalSurpriseController.listOccasions);
router.get('/s/:slug', digitalSurpriseController.getBySlug);

router.post(
  '/',
  optionalAuthenticate,
  validate(createDigitalSurpriseSchema),
  digitalSurpriseController.create
);

router.post('/:id/checkout', digitalSurpriseController.checkout);
router.post(
  '/:id/verify-payment',
  validate(verifyDigitalPaymentSchema),
  digitalSurpriseController.verifyPayment
);
router.post('/:id/preview', digitalSurpriseController.preview);

module.exports = router;
