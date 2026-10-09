const RentalRequest = require("../models/rentalRequest.model");
const Room = require("../models/room.model");
const Property = require("../models/property.model");

const { createNotification } = require("../services/notification.service");

const createRentalRequest = async ( req , res ) => {
    try {
        const { propertyId , roomId } = req.params;

        const {moveInDate , message } = req.body;

        if(!moveInDate){
            return res.status(400).json({
                success : false,
                message : "Move in date is required"
            });
        }

        const property = await Property.findById(propertyId);

        if(!property){
            return res.status(404).json({
                success : false,
                message : "Property not found"
            });
        }

        const room  = await Room.findById(roomId);

        if(!room){
            return res.status(404).json({
                success : false ,
                message : "Room not found "
            });
        }

        if(room.property.toString() !== propertyId){
            return res.status(400).json({
                success : false ,
                message : "Room does not belong to this property"
            });
        }

        if(room.status !== "AVAILABLE"){
            return res.status(400).json({
                success : false,
                message : "Room is not available"
            })
        }

        const existingRequest = await RentalRequest.findOne({
            user : req.user.userId,
            room : roomId,
            status : "PENDING"
        })

        if(existingRequest){
            return res.status(409).json({
                success : false,
                message : "You already have a pending request for this room"
            })
        }

        const rentalRequest = await RentalRequest.create({
            user : req.user.userId,
            property : propertyId,
            room : roomId,
            moveInDate,
            message
        })

        await createNotification({
            userId: property.owner,
            title: "New Rental Request",
            message: `You received a new rental request for ${property.title}.`,
            type: "RENTAL_REQUEST"
        });

        res.status(201).json({
            success : true,
            message : "Rental request created successfully",
            rentalRequest
        })

    }catch(error){
        console.error("Create rental request error:",error.message);

        res.status(500).json({
            success : false,
            message : "Internal Server error.."
        })
    }
}

const getOwnerRentalRequests = async (req, res) => {
    try {
        const requests = await RentalRequest.find()
            .populate("user", "name email phone")
            .populate("property", "title propertyType address owner")
            .populate("room", "roomNumber roomType rent status");

        const ownerRequests = requests.filter(
            (request) =>
                request.property &&
                request.property.owner &&
                request.property.owner.toString() === req.user.userId
        );

        res.status(200).json({
            success: true,
            count: ownerRequests.length,
            requests: ownerRequests
        });

    } catch (error) {
        console.error("Get Owner Rental Requests Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const approveRentalRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await RentalRequest.findById(id)
            .populate("property")
            .populate("room");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Rental request not found"
            });
        }

        if (
            request.property.owner.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only approve requests for your own property"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be approved"
            });
        }

        if (request.room.status !== "AVAILABLE") {
            return res.status(400).json({
                success: false,
                message: "Room is no longer available"
            });
        }

        request.status = "APPROVED";

        await request.save();

        await createNotification({
            userId: request.user,
            title: "Rental Request Approved",
            message: `Your rental request for ${request.property.title} has been approved.`,
            type: "RENTAL_REQUEST"
        });

        res.status(200).json({
            success: true,
            message: "Rental request approved successfully",
            request
        });

    } catch (error) {
        console.error("Approve Rental Request Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const rejectRentalRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await RentalRequest.findById(id)
            .populate("property");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Rental request not found"
            });
        }

        if (
            request.property.owner.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only reject requests for your own property"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be rejected"
            });
        }

        request.status = "REJECTED";

        await request.save();

        await createNotification({
            userId: request.user,
            title: "Rental Request Rejected",
            message: `Your rental request for ${request.property.title} has been rejected.`,
            type: "RENTAL_REQUEST"
        });

        res.status(200).json({
            success: true,
            message: "Rental request rejected successfully",
            request
        });

    } catch (error) {
        console.error("Reject Rental Request Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getMyRentalRequests = async (req, res) => {
    try {
        const requests = await RentalRequest.find({
            user: req.user.userId
        })
            .populate("property", "title propertyType address")
            .populate("room", "roomNumber roomType rent status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get My Rental Requests Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const cancelRentalRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await RentalRequest.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Rental request not found"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending requests can be cancelled"
            });
        }

        request.status = "CANCELLED";

        await request.save();

        res.status(200).json({
            success: true,
            message: "Rental request cancelled successfully",
            request
        });

    } catch (error) {
        console.error("Cancel Rental Request Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { createRentalRequest , getOwnerRentalRequests , approveRentalRequest , rejectRentalRequest , getMyRentalRequests , cancelRentalRequest}