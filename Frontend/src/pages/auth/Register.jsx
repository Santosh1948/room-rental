import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";

import authService from "../../services/authService";
import { loginSuccess } from "../../store/slices/authSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
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
            const data = await authService.register(formData);

            /*
             * If your register API returns token + user,
             * log the user in immediately.
             */
            if (data.token && data.user) {
                dispatch(
                    loginSuccess({
                        user: data.user,
                        token: data.token,
                    })
                );

                navigate("/dashboard");
            } else {
                /*
                 * If registration only creates the account,
                 * send the user to login.
                 */
                navigate("/login");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
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

                    <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                        <div>
                            <Link
                                to="/"
                                className="font-display text-2xl font-bold text-white"
                            >
                                Roomly
                            </Link>

                            <p className="mt-6 max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">
                                Find a place that feels like home.
                            </p>

                            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                                Discover comfortable rooms and properties,
                                connect with owners, and manage your rental
                                journey from one place.
                            </p>
                        </div>

                        <p className="text-sm text-slate-400">
                            Simple. Secure. Made for modern renting.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <Link
                                to="/"
                                className="font-display text-2xl font-bold text-slate-900"
                            >
                                Roomly
                            </Link>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h1 className="font-display text-2xl font-bold text-slate-900">
                                Create your account
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Join Roomly and start exploring properties.
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
                                className="mt-6 space-y-4"
                            >

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    minLength={2}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

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

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phone number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
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
                                        placeholder="Create a password"
                                        required
                                        minLength={6}
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

                            {/* Terms */}
                            <p className="pt-1 text-xs leading-5 text-slate-500">
                                By creating an account, you agree to use
                                Roomly responsibly and provide accurate
                                information.
                            </p>

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
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>

                            </form>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Sign in
                            </Link>
                        </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;