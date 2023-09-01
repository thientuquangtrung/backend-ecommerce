const { BadRequestError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo");
const { parseObjectIdMongodb } = require("../utils");
const inventoryModel = require("../models/inventory.model");

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "Vinhomes",
    }) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError(`Product does not exist!`);

        const query = {
                shopId: parseObjectIdMongodb(shopId),
                productId: parseObjectIdMongodb(productId),
            },
            updateSet = {
                $inc: {
                    stock,
                },
                $set: {
                    location,
                },
            },
            options = { upsert: true, new: true };

        return await inventoryModel.findByIdAndUpdate(
            query,
            updateSet,
            options
        );
    }
}

module.exports = InventoryService;
