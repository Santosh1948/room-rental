const express = require("express");

const {
    getMyNotifications,
    markAsRead,
    deleteNotification
} = require("../controllers/notification.controller");

const authMiddleware = require("../middileware/auth.middileware");

const router = express.Router();


// Get my notifications
router.get(
    "/",
    authMiddleware,
    getMyNotifications
);


// Mark notification as read
router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);


// Delete notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);


module.exports = router;