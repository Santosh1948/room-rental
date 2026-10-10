const express = require("express");

const User = require("../models/user.model");
const { upload } = require("../config/upload");
const { uploadFileToImageKit } = require("../services/upload.service");
const { getProfile , updateProfile  , changePassword , getOwnerDashboard , getUserDashboard} = require("../controllers/userController");


const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();

router.get("/owner-test", authMiddleware, roleMiddleware("OWNER"), (req, res) => {
    res.status(200).json({
        success : true,
        message : "Welcome Owner ..",
        user : req.user
    })
})

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post(
    "/profile-image",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
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

            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            user.profileImage = result.url;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Profile image uploaded successfully.",
                imageUrl: result.url,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    profileImage: user.profileImage,
                    address: user.address,
                },
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Profile image upload failed.",
            });
        }
    }
);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

router.get(
    "/owner-dashboard",
    authMiddleware,
    roleMiddleware("OWNER"),
    getOwnerDashboard
);

router.get(
    "/user-dashboard",
    authMiddleware,
    roleMiddleware("USER"),
    getUserDashboard
);

module.exports = router;