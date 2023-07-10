const express = require('express');
const asyncHandler  = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:productId', asyncHandler(productController.findProduct))

// authentication //
router.use(authentication)
// ========================

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router;