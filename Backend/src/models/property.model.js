const mongoose = require("mongoose");


const propertySchema = new mongoose.Schema(
    {
        owner: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        title : {
            type : String,
            required : true,
            trim : true,
            minlength : 3,
            maxlength : 100
        },

        description : {
            type : String,
            trim : true,
            maxlength : 1000
        },

        propertyType: {
            type : String,
            enum : ["House" , "APARTMENT" , "PG" , "HOSTEL", "FLAT"],
            required : true
        },

        address: {
            street: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },

        amenities : [
            {
                type : String,
                trim : true
            }
        ],

        images: [
            {
                type: String
            }
        ],

        mages: [
            {
                type: String
            }
        ],

        isAvailable: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true,
        toJSON: {
            transform: (_document, property) => {
                if (!property.images?.length && property.mages?.length) {
                    property.images = property.mages;
                }

                delete property.mages;
                return property;
            }
        }
    }

)

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;