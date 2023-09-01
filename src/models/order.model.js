const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        order_userId: {
            type: Number,
            required: true,
        },
        order_checkout: {
            type: Object,
            default: {},
        },
        /**
         * totalPrice
         * totalApplyDiscount
         * feeShip
         */
        order_shipping: {
            type: Object,
            default: {},
        },
        /**
         * street
         * city
         * state
         * country
         */
        order_payment: {
            type: Object,
            default: {},
        },
        order_products: {
            type: Array,
            required: true,
        },
        order_trackingNumber: {
            type: String,
            default: "#0000000000",
        },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "delivered", "shipped", "cancelled"],
            default: "pending",
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
