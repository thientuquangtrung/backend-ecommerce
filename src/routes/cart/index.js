const express = require('express');
const asyncHandler  = require('../../helpers/asyncHandler');
const cartController = require('../../controllers/cart.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.post('', asyncHandler(cartController.addToCart))
router.get('', asyncHandler(cartController.listCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))

module.exports = router;