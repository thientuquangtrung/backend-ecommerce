const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { parseObjectIdMongodb } = require("../utils");
const { findProduct } = require("./product.service");

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {
        const comment = new commentModel({
            comment_content: content,
            comment_productId: productId,
            comment_userId: userId,
            comment_parentId: parentCommentId,
        });

        let rightValue;
        if (parentCommentId) {
            // reply comment
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError(`Comment not found!`);

            rightValue = parentComment.comment_right;

            await commentModel.updateMany(
                {
                    comment_productId: parseObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: { comment_right: 2 },
                },
            );

            await commentModel.updateMany(
                {
                    comment_productId: parseObjectIdMongodb(productId),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: { comment_left: 2 },
                },
            );
        } else {
            // new parent comment
            const maxRightValue = await commentModel.findOne({ comment_productId: parseObjectIdMongodb(productId) }, "comment_right", {
                sort: { comment_right: -1 },
            });
            console.log(maxRightValue);
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        comment.save();

        return comment;
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError(`Comment not found`);

            const comments = await commentModel
                .find({
                    comment_productId: parseObjectIdMongodb(productId),
                    comment_left: { $gt: parentComment.comment_left },
                    comment_right: { $lt: parentComment.comment_right },
                })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parentId: 1,
                })
                .sort({
                    comment_left: 1,
                });

            return comments;
        }

        const comments = await commentModel
            .find({
                comment_productId: parseObjectIdMongodb(productId),
                comment_parentId: parentCommentId,
            })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            })
            .sort({
                comment_left: 1,
            });

        return comments;
    }

    static async deleteComment({ productId, parentCommentId = null }) {
        const foundProduct = await findProduct({ productId });
        if (!foundProduct) throw new NotFoundError(`Product not found: ${productId}`);

        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError(`Comment not found: ${parentCommentId}`);

            const widthValue = parentComment.comment_right - parentComment.comment_left + 1;

            await commentModel.deleteMany({
                comment_productId: parseObjectIdMongodb(productId),
                comment_left: { $gte: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right },
            });

            await commentModel.updateMany(
                {
                    comment_productId: parseObjectIdMongodb(productId),
                    comment_right: { $gt: parentComment.comment_right },
                },
                {
                    $inc: { comment_right: -widthValue },
                },
            );

            await commentModel.updateMany(
                {
                    comment_productId: parseObjectIdMongodb(productId),
                    comment_left: { $gt: parentComment.comment_left },
                },
                {
                    $inc: { comment_left: -widthValue },
                },
            );
        } else {
            await commentModel.deleteMany({
                comment_productId: parseObjectIdMongodb(productId),
            });
        }

        return true;
    }
}

module.exports = CommentService;
