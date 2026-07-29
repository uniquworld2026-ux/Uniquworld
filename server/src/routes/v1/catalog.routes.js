const express = require('express');
const erpController = require('../../controllers/erp.controller');

const router = express.Router();

router.get('/products', erpController.listPublicCatalogProducts);
router.get('/products/:idOrSlug/reviews', erpController.listPublicCatalogProductReviews);
router.get('/products/:idOrSlug', erpController.getPublicCatalogProduct);
router.get('/categories', erpController.listPublicCatalogCategories);
router.get('/reviews', erpController.listPublicCatalogReviews);

module.exports = router;
