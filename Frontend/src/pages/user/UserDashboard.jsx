import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowUpRight,
    Bell,
    CalendarCheck,
    CalendarDays,
    Clock3,
    Heart,
    Home,
    MapPin,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";

import userService from "../../services/userService";
import bookingService from "../../services/bookingService";
import favoriteService from "../../services/favoriteService";
import notificationService from "../../services/notificationService";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    const [dashboard, setDashboard] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const results = await Promise.allSettled([
                    userService.getDashboard(),
                    bookingService.getMyBookings(),
                    favoriteService.getFavorites(),
                    notificationService.getNotifications(),
                ]);

                const [
                    dashboardResult,
                    bookingsResult,
                    favoritesResult,
                    notificationsResult,
                ] = results;

                if (dashboardResult.status === "fulfilled") {
                    const data = dashboardResult.value;

                    setDashboard(
                        data.dashboard ||
                            data.data ||
                            data
                    );
                }

                if (bookingsResult.status === "fulfilled") {
                    const data = bookingsResult.value;

                    setBookings(
                        Array.isArray(data)
                            ? data
                            : data.bookings ||
                                  data.data ||
                                  []
                    );
                }

                if (favoritesResult.status === "fulfilled") {
                    const data = favoritesResult.value;

                    setFavorites(
                        Array.isArray(data)
                            ? data
                            : data.favorites ||
                                  data.data ||
                                  []
                    );
                }

                if (
                    notificationsResult.status ===
                    "fulfilled"
                ) {
                    const data =
                        notificationsResult.value;

                    setNotifications(
                        Array.isArray(data)
                            ? data
                            : data.notifications ||
                                  data.data ||
                                  []
                    );
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const upcomingBookings = bookings.filter(
        (booking) =>
            booking.status !== "CANCELLED" &&
            booking.status !== "COMPLETED"
    );

    const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <PageContainer className="py-10">
                    <LoadingSpinner
                        text="Loading your dashboard..."
                        fullScreen
                    />
                </PageContainer>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <PageContainer className="py-10">
                    <ErrorState
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <PageContainer className="py-8">
                <PageHeader
                    title={`Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}
                    description="Keep track of your rental requests, bookings, saved properties and payments."
                    action={
                        <Link
                            to="/properties"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Find a property
                            <ArrowUpRight size={17} />
                        </Link>
                    }
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={CalendarCheck}
                        title="Active Bookings"
                        value={
                            dashboard?.totalBookings ??
                            bookings.length
                        }
                    />

                    <StatCard
                        icon={Clock3}
                        title="Requests"
                        value={
                            dashboard?.pendingRequests ??
                            dashboard?.totalRequests ??
                            0
                        }
                    />

                    <StatCard
                        icon={Heart}
                        title="Favorites"
                        value={
                            dashboard?.totalFavorites ??
                            favorites.length
                        }
                    />

                    <StatCard
                        icon={Bell}
                        title="Notifications"
                        value={unreadNotifications.length}
                    />
                </div>

                {/* Main grid */}
                <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    {/* Bookings */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <h2 className="font-display text-lg font-bold text-slate-900">
                                    Recent bookings
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest rental activity
                                </p>
                            </div>

                            <Link
                                to="/my-bookings"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View all
                            </Link>
                        </div>

                        {upcomingBookings.length === 0 ? (
                            <EmptyState
                                title="No bookings yet"
                                message="Once a rental request becomes a booking, you'll see it here."
                                action={
                                    <Link
                                        to="/properties"
                                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Explore properties
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {upcomingBookings
                                    .slice(0, 4)
                                    .map((booking) => (
                                        <BookingRow
                                            key={booking._id}
                                            booking={booking}
                                        />
                                    ))}
                            </div>
                        )}
                    </section>

                    {/* Profile */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <UserRound size={25} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    {user?.name ||
                                        "Your profile"}
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <ProfileItem
                                icon={ShieldCheck}
                                label="Account"
                                value="Verified account"
                            />

                            <ProfileItem
                                icon={MapPin}
                                label="Phone"
                                value={
                                    user?.phone ||
                                    "Not added"
                                }
                            />

                            <ProfileItem
                                icon={Home}
                                label="Role"
                                value="Rental User"
                            />
                        </div>

                        <Link
                            to="/profile"
                            className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Manage profile
                            <ArrowRight size={16} />
                        </Link>
                    </section>
                </div>

                {/* Bottom */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Favorites */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Saved properties
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Properties you don't want to
                                    forget
                                </p>
                            </div>

                            <Link
                                to="/favorites"
                                className="text-sm font-semibold text-blue-600"
                            >
                                View all
                            </Link>
                        </div>

                        {favorites.length === 0 ? (
                            <EmptyState
                                title="No saved properties"
                                message="Save properties you're interested in to find them quickly later."
                                action={
                                    <Link
                                        to="/properties"
                                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Explore properties
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {favorites
                                    .slice(0, 3)
                                    .map((favorite) => {
                                        const property =
                                            favorite.property ||
                                            favorite;

                                        return (
                                            <Link
                                                key={
                                                    favorite._id
                                                }
                                                to={`/properties/${
                                                    property._id
                                                }`}
                                                className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Home
                                                        size={19}
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {property.title ||
                                                            property.name ||
                                                            "Saved property"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {property.city ||
                                                            property.location ||
                                                            "Location"}
                                                    </p>
                                                </div>

                                                <ArrowRight
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                            </Link>
                                        );
                                    })}
                            </div>
                        )}
                    </section>

                    {/* Notifications */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Recent notifications
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Stay updated on your activity
                                </p>
                            </div>

                            <Link
                                to="/notifications"
                                className="text-sm font-semibold text-blue-600"
                            >
                                View all
                            </Link>
                        </div>

                        {notifications.length === 0 ? (
                            <EmptyState
                                title="You're all caught up"
                                message="New rental activity and updates will appear here."
                            />
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications
                                    .slice(0, 4)
                                    .map(
                                        (
                                            notification
                                        ) => (
                                            <div
                                                key={
                                                    notification._id
                                                }
                                                className={`flex gap-4 px-6 py-4 ${
                                                    !notification.isRead
                                                        ? "bg-blue-50/50"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                                    <Bell
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {notification.title ||
                                                            "Notification"}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {notification.message ||
                                                            "You have a new update."}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        )}
                    </section>
                </div>

                {/* CTA */}
                <section className="mt-8 overflow-hidden rounded-2xl bg-blue-600 p-7 sm:p-9">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Still looking for the right place?
                            </h2>

                            <p className="mt-2 text-sm text-blue-100">
                                Explore more properties and find a room
                                that fits your needs.
                            </p>
                        </div>

                        <Link
                            to="/properties"
                            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"
                        >
                            Browse properties
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>
            </PageContainer>
        </div>
    );
};

const StatCard = ({
    icon: Icon,
    title,
    value,
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                    {value}
                </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Icon size={21} className="text-blue-600" />
            </div>
        </div>
    </div>
);

const BookingRow = ({ booking }) => {
    const property =
        booking.property || booking.rentalRequest?.property;

    return (
        <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={19} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                    {property?.title ||
                        property?.name ||
                        "Rental booking"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {booking.startDate
                        ? new Date(
                              booking.startDate
                          ).toLocaleDateString()
                        : "Booking confirmed"}
                </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                {booking.status || "ACTIVE"}
            </span>
        </div>
    );
};

const ProfileItem = ({
    icon: Icon,
    label,
    value,
}) => (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <Icon size={17} className="text-slate-500" />

        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-0.5 text-sm font-medium text-slate-700">
                {value}
            </p>
        </div>
    </div>
);

export default UserDashboard;