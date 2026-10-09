import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "https://room-rental-backend-e89v.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Global API error handling
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // Prevent redirect loops
                if (
                    window.location.pathname !== "/login"
                ) {
                    window.location.href = "/login";
                }
            }

            if (status === 403) {
                console.warn(
                    "You do not have permission to perform this action."
                );
            }

            if (status >= 500) {
                console.error(
                    "Server error. Please try again later."
                );
            }
        } else if (error.request) {
            console.error(
                "Unable to connect to the server."
            );
        }

        return Promise.reject(error);
    }
);

export default api;