const express = require("express");

const {
    createPayment,
    getMyPayments,
    getOwnerPayments
} = require("../controllers/payment.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post(
    "/booking/:bookingId",
    authMiddleware,
    roleMiddleware("USER"),
    createPayment
);

router.get(
    "/my-payments",
    authMiddleware,
    roleMiddleware("USER"),
    getMyPayments
);

router.get(
    "/owner",
    authMiddleware,
    roleMiddleware("OWNER"),
    getOwnerPayments
);


module.exports = router;