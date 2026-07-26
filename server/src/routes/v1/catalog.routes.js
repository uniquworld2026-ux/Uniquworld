const express = require('express');
const erpController = require('../../controllers/erp.controller');

const router = express.Router();

router.get('/products', erpController.listPublicCatalogProducts);
router.get('/products/:idOrSlug', erpController.getPublicCatalogProduct);
router.get('/categories', erpController.listPublicCatalogCategories);

module.exports = router;
