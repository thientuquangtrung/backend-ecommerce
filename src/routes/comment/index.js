const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get("", asyncHandler(commentController.getCommentsByParentId));

// authentication //
router.use(authentication);
// ========================

router.post("", asyncHandler(commentController.createComment));
router.delete("", asyncHandler(commentController.deleteComment));

module.exports = router;
