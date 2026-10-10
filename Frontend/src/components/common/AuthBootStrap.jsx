import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import authService from "../../services/authService";
import { loginSuccess, logout } from "../../store/slices/authSlice";

const AuthBootstrap = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const profileResponse = await authService.getProfile();
                const user =
                    profileResponse.user ||
                    profileResponse.data?.user ||
                    profileResponse.data ||
                    profileResponse;

                dispatch(
                    loginSuccess({
                        user,
                        token,
                    })
                );
            } catch (error) {
                console.error(
                    "Authentication initialization failed:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Loading Roomly...
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthBootstrap;