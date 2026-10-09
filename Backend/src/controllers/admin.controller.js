const User = require("../models/user.model");
const Property = require("../models/property.model");
const RentalRequest = require("../models/rentalRequest.model");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const Room = require("../models/room.model");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Activate / deactivate user
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Update User Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("owner", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            properties
        });

    } catch (error) {
        console.error("Get All Properties Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllRentalRequests = async (req, res) => {
    try {
        const requests = await RentalRequest.find()
            .populate("user", "name email phone")
            .populate("property", "title propertyType address")
            .populate("room", "roomNumber roomType rent status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get All Rental Requests Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email phone")
            .populate("owner", "name email phone")
            .populate("property", "title propertyType address")
            .populate("room", "roomNumber roomType rent")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get All Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email phone")
            .populate("owner", "name email phone")
            .populate(
                "booking",
                "rent securityDeposit moveInDate status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get All Payments Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalOwners,
            totalProperties,
            totalRooms,
            availableRooms,
            pendingRentalRequests,
            totalBookings,
            activeBookings,
            completedBookings,
            totalPayments,
            successfulPayments,
            revenueResult
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                role: "OWNER"
            }),

            Property.countDocuments(),

            Room.countDocuments(),

            Room.countDocuments({
                status: "AVAILABLE"
            }),

            RentalRequest.countDocuments({
                status: "PENDING"
            }),

            Booking.countDocuments(),

            Booking.countDocuments({
                status: "ACTIVE"
            }),

            Booking.countDocuments({
                status: "COMPLETED"
            }),

            Payment.countDocuments(),

            Payment.countDocuments({
                status: "SUCCESS"
            }),

            Payment.aggregate([
                {
                    $match: {
                        status: "SUCCESS"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ])
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].total
                : 0;

        res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalOwners,
                totalProperties,
                totalRooms,
                availableRooms,
                pendingRentalRequests,
                totalBookings,
                activeBookings,
                completedBookings,
                totalPayments,
                successfulPayments,
                totalRevenue
            }
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests,
    getAllBookings,
    getAllPayments,
    getDashboardStats
};