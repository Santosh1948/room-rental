const express = require("express");

const {
    createBooking,
    getMyBookings ,
    cancelBooking ,
    completeBooking,
    getOwnerBookings
} = require("../controllers/booking.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post(
    "/request/:rentalRequestId",
    authMiddleware,
    roleMiddleware("OWNER"),
    createBooking
);


router.get(
    "/my-bookings",
    authMiddleware,
    roleMiddleware("USER"),
    getMyBookings
);

router.put(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("USER"),
    cancelBooking
);

router.put(
    "/:id/complete",
    authMiddleware,
    roleMiddleware("OWNER"),
    completeBooking
);

router.get(
    "/owner",
    authMiddleware,
    roleMiddleware("OWNER"),
    getOwnerBookings
);

module.exports = router;