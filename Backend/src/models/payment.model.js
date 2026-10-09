const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

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

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentType: {
            type: String,
            enum: [
                "RENT",
                "SECURITY_DEPOSIT"
            ],
            required: true
        },

        paymentMethod: {
            type: String,
            enum: [
                "CASH",
                "UPI",
                "CARD",
                "NET_BANKING"
            ],
            required: true
        },

        transactionId: {
            type: String,
            trim: true,
            default: null
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED"
            ],
            default: "PENDING"
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;