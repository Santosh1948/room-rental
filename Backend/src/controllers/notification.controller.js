const Notification = require("../models/notification.model");

// Get my notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error("Mark Notification Read Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            user: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {
        console.error("Delete Notification Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    getMyNotifications,
    markAsRead,
    deleteNotification
};