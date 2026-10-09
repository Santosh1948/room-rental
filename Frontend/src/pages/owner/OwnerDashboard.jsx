import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    Home,
    Loader2,
    Plus,
    Users,
} from "lucide-react";

import userService from "../../services/userService";
import propertyService from "../../services/propertyService";

const OwnerDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [properties, setProperties] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [dashboardResponse, propertiesResponse] =
                    await Promise.all([
                        userService.getOwnerDashboard(),
                        propertyService.getProperties(),
                    ]);

                setDashboard(
                    dashboardResponse.data ||
                        dashboardResponse.dashboard ||
                        dashboardResponse
                );

                const propertyItems = Array.isArray(propertiesResponse)
                    ? propertiesResponse
                    : propertiesResponse.properties ||
                      propertiesResponse.data ||
                      [];

                setProperties(propertyItems);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load your owner dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const getNumber = (...values) => {
        for (const value of values) {
            if (typeof value === "number") {
                return value;
            }
        }

        return 0;
    };

    if (loading) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50">
                <Loader2
                    size={34}
                    className="animate-spin text-blue-600"
                />
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Building2 size={26} />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Dashboard unavailable
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    const totalProperties = getNumber(
        dashboard?.totalProperties,
        dashboard?.propertyCount,
        dashboard?.properties
    );

    const totalRooms = getNumber(
        dashboard?.totalRooms,
        dashboard?.roomCount,
        dashboard?.rooms
    );

    const totalRequests = getNumber(
        dashboard?.totalRequests,
        dashboard?.rentalRequests,
        dashboard?.requestCount
    );

    const totalBookings = getNumber(
        dashboard?.totalBookings,
        dashboard?.bookingCount,
        dashboard?.bookings
    );

    return (
        <section className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-950 text-white">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-blue-400">
                                OWNER WORKSPACE
                            </p>

                            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Manage your rental business
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                Manage properties, rooms, rental requests,
                                and bookings from one place.
                            </p>
                        </div>

                        <Link
                            to="/owner/properties"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                        >
                            <Plus size={18} />
                            Add property
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<Building2 size={21} />}
                        label="Properties"
                        value={totalProperties}
                        color="blue"
                    />

                    <StatCard
                        icon={<Home size={21} />}
                        label="Rooms"
                        value={totalRooms}
                        color="violet"
                    />

                    <StatCard
                        icon={<Clock3 size={21} />}
                        label="Rental requests"
                        value={totalRequests}
                        color="amber"
                    />

                    <StatCard
                        icon={<CalendarCheck size={21} />}
                        label="Bookings"
                        value={totalBookings}
                        color="emerald"
                    />
                </div>

                {/* Quick actions */}
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <QuickAction
                        icon={<Building2 size={21} />}
                        title="Properties"
                        description="Create and manage your rental properties."
                        href="/owner/properties"
                    />

                    <QuickAction
                        icon={<Users size={21} />}
                        title="Rental requests"
                        description="Review requests from potential tenants."
                        href="/owner/requests"
                    />

                    <QuickAction
                        icon={<CalendarCheck size={21} />}
                        title="Bookings"
                        description="Track active and completed bookings."
                        href="/owner/bookings"
                    />
                </div>

                {/* Properties */}
                <div className="mt-10">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Your properties
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Recently available properties
                            </p>
                        </div>

                        <Link
                            to="/owner/properties"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Manage all
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {properties.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Building2 size={28} />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                No properties yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Add your first property to start receiving
                                rental requests.
                            </p>

                            <Link
                                to="/owner/properties"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                <Plus size={17} />
                                Add property
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {properties.slice(0, 6).map((property) => {
                                const image =
                                    property.images?.[0] ||
                                    property.image ||
                                    "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80";

                                return (
                                    <div
                                        key={property._id}
                                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={image}
                                                alt={
                                                    property.title ||
                                                    "Property"
                                                }
                                                className="h-full w-full object-cover"
                                            />

                                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur">
                                                {property.propertyType ||
                                                    "PROPERTY"}
                                            </span>

                                            {property.isAvailable && (
                                                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">
                                                    <CheckCircle2 size={13} />
                                                    Available
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <h3 className="line-clamp-1 font-bold text-slate-900">
                                                {property.title ||
                                                    property.name ||
                                                    "Untitled property"}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {property.city ||
                                                    property.location ||
                                                    "Location unavailable"}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                                <span className="text-sm font-bold text-slate-900">
                                                    ₹
                                                    {(
                                                        property.monthlyRent ||
                                                        property.rent ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                    <span className="ml-1 text-xs font-medium text-slate-400">
                                                        / month
                                                    </span>
                                                </span>

                                                <Link
                                                    to={`/properties/${property._id}`}
                                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const styles = {
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
                >
                    {icon}
                </div>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {value}
            </p>
        </div>
    );
};

const QuickAction = ({ icon, title, description, href }) => {
    return (
        <Link
            to={href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {icon}
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
                Open
                <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
};

export default OwnerDashboard;