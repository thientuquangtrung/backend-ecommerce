const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "fixed_amount",
            enum: ["fixed_amount", "percentage"],
        },
        value: {
            type: Number,
            required: true,
        },
        maxValue: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        quantity: {
            //number of discounts
            type: Number,
            required: true,
        },
        numUsed: {
            type: Number,
            required: true,
        },
        whoUsed: {
            type: Array,
            default: [],
        },
        limitPerUser: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            required: true,
        },
        shopId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Shop",
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        applyTo: {
            type: String,
            required: true,
            enum: ["all", "partial"],
        },
        productIds: {
            type: Array,
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
