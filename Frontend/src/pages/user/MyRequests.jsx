import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    Clock3,
    Loader2,
    XCircle,
} from "lucide-react";

import rentalRequestService from "../../services/rentalRequestService";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [canceling, setCanceling] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await rentalRequestService.getMyRequests();

            setRequests(
                Array.isArray(data)
                    ? data
                    : data.requests || data.rentalRequests || data.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load your rental requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void Promise.resolve().then(() => loadRequests());
    }, []);

    const handleCancel = async (id) => {
        try {
            setCanceling(id);

            await rentalRequestService.cancelRequest(id);

            setRequests((current) =>
                current.map((request) =>
                    request._id === id
                        ? { ...request, status: "CANCELLED" }
                        : request
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to cancel this request."
            );
        } finally {
            setCanceling(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
            <PageContainer>
                <PageHeader
                    title="My rental requests"
                    description="Track the requests you've sent to property owners."
                />

                {loading && (
                    <LoadingSpinner text="Loading your requests..." />
                )}

                {!loading && error && (
                    <ErrorState
                        message={error}
                        onRetry={loadRequests}
                    />
                )}

                {!loading &&
                    !error &&
                    requests.length === 0 && (
                        <EmptyState
                            title="No rental requests yet"
                            message="Browse available properties and send a request when you find a place you like."
                            action={
                                <Link
                                    to="/properties"
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Explore properties
                                </Link>
                            }
                        />
                    )}

                {!loading &&
                    !error &&
                    requests.length > 0 && (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <RequestCard
                                    key={request._id}
                                    request={request}
                                    canceling={canceling === request._id}
                                    onCancel={() =>
                                        handleCancel(request._id)
                                    }
                                />
                            ))}
                        </div>
                    )}
            </PageContainer>
        </div>
    );
};

const RequestCard = ({ request, canceling, onCancel }) => {
    const property =
        request.property ||
        request.propertyId ||
        request.room?.property;

    const room = request.room || request.roomId;

    const status = String(request.status || "PENDING").toUpperCase();

    const statusConfig = {
        PENDING: {
            icon: Clock3,
            className: "bg-amber-50 text-amber-700",
        },
        APPROVED: {
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-700",
        },
        REJECTED: {
            icon: XCircle,
            className: "bg-red-50 text-red-700",
        },
        CANCELLED: {
            icon: XCircle,
            className: "bg-slate-100 text-slate-600",
        },
    };

    const config =
        statusConfig[status] || statusConfig.PENDING;

    const Icon = config.icon;

    const propertyName =
        property?.title || property?.name || "Rental property";
    const roomName = room?.roomNumber
        ? `Room ${room.roomNumber}`
        : room?.title || room?.name;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                            {propertyName}
                        </h3>

                        {roomName && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {roomName}
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        {property?.city ||
                            property?.location ||
                            property?.address?.city ||
                            "Location unavailable"}
                    </p>

                    {request.message && (
                        <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            "{request.message}"
                        </p>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                        Requested on{" "}
                        {request.createdAt
                            ? new Date(
                                  request.createdAt
                              ).toLocaleDateString()
                            : "recently"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.className}`}
                    >
                        <Icon size={13} />
                        {status}
                    </span>

                    {property?._id && (
                        <Link
                            to={`/properties/${property._id}`}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            View property
                        </Link>
                    )}

                    {status === "PENDING" && (
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
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default MyRequests;