const { CREATED, OK } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new OK({
            message: "Create discount successfully!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getAllDiscountCodeByShop = async (req, res, next) => {
        new OK({
            message: "Create discount successfully!",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: "Create discount successfully!",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            }),
        }).send(res);
    };

    getProductByDiscountCode = async (req, res, next) => {
        new OK({
            message: "Create discount successfully!",
            metadata: await DiscountService.getProductByDiscountCode({
                ...req.query
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
