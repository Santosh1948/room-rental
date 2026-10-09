const express = require("express");

const { createProperty , getAllProperties , getPropertyById , updateProperty , deleteProperty } = require("../controllers/property.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post("/", authMiddleware, roleMiddleware("OWNER"), createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware, roleMiddleware("OWNER"), updateProperty);
router.delete("/:id", authMiddleware, roleMiddleware("OWNER"),deleteProperty);



module.exports = router;