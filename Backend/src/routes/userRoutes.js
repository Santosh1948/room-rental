const express = require("express");

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
router.put("/profile", authMiddleware ,updateProfile);
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