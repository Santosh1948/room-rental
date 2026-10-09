import api from "../api/axios";

const getMyBookings = async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
};

const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
};

// OWNER
const getOwnerBookings = async () => {
    const response = await api.get("/bookings/owner");
    return response.data;
};

const createBooking = async (rentalRequestId) => {
    const response = await api.post(
        `/bookings/request/${rentalRequestId}`
    );

    return response.data;
};

const completeBooking = async (id) => {
    const response = await api.put(
        `/bookings/${id}/complete`
    );

    return response.data;
};

const bookingService = {
    getMyBookings,
    cancelBooking,
    getOwnerBookings,
    createBooking,
    completeBooking,
};

export default bookingService;