const inventoryModel = require("../inventory.model");
const { parseObjectIdMongodb } = require("../../utils");

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "Unknown",
}) => {
    return await inventoryModel.create({
        productId,
        shopId,
        location,
        stock,
    });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
            productId: parseObjectIdMongodb(productId),
            stock: { $gte: quantity },
        },
        updateSet = {
            $inc: {
                stock: -quantity,
            },
            $push: {
                reservation: {
                    quantity,
                    cartId,
                    createdOn: new Date(),
                },
            },
        },
        options = {
            upsert: true,
            new: true,
        };

    return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
    insertInventory,
    reservationInventory,
};
