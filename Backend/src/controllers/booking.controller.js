const Booking = require("../models/booking.model");
const RentalRequest = require("../models/rentalRequest.model");
const Room = require("../models/room.model");
const Property = require("../models/property.model");

const { createNotification } = require("../services/notification.service");


// Create Booking from Approved Rental Request
const createBooking = async (req, res) => {
    try {
        const { rentalRequestId } = req.params;

        const rentalRequest = await RentalRequest.findById(
            rentalRequestId
        )
            .populate("user")
            .populate("property")
            .populate("room");

        if (!rentalRequest) {
            return res.status(404).json({
                success: false,
                message: "Rental request not found"
            });
        }

        if (rentalRequest.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Only approved rental requests can create a booking"
            });
        }

        if (rentalRequest.property.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only create bookings for your own property"
            });
        }

        const existingBooking = await Booking.findOne({
            rentalRequest: rentalRequestId
        });

        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "Booking already exists for this rental request"
            });
        }

        const room = await Room.findById(rentalRequest.room._id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (room.status !== "AVAILABLE") {
            return res.status(400).json({
                success: false,
                message: "Room is no longer available"
            });
        }

        const booking = await Booking.create({
            user: rentalRequest.user._id,
            owner: rentalRequest.property.owner,
            property: rentalRequest.property._id,
            room: rentalRequest.room._id,
            rentalRequest: rentalRequest._id,
            rent: room.rent,
            securityDeposit: room.securityDeposit,
            moveInDate: rentalRequest.moveInDate
        });

        rentalRequest.booking = booking._id;
        await rentalRequest.save();

        await createNotification({
            userId: rentalRequest.user._id,
            title: "Booking Created",
            message: `Your booking for ${rentalRequest.property.title} has been created successfully.`,
            type: "BOOKING"
        });

        room.status = "RENTED";
        await room.save();

        const availableRooms = await Room.countDocuments({
            property: rentalRequest.property._id,
            status: "AVAILABLE"
        });

        await Property.findByIdAndUpdate(
            rentalRequest.property._id,
            {   
                isAvailable: availableRooms > 0
            }
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        console.error("Create Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.userId
        })
            .populate("property", "title propertyType address")
            .populate("room", "roomNumber roomType rent")
            .populate("owner", "name email phone");

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get My Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Only active bookings can be cancelled"
            });
        }

        booking.status = "CANCELLED";

        await booking.save();

        // Make room available again
        await Room.findByIdAndUpdate(
            booking.room,
            { status: "AVAILABLE" }
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error("Cancel Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const completeBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            _id: id,
            owner: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Only active bookings can be completed"
            });
        }

        booking.status = "COMPLETED";

        await booking.save();

        // Make room available again
        await Room.findByIdAndUpdate(
            booking.room,
            { status: "AVAILABLE" }
        );

        res.status(200).json({
            success: true,
            message: "Booking completed successfully",
            booking
        });

    } catch (error) {
        console.error("Complete Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            owner: req.user.userId
        })
            .populate("user", "name email phone")
            .populate("property", "title propertyType address")
            .populate("room", "roomNumber roomType rent status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get Owner Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createBooking,
    getMyBookings , 
    cancelBooking ,
    completeBooking ,
    getOwnerBookings
};