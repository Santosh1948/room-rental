const express = require("express");

const { createReview , getPropertyReviews , getOwnerReviews} = require("../controllers/review.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post(
    "/booking/:bookingId",
    authMiddleware,
    roleMiddleware("USER"),
    createReview
);


router.get(
    "/property/:propertyId",
    getPropertyReviews
);

router.get(
    "/owner",
    authMiddleware,
    roleMiddleware("OWNER"),
    getOwnerReviews
);


module.exports = router;