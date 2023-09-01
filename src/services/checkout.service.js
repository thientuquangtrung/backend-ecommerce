const { findCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFoundError(`Cart ${cartId} not found`);

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };
        const shop_order_ids_new = [];

        for (let index = 0; index < shop_order_ids.length; index++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[index];

            const checkedProducts = await checkProductByServer(item_products);
            if (!checkedProducts[0]) throw new BadRequestError(`Order wrong`);

            const checkoutPrice = checkedProducts.reduce((acc, product) => {
                return acc + product.price * product.quantity;
            }, 0);

            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkedProducts,
            };

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } =
                    await getDiscountAmount({
                        code: shop_discounts[0].code,
                        userId,
                        shopId,
                        products: checkedProducts,
                    });

                checkout_order.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        };
    }

    static async orderByUser({
        shop_order_ids,
        userId,
        cartId,
        userAddress = {},
        userPayment = {},
    }) {
        const { shop_order_ids_new, checkout_order } =
            CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids,
            });

        // check over inventory
        const acquireProducts = [];
        const products = shop_order_ids_new.flatMap((order) => order.products);
        for (let index = 0; index < products.length; index++) {
            const { productId, quantity } = products[index];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProducts.push(keyLock ? true : false);
            if (keyLock) await releaseLock(keyLock);
        }

        // check if over sell
        if (acquireProducts.includes(false)) {
            throw new BadRequestError(
                `Some products have been updated. Please check your cart again`
            );
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: userAddress,
            order_payment: userPayment,
            order_products: shop_order_ids_new,
        });

        if (newOrder) {
            // remove product in cart
        }

        return newOrder;
    }

    static async getOrdersByUser() {}

    static async getOneOrderByUser() {}

    static async cancelOrderByUser() {}

    static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
