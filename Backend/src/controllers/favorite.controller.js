const Favorite = require("../models/favorite.model");
const Property = require("../models/property.model");

// Add property to favorites
const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // Check property exists
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Check if already favorite
        const existingFavorite = await Favorite.findOne({
            user: req.user.userId,
            property: propertyId
        });

        if (existingFavorite) {
            return res.status(409).json({
                success: false,
                message: "Property is already in favorites"
            });
        }

        // Create favorite
        const favorite = await Favorite.create({
            user: req.user.userId,
            property: propertyId
        });

        res.status(201).json({
            success: true,
            message: "Property added to favorites",
            favorite
        });

    } catch (error) {
        console.error("Add Favorite Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get my favorite properties
const getMyFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({
            user: req.user.userId
        }).populate(
            "property",
            "title description propertyType address amenities images isAvailable"
        );

        res.status(200).json({
            success: true,
            count: favorites.length,
            favorites
        });

    } catch (error) {
        console.error("Get Favorites Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Remove property from favorites
const removeFavorite = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            user: req.user.userId,
            property: propertyId
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Property is not in your favorites"
            });
        }

        res.status(200).json({
            success: true,
            message: "Property removed from favorites"
        });

    } catch (error) {
        console.error("Remove Favorite Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    addFavorite,
    getMyFavorites,
    removeFavorite
};