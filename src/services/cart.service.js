const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");

class CartService {
    /// START CART REPO ///

    static async createUserCart({ userId, product }) {
        const query = {
            userId,
            state: "active",
        };
        const updateOrInsert = {
            $addToSet: {
                products: product,
            },
        };
        const options = {
            upsert: true,
            new: true,
        };
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            userId,
            "products.productId": productId,
            state: "active",
        };
        const updateSet = {
            $inc: {
                "products.$.quantity": quantity,
            },
        };
        const options = {
            upsert: true,
            new: true,
        };

        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }

    /// END CART REPO ///

    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ userId });
        if (!userCart) {
            return await CartService.createUserCart({ userId, product });
        }
        
        console.log(userCart);
        if (userCart.size === 0) {
            userCart.products = [product];
            return await userCart.save();
        }

        return await CartService.updateUserCartQuantity({ userId, product });
    }

    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];

        const foundProduct = await getProductById(productId);
        if (!foundProduct) throw new NotFoundError(`Product not found`);

        if (foundProduct.shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError(`Product not found`);

        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        });
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { userId, state: "active" };
        const updateSet = {
            $pull: {
                products: {
                    productId,
                },
            },
        };

        const deleted = await cartModel.updateOne(query, updateSet);

        return deleted;
    }

    static async getListUserCart({userId}) {
        return await cartModel.findOne({
            userId
        }).lean();
    }
}

module.exports = CartService