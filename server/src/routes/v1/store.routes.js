const express = require('express');
const erpController = require('../../controllers/erp.controller');

const router = express.Router();

router.get('/products', erpController.listPublicStoreProducts);
router.get('/products/:slug', erpController.getPublicStoreProduct);

module.exports = router;
