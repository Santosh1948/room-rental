const express = require("express");

const {
    getAllUsers,
    updateUserStatus ,
    getAllProperties,
    getAllRentalRequests,
    getAllBookings,
    getAllPayments,
    getDashboardStats
} = require("../controllers/admin.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


// Get all users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllUsers
);


// Activate / deactivate user
router.put(
    "/users/:id/status",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateUserStatus
);


router.get(
    "/properties",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllProperties
);

router.get(
    "/rental-requests",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllRentalRequests
);


router.get(
    "/bookings",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllBookings
);

router.get(
    "/payments",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllPayments
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getDashboardStats
);


module.exports = router;