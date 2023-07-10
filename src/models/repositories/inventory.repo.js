const inventoryModel = require("../inventory.model");

const insertInventory = async ({ productId, shopId, stock, location = 'Unknown' }) => {
    return await inventoryModel.create({
        productId,
        shopId,
        location,
        stock
    })
};

module.exports = {
    insertInventory
}
