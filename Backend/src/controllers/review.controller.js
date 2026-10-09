const Review = require("../models/review.model");
const Booking = require("../models/booking.model");

const Property = require("../models/property.model");
// const Room = require("../models/room.model");

const { createNotification } = require("../services/notification.service");

const createReview = async( req , res ) => {
    try{
        const { bookingId } = req.params;
        const { rating , comment } = req.body;


        if(rating === undefined){
            return res.status(400).json({
                success : false,
                message : "Rating is required"
            })
        }

        const booking = await Booking.findById(bookingId)
            .populate("owner", "name")
            .populate("property", "title");

        if(!booking){
            return res.status(404).json({
                success : false,
                message : "Booking not found "
            })
        }

        if(booking.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only review your own booking"
            });
        }

        if (booking.status !== "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "You can only review a completed booking"
            });
        }

        const existingReview = await Review.findOne({
            booking : bookingId
        })

        if(existingReview){
            return res.status(409).json({
                success : false ,
                message : "You have already reviewed this booking"
            });
        }

        const review = await Review.create({
            user : booking.user,
            property : booking.property._id,
            booking : booking._id,
            rating,
            comment
        })

        await createNotification({
            userId: booking.owner._id,
            title: "New Property Review",
            message: `A tenant gave your property "${booking.property.title}" a ${rating}-star review.`,
            type: "REVIEW"
        });

        res.status(201).json({
            success : true,
            message : "Review created successfully",
            review
        })

    }catch(error){
        console.error("Create Review error :", error);

        res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}

const getPropertyReviews = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const reviews = await Review.find({
            property: propertyId
        })
            .populate("user", "name")
            .populate(
                "booking",
                "rent moveInDate status"
            );

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get Property Reviews Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getOwnerReviews = async (req, res) => {
    try {
        const properties = await Property.find({
            owner: req.user.userId
        }).select("_id");

        const propertyIds = properties.map(property => property._id);

        const reviews = await Review.find({
            property: { $in: propertyIds }
        })
            .populate("user", "name email")
            .populate("property", "title propertyType")
            .populate("booking", "room rent moveInDate")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get Owner Reviews Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createReview,
    getPropertyReviews,
    getOwnerReviews
};