const express = require('express');
const asyncHandler  = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication //
router.use(authentication)
// ========================

router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/handle_refresh_token', asyncHandler(accessController.handleRefreshToken))

module.exports = router;