import api from "../api/axios";

const getProperties = async (params = {}) => {
    const response = await api.get("/properties", { params });
    return response.data;
};

const getPropertyById = async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
};

// OWNER
const createProperty = async (data) => {
    const response = await api.post("/properties", data);
    return response.data;
};

const updateProperty = async (id, data) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
};

const deleteProperty = async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
};

const propertyService = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};

export default propertyService;