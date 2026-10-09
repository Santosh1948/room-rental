const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        rentalRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RentalRequest",
            required: true,
            unique: true
        },

        rent: {
            type: Number,
            required: true,
            min: 0
        },

        securityDeposit: {
            type: Number,
            default: 0,
            min: 0
        },

        moveInDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "COMPLETED",
                "CANCELLED"
            ],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;