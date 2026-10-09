import { useEffect, useMemo, useState } from "react";
import {
    CalendarCheck,
    Search,
    RefreshCw,
    User,
    Building2,
    DoorOpen,
    CheckCircle2,
    Clock3,
    XCircle,
    AlertCircle,
} from "lucide-react";

import adminService from "../../services/adminService";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getBookings();

            const bookingList = Array.isArray(data)
                ? data
                : data?.bookings || [];

            setBookings(bookingList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const getStatus = (booking) => {
        return (
            booking.status ||
            booking.bookingStatus ||
            "UNKNOWN"
        ).toString().toUpperCase();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "ACTIVE":
                return {
                    className:
                        "bg-blue-50 text-blue-700",
                    icon: Clock3,
                };

            case "COMPLETED":
                return {
                    className:
                        "bg-emerald-50 text-emerald-700",
                    icon: CheckCircle2,
                };

            case "CANCELLED":
            case "CANCELED":
                return {
                    className:
                        "bg-red-50 text-red-700",
                    icon: XCircle,
                };

            default:
                return {
                    className:
                        "bg-slate-100 text-slate-700",
                    icon: Clock3,
                };
        }
    };

    const getUserName = (booking) => {
        return (
            booking.user?.name ||
            booking.user?.fullName ||
            booking.user?.email ||
            booking.renter?.name ||
            booking.renter?.email ||
            "Unknown renter"
        );
    };

    const getOwnerName = (booking) => {
        return (
            booking.owner?.name ||
            booking.owner?.fullName ||
            booking.owner?.email ||
            "Unknown owner"
        );
    };

    const getPropertyName = (booking) => {
        return (
            booking.property?.title ||
            booking.property?.name ||
            booking.propertyName ||
            "Unknown property"
        );
    };

    const getRoomName = (booking) => {
        return (
            booking.room?.roomNumber ||
            booking.room?.name ||
            booking.roomNumber ||
            "Room"
        );
    };

    const getRent = (booking) => {
        const rent =
            booking.rent ??
            booking.monthlyRent ??
            booking.amount;

        if (rent === undefined || rent === null) {
            return "—";
        }

        return `₹${Number(rent).toLocaleString("en-IN")}`;
    };

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const query = search.trim().toLowerCase();

            const renter =
                booking.user?.name ||
                booking.user?.email ||
                booking.renter?.name ||
                booking.renter?.email ||
                "";

            const owner =
                booking.owner?.name ||
                booking.owner?.email ||
                "";

            const property =
                booking.property?.title ||
                booking.property?.name ||
                booking.propertyName ||
                "";

            const room =
                booking.room?.roomNumber ||
                booking.roomNumber ||
                "";

            const matchesSearch =
                !query ||
                renter.toLowerCase().includes(query) ||
                owner.toLowerCase().includes(query) ||
                property.toLowerCase().includes(query) ||
                room.toString().toLowerCase().includes(query) ||
                booking._id?.toLowerCase().includes(query);

            const status = getStatus(booking);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, search, statusFilter]);

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
                    <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />

                    <div className="mt-8 h-20 animate-pulse rounded-2xl bg-white" />

                    <div className="mt-6 space-y-4">
                        {Array.from({ length: 6 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-32 animate-pulse rounded-2xl bg-white"
                                />
                            )
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
                                <CalendarCheck size={22} />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Booking Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor all Roomly booking activity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadBookings}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />
                        <span>{error}</span>
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search renter, owner, property, room or booking ID..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">
                                All Status
                            </option>
                            <option value="ACTIVE">
                                Active
                            </option>
                            <option value="COMPLETED">
                                Completed
                            </option>
                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredBookings.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-900">
                                {bookings.length}
                            </span>{" "}
                            bookings
                        </p>
                    </div>
                </div>

                {/* Desktop */}
                <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px]">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Property
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Renter
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Owner
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Rent
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Dates
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map(
                                    (booking) => {
                                        const status =
                                            getStatus(
                                                booking
                                            );

                                        const statusStyle =
                                            getStatusStyle(
                                                status
                                            );

                                        const StatusIcon =
                                            statusStyle.icon;

                                        return (
                                            <tr
                                                key={
                                                    booking._id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                                            <Building2
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-slate-900">
                                                                {getPropertyName(
                                                                    booking
                                                                )}
                                                            </p>

                                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                                <DoorOpen
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                {getRoomName(
                                                                    booking
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <User
                                                            size={
                                                                16
                                                            }
                                                            className="text-slate-400"
                                                        />

                                                        <span className="text-sm font-medium text-slate-700">
                                                            {getUserName(
                                                                booking
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-slate-600">
                                                    {getOwnerName(
                                                        booking
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="font-bold text-slate-900">
                                                        {getRent(
                                                            booking
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-slate-400">
                                                        Start
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-700">
                                                        {formatDate(
                                                            booking.startDate ||
                                                                booking.moveInDate ||
                                                                booking.createdAt
                                                        )}
                                                    </p>

                                                    <p className="mt-2 text-xs text-slate-400">
                                                        End
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-700">
                                                        {formatDate(
                                                            booking.endDate
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle.className}`}
                                                    >
                                                        <StatusIcon
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="mt-6 space-y-4 lg:hidden">
                    {filteredBookings.map(
                        (booking) => {
                            const status =
                                getStatus(booking);

                            const statusStyle =
                                getStatusStyle(status);

                            const StatusIcon =
                                statusStyle.icon;

                            return (
                                <article
                                    key={booking._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                                <Building2
                                                    size={20}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate font-bold text-slate-900">
                                                    {getPropertyName(
                                                        booking
                                                    )}
                                                </h2>

                                                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                                    <DoorOpen
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    {getRoomName(
                                                        booking
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle.className}`}
                                        >
                                            <StatusIcon
                                                size={13}
                                            />
                                            {status}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Renter
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                                {getUserName(
                                                    booking
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Owner
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                                {getOwnerName(
                                                    booking
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Monthly Rent
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                {getRent(
                                                    booking
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Booking ID
                                            </p>

                                            <p className="mt-1 truncate font-mono text-xs text-slate-600">
                                                {booking._id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Start Date
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {formatDate(
                                                    booking.startDate ||
                                                        booking.moveInDate ||
                                                        booking.createdAt
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                End Date
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {formatDate(
                                                    booking.endDate
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>

                {/* Empty */}
                {filteredBookings.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <CalendarCheck
                            size={44}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                            No bookings found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or status
                            filter.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminBookings;