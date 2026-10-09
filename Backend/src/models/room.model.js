const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        property : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Property",
            required : true
        },

        roomNumber : {
            type : String,
            required : true,
            trim : true
        },

        roomType : {
            type : String,
            enum : ["SINGLE" , "DOUBLE" , "TRIPLE" , "SHARED"],
            required : true
        },

        rent : {
            type : Number,
            required : true,
            min : 0
        },

        securityDeposit : {
            type : Number ,
            default : 0,
            min : 0
        },

        amenities : [
            {
                type : String ,
                trim : true
            }
        ],
        
        images : [
            {
                type : String
            }
        ],

        status : {
            type : String,
            enum : ["AVAILABLE" , "RENTED" , "MAINTENANCE"],
            default : "AVAILABLE"
        }
    },
    {
        timestamps : true
    }
);

const Room = mongoose.model("Room",roomSchema);

module.exports = Room;