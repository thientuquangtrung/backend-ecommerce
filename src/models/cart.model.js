const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active',
    },
    products: {
        type: Array,
        required: true,
        default: [],
    },
    size: {
        type: Number,
        default: 0
    },
    userId: {
        type: Number,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn',
    },
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
