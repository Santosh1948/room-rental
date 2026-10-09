import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Heart,
    Loader2,
    Send,
    Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import propertyService from "../../services/propertyService";
import roomService from "../../services/roomService";
import reviewService from "../../services/reviewService";
import favoriteService from "../../services/favoriteService";
import rentalRequestService from "../../services/rentalRequestService";
import {
    addFavorite,
    removeFavorite,
} from "../../store/slices/favoriteSlice";
import PageContainer from "../../components/common/PageContainer";
import SectionTitle from "../../components/common/SectionTitle";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const favoriteItems = useSelector(
        (state) => state.favorites.items
    );

    const isFavorite = favoriteItems.some(
        (item) => item._id === id
    );

    const [property, setProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [requestingRoom, setRequestingRoom] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [requestSuccess, setRequestSuccess] = useState("");

    const fetchPropertyDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [propertyData, roomData, reviewData] =
                await Promise.all([
                    propertyService.getPropertyById(id),
                    roomService.getRoomsByProperty(id),
                    reviewService.getPropertyReviews(id),
                ]);

            setProperty(
                propertyData.property ||
                    propertyData.data ||
                    propertyData
            );

            setRooms(
                Array.isArray(roomData)
                    ? roomData
                    : roomData.rooms || roomData.data || []
            );

            setReviews(
                Array.isArray(reviewData)
                    ? reviewData
                    : reviewData.reviews ||
                          reviewData.data ||
                          []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load property details."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        let isCurrent = true;
        void Promise.resolve().then(() => {
            if (isCurrent) {
                return fetchPropertyDetails();
            }
        });

        return () => {
            isCurrent = false;
        };
    }, [fetchPropertyDetails]);

    const handleFavorite = async () => {
        if (!isAuthenticated || user?.role !== "USER") {
            navigate("/login");
            return;
        }

        try {
            if (isFavorite) {
                await favoriteService.removeFavorite(id);

                dispatch(removeFavorite(id));
            } else {
                const response =
                    await favoriteService.addFavorite(id);

                const favorite =
                    response.favorite || response.data || response;

                dispatch(addFavorite(favorite));
            }
        } catch (error) {
            console.error(
                "Favorite action failed:",
                error
            );
        }
    };

    const handleRentalRequest = async (roomId) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "USER") {
            setRequestError(
                "Only rental users can send rental requests."
            );
            return;
        }

        try {
            setRequestLoading(true);
            setRequestError("");
            setRequestSuccess("");

            await rentalRequestService.createRentalRequest(
                id,
                roomId,
                {
                    message: requestMessage,
                }
            );

            setRequestSuccess(
                "Rental request sent successfully."
            );

            setRequestMessage("");
            setRequestingRoom(null);
        } catch (err) {
            setRequestError(
                err.response?.data?.message ||
                    "Unable to send rental request."
            );
        } finally {
            setRequestLoading(false);
        }
    };

    const image =
        property?.image ||
        property?.images?.[0] ||
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80";
    const address =
        typeof property?.address === "string"
            ? property.address
            : property?.address?.city;
    const location =
        address ||
        property?.location ||
        property?.city ||
        "Location unavailable";
    const amenities = Array.isArray(property?.amenities)
        ? property.amenities
        : Array.isArray(property?.features)
          ? property.features
          : [];
    const startingRent =
        property?.monthlyRent ||
        property?.rent ||
        property?.price ||
        "—";

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
            <PageContainer>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                    ← Back to properties
                </button>

                {loading && (
                    <LoadingSpinner text="Loading property..." />
                )}

                {!loading && error && (
                    <ErrorState
                        message={error}
                        onRetry={fetchPropertyDetails}
                    />
                )}

                {!loading && !error && !property && (
                    <EmptyState
                        title="Property not found"
                        message="This property may no longer exist."
                        action={
                            <Link
                                to="/properties"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                            >
                                <ArrowLeft size={17} />
                                Back to properties
                            </Link>
                        }
                    />
                )}

                {!loading && !error && property && (
                    <>
                        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <img
                                src={image}
                                alt={property.title || property.name || "Property"}
                                className="h-[280px] w-full object-cover sm:h-[420px] lg:h-[500px]"
                            />

                            <div className="p-5 sm:p-7">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {property.propertyType || "Property"}
                                            </span>
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {property.isAvailable === false
                                                    ? "Unavailable"
                                                    : "Available"}
                                            </span>
                                        </div>

                                        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                            {property.title ||
                                                property.name ||
                                                "Property"}
                                        </h1>

                                        <p className="mt-3 text-sm text-slate-500 sm:text-base">
                                            📍 {location}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleFavorite}
                                        aria-label={
                                            isFavorite
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:scale-105"
                                    >
                                        <Heart
                                            size={20}
                                            className={
                                                isFavorite
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-slate-600"
                                            }
                                        />
                                    </button>
                                </div>

                                {property.description && (
                                    <div className="mt-7 border-t border-slate-100 pt-6">
                                        <SectionTitle title="About this property" />
                                        <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
                                            {property.description}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-7 border-t border-slate-100 pt-6">
                                    <SectionTitle
                                        title="Amenities"
                                        description="Everything available at this property."
                                    />
                                    {amenities.length > 0 ? (
                                        <ul className="flex flex-wrap gap-2">
                                            {amenities.map((amenity, index) => (
                                                <li
                                                    key={`${amenity}-${index}`}
                                                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                                                >
                                                    {amenity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <EmptyState
                                            title="No amenities listed"
                                            message="The property owner has not added amenities yet."
                                        />
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
                            <div className="space-y-10">
                                <section
                                    id="available-rooms"
                                    className="scroll-mt-8"
                                >
                                    <SectionTitle
                                        title="Available rooms"
                                        description="Choose a room that fits your budget and requirements."
                                    />

                                    {requestSuccess && (
                                        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                            {requestSuccess}
                                        </div>
                                    )}

                                    {requestError && (
                                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                            {requestError}
                                        </div>
                                    )}

                                    {rooms.length === 0 ? (
                                        <div className="mt-5">
                                            <EmptyState
                                                title="No rooms available"
                                                message="The owner hasn't added available rooms yet."
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                                            {rooms.map((room) => (
                                                <div
                                                    key={room._id}
                                                    className="rounded-2xl border border-slate-200 p-5"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-900">
                                                                {room.roomNumber
                                                                    ? `Room ${room.roomNumber}`
                                                                    : room.title ||
                                                                      "Available room"}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {room.roomType || "Room"}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-extrabold text-slate-900">
                                                                ₹
                                                                {room.rent ||
                                                                    room.price ||
                                                                    "—"}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                / month
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 flex flex-wrap gap-2">
                                                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                                            {room.status || "AVAILABLE"}
                                                        </span>
                                                        {room.capacity && (
                                                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                                                Capacity: {room.capacity}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {requestingRoom === room._id ? (
                                                        <div className="mt-5 border-t border-slate-100 pt-5">
                                                            <textarea
                                                                value={requestMessage}
                                                                onChange={(event) =>
                                                                    setRequestMessage(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder="Add a message to the owner (optional)"
                                                                rows={3}
                                                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                            />
                                                            <div className="mt-3 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRentalRequest(
                                                                            room._id
                                                                        )
                                                                    }
                                                                    disabled={requestLoading}
                                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                                                >
                                                                    {requestLoading ? (
                                                                        <Loader2
                                                                            size={17}
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <Send size={17} />
                                                                    )}
                                                                    Send request
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setRequestingRoom(null);
                                                                        setRequestMessage("");
                                                                    }}
                                                                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setRequestingRoom(room._id)
                                                            }
                                                            disabled={
                                                                room.status &&
                                                                room.status !== "AVAILABLE"
                                                            }
                                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                                                        >
                                                            <Send size={17} />
                                                            Request this room
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <SectionTitle
                                        title="Reviews"
                                        description="See what previous tenants have to say."
                                    />
                                    {reviews.length === 0 ? (
                                        <div className="mt-5">
                                            <EmptyState
                                                title="No reviews yet"
                                                message="There are no reviews for this property yet."
                                            />
                                        </div>
                                    ) : (
                                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                                            {reviews.map((review) => (
                                                <div
                                                    key={review._id}
                                                    className="rounded-2xl border border-slate-200 p-5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-bold text-slate-900">
                                                            {review.user?.name ||
                                                                review.userName ||
                                                                "Guest"}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star
                                                                size={15}
                                                                fill="currentColor"
                                                            />
                                                            <span className="text-sm font-bold">
                                                                {review.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="mt-4 text-sm leading-6 text-slate-500">
                                                        {review.comment ||
                                                            "No comment provided."}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>

                            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
                                <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                                    <Star size={16} fill="currentColor" />
                                    {property.rating || "4.5"}
                                    <span className="ml-1 text-slate-400">
                                        ({reviews.length} reviews)
                                    </span>
                                </div>
                                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Starting from
                                </p>
                                <div className="mt-1 flex items-end gap-1">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        ₹{startingRent}
                                    </span>
                                    <span className="mb-1 text-sm text-slate-500">
                                        / month
                                    </span>
                                </div>
                                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600">
                                    <CheckCircle2 size={17} />
                                    {property.isAvailable === false
                                        ? "Currently unavailable"
                                        : "Currently available"}
                                </div>
                                <div className="mt-6 border-t border-slate-100 pt-5">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Rental request
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Choose an available room to send a rental request to the owner.
                                    </p>
                                    <a
                                        href="#available-rooms"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        <Send size={17} />
                                        View available rooms
                                    </a>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </PageContainer>
        </div>
    );
};

export default PropertyDetails;