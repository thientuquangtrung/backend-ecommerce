const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    },
    shopId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop'
    },
    location: {
        type: String,
        default: 'Unknown',
    },
    stock: {
        type: Number,
        required: true,
    },
    reservation: {
        type: Array,
        default: [],
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
