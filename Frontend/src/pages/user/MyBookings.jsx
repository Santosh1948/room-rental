import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Home,
    IndianRupee,
    Loader2,
    XCircle,
} from "lucide-react";

import bookingService from "../../services/bookingService";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [canceling, setCanceling] = useState(null);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await bookingService.getMyBookings();

            setBookings(
                Array.isArray(data)
                    ? data
                    : data.bookings || data.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load your bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancel = async (id) => {
        try {
            setCanceling(id);

            await bookingService.cancelBooking(id);

            setBookings((current) =>
                current.map((booking) =>
                    booking._id === id
                        ? { ...booking, status: "CANCELLED" }
                        : booking
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to cancel booking."
            );
        } finally {
            setCanceling(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <p className="text-sm font-semibold text-blue-400">
                        Your stay
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-white">
                        My bookings
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage your confirmed and previous rental bookings.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-40 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Home size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No bookings yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Your approved rental bookings will appear here.
                        </p>

                        <Link
                            to="/properties"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Find a property
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                canceling={
                                    canceling === booking._id
                                }
                                onCancel={() =>
                                    handleCancel(booking._id)
                                }
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const BookingCard = ({
    booking,
    canceling,
    onCancel,
}) => {
    const property =
        booking.property ||
        booking.rentalRequest?.property;

    const room =
        booking.room ||
        booking.rentalRequest?.room;

    const status = String(
        booking.status || "ACTIVE"
    ).toUpperCase();

    const statusConfig = {
        ACTIVE: {
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-700",
        },
        CONFIRMED: {
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-700",
        },
        COMPLETED: {
            icon: CheckCircle2,
            className: "bg-blue-50 text-blue-700",
        },
        CANCELLED: {
            icon: XCircle,
            className: "bg-red-50 text-red-700",
        },
        PENDING: {
            icon: Clock3,
            className: "bg-amber-50 text-amber-700",
        },
    };

    const config =
        statusConfig[status] || statusConfig.ACTIVE;

    const Icon = config.icon;

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Home size={25} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">
                                {property?.title ||
                                    property?.name ||
                                    "Rental booking"}
                            </h2>

                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${config.className}`}
                            >
                                <Icon size={13} />
                                {status}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            {property?.city ||
                                property?.location ||
                                "Location unavailable"}
                            {room?.roomNumber
                                ? ` • Room ${room.roomNumber}`
                                : ""}
                        </p>
                    </div>

                    <div className="text-left md:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Rent
                        </p>

                        <p className="mt-1 flex items-center text-xl font-extrabold text-slate-900">
                            <IndianRupee size={17} />
                            {booking.amount ||
                                booking.rent ||
                                room?.rent ||
                                "—"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <InfoItem
                        icon={CalendarDays}
                        label="Start date"
                        value={
                            booking.startDate
                                ? new Date(
                                      booking.startDate
                                  ).toLocaleDateString()
                                : "Not specified"
                        }
                    />

                    <InfoItem
                        icon={CalendarDays}
                        label="End date"
                        value={
                            booking.endDate
                                ? new Date(
                                      booking.endDate
                                  ).toLocaleDateString()
                                : "Ongoing"
                        }
                    />

                    <InfoItem
                        icon={CheckCircle2}
                        label="Booking ID"
                        value={
                            booking._id
                                ? booking._id.slice(-8)
                                : "—"
                        }
                    />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {property?._id && (
                        <Link
                            to={`/properties/${property._id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            View property
                            <ArrowRight size={14} />
                        </Link>
                    )}

                    {status !== "CANCELLED" &&
                        status !== "COMPLETED" && (
                            <button
                                onClick={onCancel}
                                disabled={canceling}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                            >
                                {canceling && (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                )}
                                Cancel booking
                            </button>
                        )}
                </div>
            </div>
        </article>
    );
};

const InfoItem = ({
    icon: Icon,
    label,
    value,
}) => (
    <div className="rounded-xl bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-slate-400">
            <Icon size={15} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
                {label}
            </span>
        </div>

        <p className="mt-1 text-sm font-semibold text-slate-700">
            {value}
        </p>
    </div>
);

export default MyBookings;