import api from "../api/axios";

const getMyPayments = async () => {
    const response = await api.get("/payments/my-payments");
    return response.data;
};

const createPayment = async (bookingId, data) => {
    const response = await api.post(
        `/payments/booking/${bookingId}`,
        data
    );
    return response.data;
};

const paymentService = {
    getMyPayments,
    createPayment,
};

export default paymentService;