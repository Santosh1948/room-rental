const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["USER", "OWNER", "ADMIN"],
            default: "USER",
        },

        profileImage: {
            type: String,
            default: null,
        },

        address: {
            street: {
                type: String,
                trim: true,
            },

            city: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            pincode: {
                type: String,
                trim: true,
            },
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;