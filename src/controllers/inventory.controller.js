const { CREATED, OK } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new OK({
            message: "addStockToInventory successfully!",
            metadata: await InventoryService.addStockToInventory(req.body),
        }).send(res);
    };
}

module.exports = new InventoryController();
