const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const Property = require("../models/property.model");
const Room = require("../models/room.model");
const RentalRequest = require("../models/rentalRequest.model");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");

const Favorite = require("../models/favorite.model");
const Notification = require("../models/notification.model");




const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            profileImage,
            address
        } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        if (address !== undefined) {
            user.address = {
                ...user.address,
                ...address
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage,
                address: user.address
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change Password Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.userId;

        const [
            totalProperties,
            totalRooms,
            availableRooms,
            pendingRequests,
            activeBookings,
            completedBookings,
            totalPayments,
            earningsResult
        ] = await Promise.all([
            Property.countDocuments({
                owner: ownerId
            }),

            Room.countDocuments({
                property: {
                    $in: await Property.find({
                        owner: ownerId
                    }).distinct("_id")
                }
            }),

            Room.countDocuments({
                property: {
                    $in: await Property.find({
                        owner: ownerId
                    }).distinct("_id")
                },
                status: "AVAILABLE"
            }),

            RentalRequest.countDocuments({
                status: "PENDING",
                property: {
                    $in: await Property.find({
                        owner: ownerId
                    }).distinct("_id")
                }
            }),

            Booking.countDocuments({
                owner: ownerId,
                status: "ACTIVE"
            }),

            Booking.countDocuments({
                owner: ownerId,
                status: "COMPLETED"
            }),

            Payment.countDocuments({
                owner: ownerId
            }),

            Payment.aggregate([
                {
                    $match: {
                        owner: new require("mongoose").Types.ObjectId(ownerId),
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

        const totalEarnings =
            earningsResult.length > 0
                ? earningsResult[0].total
                : 0;

        res.status(200).json({
            success: true,
            dashboard: {
                totalProperties,
                totalRooms,
                availableRooms,
                pendingRequests,
                activeBookings,
                completedBookings,
                totalPayments,
                totalEarnings
            }
        });

    } catch (error) {
        console.error("Owner Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [
            totalRequests,
            pendingRequests,
            approvedRequests,
            activeBookings,
            completedBookings,
            totalPayments,
            totalFavorites,
            unreadNotifications
        ] = await Promise.all([
            RentalRequest.countDocuments({
                user: userId
            }),

            RentalRequest.countDocuments({
                user: userId,
                status: "PENDING"
            }),

            RentalRequest.countDocuments({
                user: userId,
                status: "APPROVED"
            }),

            Booking.countDocuments({
                user: userId,
                status: "ACTIVE"
            }),

            Booking.countDocuments({
                user: userId,
                status: "COMPLETED"
            }),

            Payment.countDocuments({
                user: userId
            }),

            Favorite.countDocuments({
                user: userId
            }),

            Notification.countDocuments({
                user: userId,
                isRead: false
            })
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                totalRequests,
                pendingRequests,
                approvedRequests,
                activeBookings,
                completedBookings,
                totalPayments,
                totalFavorites,
                unreadNotifications
            }
        });

    } catch (error) {
        console.error("User Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getOwnerDashboard,
    getUserDashboard
};