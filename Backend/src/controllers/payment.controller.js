const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");

const { createNotification } = require("../services/notification.service");

// Create Payment
const createPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const {
            amount,
            paymentType,
            paymentMethod,
            transactionId
        } = req.body;

        if (
            amount === undefined ||
            !paymentType ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Amount, payment type and payment method are required"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.user.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only make payment for your own booking"
            });
        }

        if (booking.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Payment can only be made for an active booking"
            });
        }

        if (!["RENT", "SECURITY_DEPOSIT"].includes(paymentType)) {
            return res.status(400).json({
            success: false,
            message: "Invalid payment type"
            });
        }

        const expectedAmount = 
            paymentType === "RENT"
            ? booking.rent
            : booking.securityDeposit;

        if (Number(amount) !== Number(expectedAmount)) {
            return res.status(400).json({
                success: false,
                message: `Invalid payment amount. Expected ₹${expectedAmount}`
            });
        }

        const existingPayment = await Payment.findOne({
                booking: booking._id,
                paymentType,
                status: "SUCCESS"
        });

        if (existingPayment) {
            return res.status(409).json({
                success: false,
                message: `Payment for ${paymentType} already exists for this booking`
            });
        }

        const payment = await Payment.create({
            booking: booking._id,
            user: booking.user,
            owner: booking.owner,
            amount,
            paymentType,
            paymentMethod,
            transactionId,
            status: "SUCCESS",
            paidAt: new Date()
        });

        await createNotification({
            userId: booking.owner,
            title: "Payment Received",
            message: `You received a payment of ₹${amount} from the tenant.`,
            type: "PAYMENT"
        });

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully",
            payment
        });

    } catch (error) {
        console.error("Create Payment Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            user: req.user.userId
        })
            .populate(
                "booking",
                "rent securityDeposit moveInDate status"
            )
            .populate(
                "owner",
                "name email phone"
            );

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get My Payments Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getOwnerPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            owner: req.user.userId
        })
            .populate("user", "name email phone")
            .populate("booking", "rent securityDeposit moveInDate status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get Owner Payments Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createPayment,
    getMyPayments,
    getOwnerPayments
};