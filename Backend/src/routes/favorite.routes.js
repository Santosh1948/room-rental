const express = require("express");

const {
    addFavorite,
    getMyFavorites,
    removeFavorite
} = require("../controllers/favorite.controller");

const authMiddleware = require("../middileware/auth.middileware");
const roleMiddleware = require("../middileware/role.middleware");

const router = express.Router();


router.post(
    "/:propertyId",
    authMiddleware,
    roleMiddleware("USER"),
    addFavorite
);


router.get(
    "/my-favorites",
    authMiddleware,
    roleMiddleware("USER"),
    getMyFavorites
);


router.delete(
    "/:propertyId",
    authMiddleware,
    roleMiddleware("USER"),
    removeFavorite
);


module.exports = router;