const Notification = require("../models/notification.model");

const createNotification = async ({
    userId,
    title,
    message,
    type = "SYSTEM"
}) => {
    try {
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type
        });

        return notification;

    } catch (error) {
        console.error("Create Notification Error:", error);
        return null;
    }
};

module.exports = {
    createNotification
};