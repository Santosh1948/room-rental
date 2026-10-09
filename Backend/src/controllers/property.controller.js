const Property = require("../models/property.model");
const Room = require("../models/room.model");

const createProperty = async(req, res) => {
    try{
        const { title , description , propertyType , address , amenities , images} = req.body;

        if(!title || !propertyType || !address){
            return res.status(400).json({
                success : false,
                message : "Titel , property type and address are required "
            })
        }

        const property = await Property.create({
            owner : req.user.userId,
            title,
            description,
            propertyType,
            address,
            amenities,
            images
        })

        res.status(201).json({
            success : true,
            message : " Property created successfully",
            property
        })

    }catch(error){

        console.log("Create Property Error:" , error);
        return res.status(500).json({
            success : false,
            message : " Internal server error"
        })
    }

}

const getAllProperties = async (req, res) => {
    try {
        const {
            city,
            propertyType,
            isAvailable
        } = req.query;

        const filter = {};

        if (city) {
            filter["address.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        if (propertyType) {
            filter.propertyType = propertyType.toUpperCase();
        }

        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === "true";
        }

        const properties = await Property.find(filter)
            .populate("owner", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            properties
        });

    } catch (error) {
        console.error("Get Properties Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("owner", "name email phone");

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            success: true,
            property
        });
    } catch (error) {
        console.error("Get Property Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getRoomsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const {
            roomType,
            minRent,
            maxRent,
            status
        } = req.query;

        const filter = {
            property: propertyId
        };

        if (roomType) {
            filter.roomType = roomType.toUpperCase();
        }

        if (status) {
            filter.status = status.toUpperCase();
        }

        if (minRent !== undefined || maxRent !== undefined) {
            filter.rent = {};

            if (minRent !== undefined) {
                filter.rent.$gte = Number(minRent);
            }

            if (maxRent !== undefined) {
                filter.rent.$lte = Number(maxRent);
            }
        }

        const rooms = await Room.find(filter)
            .sort({ rent: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Get Rooms Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateProperty = async(req, res) => {
    try{
        const { id } = req.params;

        const property = await Property.findById(id);

        if(!property){
            return res.status(404).json({
                success : false,
                message : "Property not found "
            });
        }

        if(property.owner.toString() !== req.user.userId){ 
            return res.status(403).json({
                success : false,
                message : "You can only update your own property"
            })
         }

         const {title , description , propertyType, address, amenities, images, isAvailable} = req.body;

        property.title = title ?? property.title;
        property.description = description ?? property.description;
        property.propertyType = propertyType ?? property.propertyType;
        property.address = address ?? property.address;
        property.amenities = amenities ?? property.amenities;
        property.images = images ?? property.images;
        property.isAvailable = isAvailable ?? property.isAvailable;

        await property.save();

        res.status(200).json({
            success : true,
            message : " Property updated successfully",
            property
        })


    }catch(error){
        console.error("Update property Error:", error.message);

        res.status(500).json({
            success : false,
            message : " Internal server error "
        })
    }
}

const deleteProperty = async (req, res) => {
    try{
        const { id } = req.params;

        const property = await Property.findById(id);

        if(!property){
            return res.status(404).json({
                success : false,
                message : "Property not found "
            });
        }

        if(property.owner.toString() !== req.user.usrId){
            return res.status(403).json({
                success : false,
                message : "You can only delete your own propoty"
            })
        }

        await Property.findByIdAndDelete(id);

        res.status(200).json({
            success : true,
            message : "Property deleted successfully"
        });


    }catch(error){
        console.error("Delete property error:", error.message);

        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
}