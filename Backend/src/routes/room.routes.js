const express = require("express");

const { createRoom , getRoomByProperty , getRoomById , updateRoom , deleteRoom} = require("../controllers/room.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");


const router = express.Router();

router.post("/property/:propertyId", authMiddleware, roleMiddleware("OWNER"), createRoom);
router.get("/property/:propertyId",  getRoomByProperty);
router.get("/:id", getRoomById);
router.put( "/:id", authMiddleware, roleMiddleware("OWNER"), updateRoom);
router.delete("/:id", authMiddleware,roleMiddleware("OWNER"),deleteRoom);

module.exports = router;