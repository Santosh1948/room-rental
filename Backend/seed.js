const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/user.model");

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const adminPassword = await bcrypt.hash("Admin@123", 10);
        const ownerPassword = await bcrypt.hash("Owner@123", 10);

        const existingAdmin = await User.findOne({
            email: "admin@roomrental.com"
        });

        if (!existingAdmin) {
            await User.create({
                name: "Room Rental Admin",
                email: "admin@roomrental.com",
                phone: "9999999999",
                password: adminPassword,
                role: "ADMIN"
            });

            console.log("Admin created");
        } else {
            console.log("Admin already exists");
        }

        const existingOwner = await User.findOne({
            email: "owner@roomrental.com"
        });

        if (!existingOwner) {
            await User.create({
                name: "Property Owner",
                email: "owner@roomrental.com",
                phone: "8888888888",
                password: ownerPassword,
                role: "OWNER"
            });

            console.log("Owner created");
        } else {
            console.log("Owner already exists");
        }

        await mongoose.disconnect();

        console.log("Seed completed");

    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
};

seedUsers();