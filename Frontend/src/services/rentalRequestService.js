import api from "../api/axios";

const createRentalRequest = async (propertyId, roomId, data = {}) => {
    const response = await api.post(
        `/rental-requests/property/${propertyId}/room/${roomId}`,
        data
    );

    return response.data;
};

const getMyRequests = async () => {
    const response = await api.get("/rental-requests/my-requests");
    return response.data;
};

const cancelRequest = async (id) => {
    const response = await api.put(
        `/rental-requests/${id}/cancel`
    );

    return response.data;
};

// OWNER
const getOwnerRequests = async () => {
    const response = await api.get("/rental-requests/owner");
    return response.data;
};

const approveRequest = async (id) => {
    const response = await api.put(
        `/rental-requests/${id}/approve`
    );

    return response.data;
};

const rejectRequest = async (id) => {
    const response = await api.put(
        `/rental-requests/${id}/reject`
    );

    return response.data;
};

const rentalRequestService = {
    createRentalRequest,
    getMyRequests,
    cancelRequest,
    getOwnerRequests,
    approveRequest,
    rejectRequest,
};

export default rentalRequestService;