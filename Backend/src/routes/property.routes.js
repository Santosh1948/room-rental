const express = require("express");

const { createProperty , getAllProperties , getPropertyById , updateProperty , deleteProperty } = require("../controllers/property.controller");
const { upload } = require("../config/upload");
const { uploadFileToImageKit } = require("../services/upload.service");
const Property = require("../models/property.model");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post("/", authMiddleware, roleMiddleware("OWNER"), createProperty);
router.post(
    "/:id/images",
    authMiddleware,
    roleMiddleware("OWNER"),
    upload.array("images", 5),
    async (req, res) => {
        try {
            const property = await Property.findById(req.params.id);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: "Property not found",
                });
            }

            if (property.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You can only upload images to your own property",
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
                        folder: "/roomly/properties",
                    })
                )
            );

            const nextImages = [...(property.images || []), ...uploadedImages.map((item) => item.url)];
            property.images = nextImages;
            await property.save();

            return res.status(200).json({
                success: true,
                images: nextImages,
                message: "Property images uploaded successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Property image upload failed.",
            });
        }
    }
);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware, roleMiddleware("OWNER"), updateProperty);
router.delete("/:id", authMiddleware, roleMiddleware("OWNER"),deleteProperty);



module.exports = router;