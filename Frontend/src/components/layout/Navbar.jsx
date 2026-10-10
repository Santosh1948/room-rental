import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Bell,
    ChevronDown,
    Heart,
    Home,
    LogIn,
    LogOut,
    Menu,
    UserRound,
    X,
} from "lucide-react";

import { logout } from "../../store/slices/authSlice";
import notificationService from "../../services/notificationService";
import { setNotifications } from "../../store/slices/notificationSlice";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(setNotifications([]));
            return;
        }

        const loadNotifications = async () => {
            try {
                const data =
                    await notificationService.getNotifications();

                const items = Array.isArray(data)
                    ? data
                    : data.notifications || data.data || [];

                dispatch(setNotifications(items));
            } catch {
                // Navbar should not break if notifications fail.
            }
        };

        loadNotifications();
    }, [isAuthenticated, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        setProfileOpen(false);
        setMobileOpen(false);
        navigate("/login");
    };

    const getDashboardPath = () => {
        if (user?.role === "OWNER") {
            return "/owner/dashboard";
        }

        if (user?.role === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/dashboard";
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-semibold transition-colors md:inline-flex md:h-10 md:items-center ${
            isActive
                ? "text-blue-600"
                : "text-slate-600 hover:text-blue-600"
        }`;

    const closeMobile = () => {
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                        <Home size={20} />
                    </div>

                    <span className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-slate-900">
                        Room<span className="text-blue-600">ly</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden h-10 items-center gap-8 md:flex">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink
                        to="/properties"
                        className={navLinkClass}
                    >
                        Properties
                    </NavLink>

                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to={getDashboardPath()}
                            className={navLinkClass}
                        >
                            Dashboard
                        </NavLink>
                    )}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden h-10 items-center gap-2 md:flex">
                    {isAuthenticated ? (
                        <>
                            {/* Favorites */}
                            {user?.role === "USER" && (
                                <Link
                                    to="/favorites"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-red-500"
                                    title="Favorites"
                                >
                                    <Heart size={19} />
                                </Link>
                            )}

                            {/* Notifications */}
                            <Link
                                to="/notifications"
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                                title="Notifications"
                            >
                                <Bell size={19} />

                                {unreadCount > 0 && (
                                    <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                                        {unreadCount > 9
                                            ? "9+"
                                            : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* Profile dropdown */}
                            <div className="relative ml-2">
                                <button
                                    onClick={() =>
                                        setProfileOpen(!profileOpen)
                                    }
                                    className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                                        {user?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>

                                    <div className="hidden max-w-28 text-left lg:block">
                                        <p className="truncate text-xs font-bold text-slate-800">
                                            {user?.name || "User"}
                                        </p>

                                        {user?.role && user.role !== "USER" && (
                                            <p className="text-[10px] font-medium text-slate-400">
                                                {user.role}
                                            </p>
                                        )}
                                    </div>

                                    <ChevronDown
                                        size={15}
                                        className={`text-slate-400 transition ${
                                            profileOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                                        <div className="border-b border-slate-100 px-3 py-3">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {user?.name || "User"}
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                                {user?.email || ""}
                                            </p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() =>
                                                setProfileOpen(false)
                                            }
                                            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                                        >
                                            <UserRound size={17} />
                                            Profile
                                        </Link>

                                        {user?.role === "USER" && (
                                            <Link
                                                to="/payments"
                                                onClick={() =>
                                                    setProfileOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                                            >
                                                <span className="text-base">
                                                    ₹
                                                </span>
                                                Payments
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                aria-current={isLoginPage ? "page" : undefined}
                                className={`ml-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                    isLoginPage
                                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                                        : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <LogIn size={17} />
                                Login
                            </Link>

                            {!isRegisterPage && (
                                <Link
                                    to="/register"
                                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                                        isLoginPage
                                            ? "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                                            : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                    }`}
                                >
                                    Get Started
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
                    <nav className="flex flex-col gap-1">
                        <NavLink
                            to="/"
                            onClick={closeMobile}
                            className={navLinkClass}
                        >
                            <span className="block rounded-xl px-3 py-3">
                                Home
                            </span>
                        </NavLink>

                        <NavLink
                            to="/properties"
                            onClick={closeMobile}
                            className={navLinkClass}
                        >
                            <span className="block rounded-xl px-3 py-3">
                                Properties
                            </span>
                        </NavLink>

                        <NavLink
                            to="/about"
                            onClick={closeMobile}
                            className={navLinkClass}
                        >
                            <span className="block rounded-xl px-3 py-3">
                                About
                            </span>
                        </NavLink>

                        {isAuthenticated && (
                            <>
                                <NavLink
                                    to={getDashboardPath()}
                                    onClick={closeMobile}
                                    className={navLinkClass}
                                >
                                    <span className="block rounded-xl px-3 py-3">
                                        Dashboard
                                    </span>
                                </NavLink>

                                <div className="my-2 border-t border-slate-100" />

                                {user?.role === "USER" && (
                                    <>
                                        <Link
                                            to="/favorites"
                                            onClick={closeMobile}
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            <Heart size={18} />
                                            Favorites
                                        </Link>

                                        <Link
                                            to="/payments"
                                            onClick={closeMobile}
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            <span className="w-[18px] text-center">
                                                ₹
                                            </span>
                                            Payments
                                        </Link>
                                    </>
                                )}

                                <Link
                                    to="/notifications"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <Bell size={18} />
                                        Notifications
                                    </span>

                                    {unreadCount > 0 && (
                                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    to="/profile"
                                    onClick={closeMobile}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    <UserRound size={18} />
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <div className="my-2 border-t border-slate-100" />

                                <Link
                                    to="/login"
                                    onClick={closeMobile}
                                    aria-current={isLoginPage ? "page" : undefined}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                                        isLoginPage
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>

                                {!isRegisterPage && (
                                    <Link
                                        to="/register"
                                        onClick={closeMobile}
                                        className={`mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                                            isLoginPage
                                                ? "border border-blue-200 bg-white text-blue-700"
                                                : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        <UserRound size={18} />
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;