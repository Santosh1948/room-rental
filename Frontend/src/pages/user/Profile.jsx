import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    Phone,
    Save,
    UserRound,
} from "lucide-react";

import userService from "../../services/userService";
import { updateUser } from "../../store/slices/authSlice";

const Profile = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    const [profile, setProfile] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [error, setError] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await userService.getProfile();

                const currentUser = data.user || data.data || data;

                setProfile({
                    name: currentUser.name || "",
                    phone: currentUser.phone || "",
                    email: currentUser.email || "",
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleProfileChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    };

    const handlePasswordChange = (event) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value,
        });
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            setSavingProfile(true);
            setProfileMessage("");
            setError("");

            const response = await userService.updateProfile({
                name: profile.name,
                phone: profile.phone,
            });

            const updatedUser =
                response.user ||
                response.data ||
                response;

            dispatch(updateUser(updatedUser));

            setProfileMessage("Profile updated successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to update your profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (passwords.newPassword.length < 6) {
            setPasswordMessage(
                "New password must contain at least 6 characters."
            );
            return;
        }

        try {
            setChangingPassword(true);
            setPasswordMessage("");
            setError("");

            await userService.changePassword(passwords);

            setPasswords({
                currentPassword: "",
                newPassword: "",
            });

            setPasswordMessage(
                "Password changed successfully."
            );
        } catch (err) {
            setPasswordMessage(
                err.response?.data?.message ||
                    "Unable to change your password."
            );
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50">
                <Loader2
                    size={32}
                    className="animate-spin text-blue-600"
                />
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        to="/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-extrabold text-white shadow-lg shadow-blue-600/20">
                            {profile.name
                                ? profile.name.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                ACCOUNT SETTINGS
                            </p>

                            <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900">
                                My Profile
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Profile */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <UserRound size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Personal information
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Update your account details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {profileMessage && (
                            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                <CheckCircle2 size={17} />
                                {profileMessage}
                            </div>
                        )}

                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleProfileChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none"
                                    />
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Email address cannot be changed here.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phone number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingProfile ? (
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={17} />
                                )}

                                {savingProfile
                                    ? "Saving..."
                                    : "Save changes"}
                            </button>
                        </form>
                    </div>

                    {/* Password */}
                    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Change password
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Keep your account secure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {passwordMessage && (
                            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                {passwordMessage}
                            </div>
                        )}

                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Current password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="currentPassword"
                                        value={
                                            passwords.currentPassword
                                        }
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Current password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    New password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="New password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Use at least 6 characters.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {changingPassword ? (
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <LockKeyhole size={17} />
                                )}

                                {changingPassword
                                    ? "Updating..."
                                    : "Change password"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Account summary */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Account
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                            Role: {user?.role || "USER"}
                        </span>

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            Account active
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;