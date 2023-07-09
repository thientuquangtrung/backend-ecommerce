const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumb: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Electronic", "Cloth", "Furniture"],
    },
    shop: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop'
    },
    attributes: {
        type: mongoose.SchemaTypes.Mixed,
        required: true,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

const clothSchema = new mongoose.Schema({
    brand: {
        type: String, required: true,
    },
    size: String,
    material: String,
    shop: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'Clothes',
    timestamps: true,
})

const electronicSchema = new mongoose.Schema({
    manufacturer: {
        type: String, 
        required: true,
    },
    model: String,
    color: String,
    shop: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: 'Electronics',
    timestamps: true,
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    cloth: mongoose.model('Cloth', clothSchema),
    electronic: mongoose.model('Electronic', electronicSchema),
}
