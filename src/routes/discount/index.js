const express = require('express');
const asyncHandler  = require('../../helpers/asyncHandler');
const discountController = require('../../controllers/discount.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/products_by_discount', asyncHandler(discountController.getProductByDiscountCode))

// authentication //
router.use(authentication)
// ========================

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodeByShop))

module.exports = router;