import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";

import authService from "../../services/authService";
import { loginSuccess } from "../../store/slices/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await authService.login(formData);

            dispatch(
                loginSuccess({
                    user: data.user,
                    token: data.token,
                })
            );

            if (data.user.role === "OWNER") {
                navigate("/owner/dashboard");
            } else if (data.user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen lg:grid-cols-2">
                <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-950 to-slate-950" />

                    <div className="relative z-10 flex w-full flex-col justify-center py-10 pr-8 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] xl:py-14">
                        <div>
                            <p className="max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">
                                Find a place that feels like home.
                            </p>

                            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                                Discover comfortable rooms and properties,
                                connect with owners, and manage your rental
                                journey from one place.
                            </p>

                            <p className="mt-6 text-sm text-slate-400">
                                Simple. Secure. Made for modern renting.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
                    <div className="w-full max-w-md">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h1 className="font-display text-2xl font-bold text-slate-900">
                                Welcome back
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to continue to your Roomly account.
                            </p>

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                                >
                                    {error}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-5"
                            >

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>

                            </form>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Create account
                            </Link>
                        </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;