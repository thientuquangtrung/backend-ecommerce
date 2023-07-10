const { CREATED, OK } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new OK({
            message: "Add cart successfully!",
            metadata: await CartService.addToCart(req.body),
        }).send(res);
    };

    update = async (req, res, next) => {
        new OK({
            message: "Update cart successfully!",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res);
    };

    delete = async (req, res, next) => {
        new OK({
            message: "Delete cart successfully!",
            metadata: await CartService.deleteUserCart(req.body),
        }).send(res);
    };

    listCart = async (req, res, next) => {
        new OK({
            message: "List cart successfully!",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res);
    };
}

module.exports = new CartController();
