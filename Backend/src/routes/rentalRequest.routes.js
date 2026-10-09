const express = require("express");

const { createRentalRequest , getOwnerRentalRequests , approveRentalRequest , rejectRentalRequest , getMyRentalRequests , cancelRentalRequest} = require("../controllers/rentalRequest.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();

router.post(
    "/property/:propertyId/room/:roomId", 
    authMiddleware, roleMiddleware("USER") ,
    createRentalRequest
);
router.get(
    "/owner",
    authMiddleware,
    roleMiddleware("OWNER"),
    getOwnerRentalRequests
);
router.put(
    "/:id/approve",
    authMiddleware,
    roleMiddleware("OWNER"),
    approveRentalRequest
);
router.put(
    "/:id/reject",
    authMiddleware,
    roleMiddleware("OWNER"),
    rejectRentalRequest
);
router.get(
    "/my-requests",
    authMiddleware,
    roleMiddleware("USER"),
    getMyRentalRequests
);

router.put(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("USER"),
    cancelRentalRequest
);


module.exports = router;