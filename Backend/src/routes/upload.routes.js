const express = require("express");

const { upload } = require("../config/upload");
const { uploadFileToImageKit } = require("../services/upload.service");
const authMiddleware = require("../middileware/auth.middileware");

const router = express.Router();

router.post("/profile", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a valid image file.",
            });
        }

        const result = await uploadFileToImageKit({
            file: req.file,
            folder: "/roomly/users",
        });

        return res.status(200).json({
            success: true,
            imageUrl: result.url,
            fileId: result.fileId,
            message: "Profile image uploaded successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Image upload failed.",
        });
    }
});

router.post("/properties", authMiddleware, upload.array("images", 5), async (req, res) => {
    try {
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

        return res.status(200).json({
            success: true,
            images: uploadedImages.map((item) => item.url),
            message: "Property images uploaded successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Property image upload failed.",
        });
    }
});

router.post("/rooms", authMiddleware, upload.array("images", 5), async (req, res) => {
    try {
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

        return res.status(200).json({
            success: true,
            images: uploadedImages.map((item) => item.url),
            message: "Room images uploaded successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Room image upload failed.",
        });
    }
});

module.exports = router;
