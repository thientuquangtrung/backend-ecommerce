const { CREATED, OK } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
    createComment = async (req, res, next) => {
        new CREATED({
            message: "Create a comment successfully",
            metadata: await CommentService.createComment(req.body),
        }).send(res);
    };

    getCommentsByParentId = async (req, res, next) => {
        new OK({
            message: "Get list of comments",
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    };

    deleteComment = async (req, res, next) => {
        new OK({
            message: "Delete a comment successfully",
            metadata: await CommentService.deleteComment(req.body),
        }).send(res);
    };
}

module.exports = new CommentController();
