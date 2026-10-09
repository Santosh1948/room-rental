import api from "../api/axios";

const getPropertyReviews = async (propertyId) => {
    const response = await api.get(`/reviews/property/${propertyId}`);
    return response.data;
};

const reviewService = {
    getPropertyReviews,
};

export default reviewService;