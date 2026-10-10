const express = require("express");

const { createRoom , getRoomByProperty , getRoomById , updateRoom , deleteRoom} = require("../controllers/room.controller");
const { upload } = require("../config/upload");
const { uploadFileToImageKit } = require("../services/upload.service");
const Room = require("../models/room.model");
const Property = require("../models/property.model");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");


const router = express.Router();

router.post("/property/:propertyId", authMiddleware, roleMiddleware("OWNER"), createRoom);
router.post(
    "/:id/images",
    authMiddleware,
    roleMiddleware("OWNER"),
    upload.array("images", 5),
    async (req, res) => {
        try {
            const room = await Room.findById(req.params.id);

            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found",
                });
            }

            const property = await Property.findById(room.property);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: "Property not found",
                });
            }

            if (property.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You can only upload images to rooms in your own property",
                });
            }

            if (!req.files || !req.files.length) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload at least one image.",
                });
            }

            const uploadedImages = await Promise.all(
                req.files.map((file) =>
                    uploadFileToImageKit({
                        file,
                        folder: "/roomly/rooms",
                    })
                )
            );

            const nextImages = [...(room.images || []), ...uploadedImages.map((item) => item.url)];
            room.images = nextImages;
            await room.save();

            return res.status(200).json({
                success: true,
                images: nextImages,
                message: "Room images uploaded successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Room image upload failed.",
            });
        }
    }
);
router.get("/property/:propertyId",  getRoomByProperty);
router.get("/:id", getRoomById);
router.put( "/:id", authMiddleware, roleMiddleware("OWNER"), updateRoom);
router.delete("/:id", authMiddleware,roleMiddleware("OWNER"),deleteRoom);

module.exports = router;