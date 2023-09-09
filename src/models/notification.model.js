const mongoose = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new mongoose.Schema(
    {
        noti_type: { type: String, enum: ["SHOP_001", "ORDER_001", "ORDER_002", "PROMOTION_001", "PROMOTION_002"], required: true },
        noti_senderId: { type: mongoose.SchemaTypes.ObjectId, ref: "Shop", required: true },
        noti_receiverId: { type: Number, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
