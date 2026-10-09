import api from "../api/axios";

const getDashboard = async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
};

const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

const updateUserStatus = async (id, data) => {
    const response = await api.put(
        `/admin/users/${id}/status`,
        data
    );

    return response.data;
};

const getProperties = async () => {
    const response = await api.get("/admin/properties");
    return response.data;
};

const getRentalRequests = async () => {
    const response = await api.get("/admin/rental-requests");
    return response.data;
};

const getBookings = async () => {
    const response = await api.get("/admin/bookings");
    return response.data;
};

const getPayments = async () => {
    const response = await api.get("/admin/payments");
    return response.data;
};

const adminService = {
    getDashboard,
    getUsers,
    updateUserStatus,
    getProperties,
    getRentalRequests,
    getBookings,
    getPayments,
};

export default adminService;