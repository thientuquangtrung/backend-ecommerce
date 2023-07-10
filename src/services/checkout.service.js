const { findCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService;