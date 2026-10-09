const Room = require("../models/room.model");
const Property = require("../models/property.model");



const createRoom = async( req , res ) => {
    try{
        const {propertyId} = req.params;

        const {roomNumber, roomType , rent , securityDeposit , amenities, images} = req.body;

        if(!roomNumber || !roomType || rent == undefined){
            res.status(404).json({
                success : false ,
                message : "Room number, room type and rent are required "
            })
        }

        const property = await Property.findById(propertyId);

        if(!property){
            return res.status(404).json({
                success : false,
                message : " Property not found"
            })
        }

        if(property.owner.toString() !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : "You can only add rooms to your own property"
            });
        }

        const room = await Room.create({
            property : propertyId,
            roomNumber,
            roomType,
            rent,
            securityDeposit,
            amenities,
            images
        })

        res.status(201).json({
            success : true,
            message : "Room created successfully",
            room
        });

    }catch(error){
        console.error("Create Room Error:", error.message);

        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        });
    }
}

const getRoomByProperty = async ( req , res ) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId);

        if(!property){
            return res.status(404).json({
                success : false,
                message : "Property not found"
            });
        }

        const rooms = await Room.find({
            property : propertyId
        })

        res.status(200).json({
            success : true,
            count : rooms.length,
            rooms
        });


    }catch(error){
        console.error("Get room error:", error.message);

        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id).populate("property", "titel propertyType address owner");

        if(!room){
            return res.status(404).json({
                success : false,
                message : "Room not found"
            })
        }

        res.status(200).json({
            success : true,
            room
        })

    }catch(error){
        console.error("Get room error :", error);

        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const property = await Property.findById(room.property);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        if (property.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update rooms of your own property"
            });
        }

        const {
            roomNumber,
            roomType,
            rent,
            securityDeposit,
            amenities,
            images,
            status
        } = req.body;

        room.roomNumber = roomNumber ?? room.roomNumber;
        room.roomType = roomType ?? room.roomType;
        room.rent = rent ?? room.rent;
        room.securityDeposit = securityDeposit ?? room.securityDeposit;
        room.amenities = amenities ?? room.amenities;
        room.images = images ?? room.images;
        room.status = status ?? room.status;

        await room.save();

        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            room
        });

    } catch (error) {
        console.error("Update Room Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const property = await Property.findById(room.property);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        if (property.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete rooms of your own property"
            });
        }

        await Room.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });

    } catch (error) {
        console.error("Delete Room Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



module.exports = {
    createRoom,
    getRoomByProperty,
    getRoomById,
    updateRoom,
    deleteRoom
}