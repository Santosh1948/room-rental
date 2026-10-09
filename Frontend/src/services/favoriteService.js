import api from "../api/axios";

const addFavorite = async (propertyId) => {
    const response = await api.post(`/favorites/${propertyId}`);
    return response.data;
};

const getFavorites = async () => {
    const response = await api.get("/favorites/my-favorites");
    return response.data;
};

const removeFavorite = async (propertyId) => {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
};

const favoriteService = {
    addFavorite,
    getFavorites,
    removeFavorite,
};

export default favoriteService;