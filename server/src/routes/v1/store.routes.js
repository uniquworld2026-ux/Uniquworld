const express = require('express');
const erpController = require('../../controllers/erp.controller');
const storePartnerRepository = require('../../repositories/storePartner.repository');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const router = express.Router();

router.get('/products', asyncHandler(async (req, res) => {
  const items = await storePartnerRepository.listPublicProducts({
    storeCode: req.query.store || req.query.storeCode || undefined,
    limit: Number(req.query.limit) || 48,
  });
  return ApiResponse.ok(res, { items });
}));

router.get('/products/:slug', erpController.getPublicStoreProduct);

router.get(
  '/by/:code',
  asyncHandler(async (req, res) => {
    const items = await storePartnerRepository.listPublicProducts({
      storeCode: req.params.code,
      limit: Number(req.query.limit) || 48,
    });
    return ApiResponse.ok(res, { items, storeCode: req.params.code });
  })
);

module.exports = router;
