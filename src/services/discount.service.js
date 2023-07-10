const discountModel = require("../models/discount.model");
const { parseObjectIdMongodb } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
    findAllDiscountCodeUnselect,
    checkDiscountExist,
} = require("../models/repositories/discount.repo");

class DiscountService {
    static async createDiscountCode({
        code,
        startDate,
        endDate,
        enabled,
        shopId,
        minOrderValue,
        productIds,
        applyTo,
        name,
        description,
        type,
        value,
        maxValue,
        quantity,
        numUsed,
        whoUsed,
        limitPerUser,
    }) {
        const foundDiscount = await discountModel
            .findOne({
                code,
                shopId: parseObjectIdMongodb(shopId),
            })
            .lean();

        if (foundDiscount) {
            throw new BadRequestError(`Discount has already existed`);
        }

        const newDiscount = await discountModel.create({
            code,
            startDate,
            endDate,
            enabled,
            shopId,
            minOrderValue,
            productIds,
            applyTo,
            name,
            description,
            type,
            value,
            maxValue,
            quantity,
            numUsed,
            whoUsed,
            limitPerUser,
        });

        return newDiscount;
    }

    static async getProductByDiscountCode({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        const foundDiscount = await discountModel
            .findOne({
                code,
                shopId: parseObjectIdMongodb(shopId),
            })
            .lean();

        if (!foundDiscount || !foundDiscount.enabled) {
            throw new NotFoundError(`Discount not found`);
        }

        const { applyTo, productIds } = foundDiscount;
        let products;
        if (applyTo === "all") {
            products = await findAllProducts({
                filter: {
                    shop: parseObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                select: ["name"],
            });
        }

        if (applyTo === "partial") {
            products = await findAllProducts({
                filter: {
                    _id: { $in: productIds },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                select: ["name"],
            });
        }

        return products;
    }

    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnselect({
            limit: +limit,
            page: +page,
            filter: {
                shopId,
                enabled: true,
            },
            unSelect: ["__v", "shopId"],
        });

        return discounts;
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            code,
            shopId: parseObjectIdMongodb(shopId),
        });

        if (!foundDiscount) {
            throw new NotFoundError(`Discount not found`);
        }

        const {
            enabled,
            quantity,
            minOrderValue,
            limitPerUser,
            whoUsed,
            type,
            value,
        } = foundDiscount;

        if (!enabled) throw new NotFoundError(`Discount expired`);
        if (!quantity) throw new NotFoundError(`Discount are out`);

        // check order value
        let totalOrder = 0;
        if (minOrderValue > 0) {

            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            if (totalOrder < minOrderValue) {
                throw new BadRequestError(
                    `Discount require a minimum value of ${minOrderValue}`
                );
            }
        }

        if (limitPerUser > 0) {
            const userUsedDiscount = whoUsed.find(
                (user) => user.userId === userId
            );
            if (userUsedDiscount) {
            }
        }

        const amount =
            type === "fixed_amount" ? value : totalOrder * (value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }


    static async deleteDiscountCode({shopId, code}) {
        const deleted = await discountModel.findOneAndDelete({
            code,
            shopId: parseObjectIdMongodb(shopId),
        })

        return deleted 
    }

    static async cancelDiscountCode({code, shopId, userId}) {
        const foundDiscount = await checkDiscountExist({
            code,
            shopId: parseObjectIdMongodb(shopId),
        });

        if (!foundDiscount) {
            throw new NotFoundError(`Discount not found`);
        }

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                whoUsed: userId
            },
            $inc: {
                numUsed: -1
            }
        })

        return result
    }
}

module.exports = DiscountService
