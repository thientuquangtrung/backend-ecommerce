const { parseObjectIdMongodb } = require("../../utils");
const cartModel = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
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
};

const updateUserCartQuantity = async ({ userId, product }) => {
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
};

const findCartById = async (cartId) => {
    return await cartModel
        .findOne({ _id: parseObjectIdMongodb(cartId), state: "active" })
        .lean();
};

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    findCartById,
};
