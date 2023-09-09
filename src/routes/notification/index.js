const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const notificationController = require("../../controllers/notification.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// authentication //
router.use(authentication);
// ========================

router.get("", asyncHandler(notificationController.listNotiByUser));

module.exports = router;
