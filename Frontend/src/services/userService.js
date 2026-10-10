import api from "../api/axios";

const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

const updateProfile = async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
};

const getDashboard = async () => {
    const response = await api.get("/users/user-dashboard");
    return response.data;
};

const changePassword = async (data) => {
    const response = await api.put(
        "/users/change-password",
        data
    );
    return response.data;
};

const getOwnerDashboard = async () => {
    const response = await api.get("/users/owner-dashboard");
    return response.data;
};

const userService = {
    getProfile,
    updateProfile,
    getDashboard,
    changePassword,
    getOwnerDashboard
};

export default userService;