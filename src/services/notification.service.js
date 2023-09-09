const notificationModel = require("../models/notification.model");

class NotificationService {
    static async pushNotificationToSystem({ type = "SHOP_001", receiverId = 1, senderId, options = {} }) {
        let notiContent;
        switch (type) {
            case "SHOP_001":
                notiContent = `@@@ has just added new product: @@@@`;
                break;
            case "PROMOTION_001":
                notiContent = `@@@ has just added new voucher: @@@@@`;
                break;
        }

        const newNoti = await notificationModel.create({
            noti_type: type,
            noti_content: notiContent,
            noti_senderId: senderId,
            noti_receiverId: receiverId,
            noti_options: options,
        });

        return newNoti;
    }

    static async listNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
        const match = { noti_receiverId: userId };
        if (type !== "ALL") match["noti_type"] = type;

        const result = await notificationModel.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receiverId: 1,
                    noti_content: 1,
                    createdAt: 1,
                    options: 1,
                },
            },
        ]);

        return result;
    }
}

module.exports = NotificationService;
