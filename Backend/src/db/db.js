const mongoose = require("mongoose");

async function connectDB(){
    try{
        if (!process.env.MONGO_URI) {
            console.error("MongoDB connection failed: MONGO_URI is not set.");
            return false;
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected successfully....');
        return true;
    }catch(err){
        console.error("Error connecting to MongoDB:", err.message);
        return false;
    }
}

module.exports = connectDB;