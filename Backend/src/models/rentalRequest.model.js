const mongoose = require("mongoose");

const rentalRequestSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        property : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Property",
            required : true
        },

        room : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Room",
            required : true
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },

        message : {
            type : String ,
            trim : true,
            maxlength : 500
        },

        moveInDate : {
            type : Date,
            required : true
        },

        status : {
            type : String,
            enum : [ "PENDING" , "APPROVED" , "REJECTED" , "CANCELLED"],
            default : "PENDING"
        }
    },
    {
        timestamps : true
    }
)

const RentalRequest = mongoose.model("RentalRequest", rentalRequestSchema);

module.exports = RentalRequest;