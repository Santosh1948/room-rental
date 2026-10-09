import api from "../api/axios";

const getNotifications = async () => {
    const response = await api.get("/notifications/");
    return response.data;
};

const markAsRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

const notificationService = {
    getNotifications,
    markAsRead,
    deleteNotification,
};

export default notificationService;