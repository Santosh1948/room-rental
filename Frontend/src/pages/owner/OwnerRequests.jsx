import { useEffect, useState } from "react";
import {
    ClipboardList,
    Check,
    X,
    Loader2,
    User,
    MapPin,
    BedDouble,
    CalendarDays,
    CalendarCheck,
} from "lucide-react";

import rentalRequestService from "../../services/rentalRequestService";
import bookingService from "../../services/bookingService";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    CANCELLED: "bg-slate-100 text-slate-600",
};

const OwnerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await rentalRequestService.getOwnerRequests();

            const list = Array.isArray(data)
                ? data
                : data?.requests || data?.data || [];

            setRequests(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load rental requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleAction = async (id, action) => {
        const message =
            action === "approve"
                ? "Approve this rental request?"
                : "Reject this rental request?";

        if (!window.confirm(message)) return;

        try {
            setActionId(id);
            setError("");
            setSuccess("");

            if (action === "approve") {
                await rentalRequestService.approveRequest(id);
            } else {
                await rentalRequestService.rejectRequest(id);
            }

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === id
                        ? {
                              ...request,
                              status:
                                  action === "approve"
                                      ? "APPROVED"
                                      : "REJECTED",
                          }
                        : request
                )
            );

            setSuccess(
                action === "approve"
                    ? "Rental request approved."
                    : "Rental request rejected."
            );

            setTimeout(() => setSuccess(""), 2500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    `Unable to ${action} request.`
            );
        } finally {
            setActionId(null);
        }
    };
    const handleCreateBooking = async (request) => {
    const confirmed = window.confirm(
        "Create a booking for this approved rental request?"
    );

    if (!confirmed) return;

    try {
        setBookingId(request._id);
        setError("");
        setSuccess("");

        await bookingService.createBooking(request._id);

        setSuccess(
            "Booking created successfully. You can now manage it from Owner Bookings."
        );

        setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
        setError(
            err.response?.data?.message ||
                "Unable to create booking."
        );
    } finally {
        setBookingId(null);
    }
};

    const getUserName = (request) =>
        request.user?.name ||
        request.user?.fullName ||
        "Unknown renter";

    const getPropertyName = (request) =>
        request.property?.title ||
        request.property?.name ||
        "Property";

    const getRoomNumber = (request) =>
        request.room?.roomNumber ||
        request.room?.number ||
        "Room";

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <ClipboardList size={18} />
                        Owner Workspace
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Rental Requests
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Review applications from renters and decide
                        whether to approve or reject their requests.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {success}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-48 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <ClipboardList size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No rental requests
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            New renter applications will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => {
                            const status =
                                request.status || "PENDING";

                            return (
                                <article
                                    key={request._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Main info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    {getPropertyName(
                                                        request
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

                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <User
                                                        size={17}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        {getUserName(
                                                            request
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <BedDouble
                                                        size={17}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        {getRoomNumber(
                                                            request
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <MapPin
                                                        size={17}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        {request
                                                            .property
                                                            ?.address
                                                            ?.city ||
                                                            "Location unavailable"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <CalendarDays
                                                        size={17}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        {request.createdAt
                                                            ? new Date(
                                                                  request.createdAt
                                                              ).toLocaleDateString(
                                                                  "en-IN",
                                                                  {
                                                                      day: "2-digit",
                                                                      month: "short",
                                                                      year: "numeric",
                                                                  }
                                                              )
                                                            : "Date unavailable"}
                                                    </span>
                                                </div>
                                            </div>

                                            {request.message && (
                                                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Renter Message
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                                        {
                                                            request.message
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {status === "PENDING" && (
                                            <div className="flex shrink-0 gap-2 lg:w-48 lg:flex-col">
                                                <button
                                                    disabled={
                                                        actionId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            request._id,
                                                            "approve"
                                                        )
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionId ===
                                                    request._id ? (
                                                        <Loader2
                                                            size={17}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Check
                                                            size={17}
                                                        />
                                                    )}
                                                    Approve
                                                </button>

                                                <button
                                                    disabled={
                                                        actionId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            request._id,
                                                            "reject"
                                                        )
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                                                >
                                                    <X size={17} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {status === "APPROVED" && (
                                            <div className="shrink-0 lg:w-48">
                                                <button
                                                    disabled={
                                                        bookingId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleCreateBooking(
                                                            request
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {bookingId ===
                                                    request._id ? (
                                                        <Loader2
                                                            size={17}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <CalendarCheck
                                                            size={17}
                                                        />
                                                    )}

                                                    {bookingId ===
                                                    request._id
                                                        ? "Creating..."
                                                        : "Create Booking"}
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

export default OwnerRequests;