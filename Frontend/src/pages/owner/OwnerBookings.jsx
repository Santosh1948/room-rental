import { useEffect, useState } from "react";
import {
    CalendarCheck,
    CheckCircle2,
    Loader2,
    User,
    Building2,
    BedDouble,
    CalendarDays,
    IndianRupee,
    XCircle,
} from "lucide-react";

import bookingService from "../../services/bookingService";

const statusStyles = {
    ACTIVE: "bg-blue-50 text-blue-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
};

const OwnerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await bookingService.getOwnerBookings();

            const list = Array.isArray(data)
                ? data
                : data?.bookings || data?.data || [];

            setBookings(list);
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

    const handleComplete = async (id) => {
        const confirmed = window.confirm(
            "Mark this booking as completed?"
        );

        if (!confirmed) return;

        try {
            setActionId(id);
            setError("");
            setSuccess("");

            await bookingService.completeBooking(id);

            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === id
                        ? {
                              ...booking,
                              status: "COMPLETED",
                          }
                        : booking
                )
            );

            setSuccess("Booking marked as completed.");

            setTimeout(() => setSuccess(""), 2500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to complete booking."
            );
        } finally {
            setActionId(null);
        }
    };

    const getUserName = (booking) =>
        booking.user?.name ||
        booking.user?.fullName ||
        booking.renter?.name ||
        "Renter";

    const getPropertyName = (booking) =>
        booking.property?.title ||
        booking.property?.name ||
        "Property";

    const getRoomNumber = (booking) =>
        booking.room?.roomNumber ||
        booking.room?.number ||
        "Room";

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <CalendarCheck size={18} />
                        Owner Workspace
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Bookings
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Track your active rentals and manage completed
                        bookings.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        <XCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <CalendarCheck size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No bookings yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Once you create a booking from an approved
                            rental request, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => {
                            const status =
                                booking.status || "ACTIVE";

                            return (
                                <article
                                    key={booking._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Booking information */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    {getPropertyName(
                                                        booking
                                                    )}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        statusStyles[
                                                            status
                                                        ] ||
                                                        "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </div>

                                            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                        <User
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Renter
                                                        </p>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {getUserName(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                        <BedDouble
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Room
                                                        </p>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {getRoomNumber(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                        <Building2
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Property
                                                        </p>

                                                        <p className="truncate text-sm font-semibold text-slate-800">
                                                            {getPropertyName(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                        <IndianRupee
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Monthly Rent
                                                        </p>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            ₹
                                                            {Number(
                                                                booking.rent ||
                                                                    booking.monthlyRent ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                        <CalendarDays
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Start Date
                                                        </p>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {formatDate(
                                                                booking.startDate ||
                                                                    booking.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                        <CalendarDays
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Booking Date
                                                        </p>

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {formatDate(
                                                                booking.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                                                <p className="text-xs text-slate-400">
                                                    Booking ID
                                                </p>

                                                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                                                    {booking._id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {status === "ACTIVE" && (
                                            <div className="shrink-0 lg:w-48">
                                                <button
                                                    disabled={
                                                        actionId ===
                                                        booking._id
                                                    }
                                                    onClick={() =>
                                                        handleComplete(
                                                            booking._id
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionId ===
                                                    booking._id ? (
                                                        <Loader2
                                                            size={17}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={17}
                                                        />
                                                    )}

                                                    Mark Completed
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OwnerBookings;