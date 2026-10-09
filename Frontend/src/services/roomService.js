import api from "../api/axios";

const getRoomsByProperty = async (propertyId) => {
    const response = await api.get(`/rooms/property/${propertyId}`);
    return response.data;
};

const getRoomById = async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
};

// OWNER
const createRoom = async (propertyId, data) => {
    const response = await api.post(
        `/rooms/property/${propertyId}`,
        data
    );

    return response.data;
};

const updateRoom = async (id, data) => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
};

const deleteRoom = async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
};

const roomService = {
    getRoomsByProperty,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
};

export default roomService;