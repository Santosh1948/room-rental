import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Heart,
    Loader2,
    MapPin,
    MessageSquare,
    Send,
    Star,
} from "lucide-react";
import { useSelector } from "react-redux";

import propertyService from "../../services/propertyService";
import roomService from "../../services/roomService";
import reviewService from "../../services/reviewService";
import favoriteService from "../../services/favoriteService";
import rentalRequestService from "../../services/rentalRequestService";
import { unwrapList, unwrapOne } from "../../utils/apiHelpers";
import EmptyState from "../../components/common/EmptyState";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [property, setProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [favorite, setFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [requestingRoom, setRequestingRoom] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestMoveInDate, setRequestMoveInDate] = useState("");
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [requestSuccess, setRequestSuccess] = useState("");

    useEffect(() => {
        const loadProperty = async () => {
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
                    unwrapOne(propertyData, ["property", "data"])
                );

                setRooms(unwrapList(roomData, ["rooms"]));
                setReviews(unwrapList(reviewData, ["reviews"]));
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load property details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProperty();
    }, [id]);

    useEffect(() => {
        const loadFavoriteState = async () => {
            if (!isAuthenticated || user?.role !== "USER") return;

            try {
                const data = await favoriteService.getFavorites();
                const favorites = unwrapList(data, ["favorites"]);
                const isSaved = favorites.some(
                    (item) =>
                        item.property?._id === id ||
                        item.property === id
                );
                setFavorite(isSaved);
            } catch {
                setFavorite(false);
            }
        };

        loadFavoriteState();
    }, [id, isAuthenticated, user?.role]);

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "USER") {
            return;
        }

        try {
            setFavoriteLoading(true);

            if (favorite) {
                await favoriteService.removeFavorite(id);
                setFavorite(false);
            } else {
                await favoriteService.addFavorite(id);
                setFavorite(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFavoriteLoading(false);
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

        if (!requestMoveInDate) {
            setRequestError("Please choose a move-in date.");
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
                    moveInDate: requestMoveInDate,
                    message: requestMessage,
                }
            );

            setRequestSuccess(
                "Rental request sent successfully."
            );

            setRequestMessage("");
            setRequestMoveInDate("");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-16">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="h-8 w-32 rounded bg-slate-200" />

                    <div className="mt-8 grid gap-5 lg:grid-cols-3">
                        <div className="h-[450px] rounded-3xl bg-slate-200 lg:col-span-2" />
                        <div className="h-[450px] rounded-3xl bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Property not found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {error || "This property may no longer exist."}
                    </p>

                    <Link
                        to="/properties"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to properties
                    </Link>
                </div>
            </div>
        );
    }

    const image =
        property.image ||
        property.images?.[0] ||
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80";
    const propertyAddress =
        typeof property.address === "string"
            ? property.address
            : [
                  property.address?.street,
                  property.address?.city,
                  property.address?.state,
                  property.address?.pincode,
              ]
                  .filter(Boolean)
                  .join(", ") ||
              property.location ||
              property.city ||
              "Location unavailable";
    const hasAvailableRooms = rooms.some(
        (room) => room.status === "AVAILABLE"
    );
    const roomRents = rooms
        .map((room) => Number(room.rent ?? room.price))
        .filter((rent) => Number.isFinite(rent) && rent > 0);
    const startingRent =
        property.rent ??
        property.price ??
        (roomRents.length ? Math.min(...roomRents) : null);
    const selectedRoom = rooms.find(
        (room) => room._id === requestingRoom
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top */}
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                >
                    <ArrowLeft size={17} />
                    Back to properties
                </Link>
            </div>

            {/* Property hero */}
            <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-200">
                        <img
                            src={image}
                            alt={property.title || "Property"}
                            className="h-[420px] w-full object-cover sm:h-[520px]"
                        />

                        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 backdrop-blur">
                            {property.propertyType || "Property"}
                        </div>

                        <button
                            onClick={handleFavorite}
                            disabled={favoriteLoading}
                            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur transition hover:text-red-500 disabled:opacity-60"
                            title="Favorite"
                        >
                            {favoriteLoading ? (
                                <Loader2
                                    size={19}
                                    className="animate-spin"
                                />
                            ) : (
                                <Heart
                                    size={20}
                                    fill={
                                        favorite
                                            ? "currentColor"
                                            : "none"
                                    }
                                    className={
                                        favorite
                                            ? "text-red-500"
                                            : ""
                                    }
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                                <Star
                                    size={16}
                                    fill="currentColor"
                                />
                                {property.rating || "4.5"}
                                <span className="ml-1 text-slate-400">
                                    ({reviews.length} reviews)
                                </span>
                            </div>

                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                                {property.title ||
                                    property.name ||
                                    "Beautiful property"}
                            </h1>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <MapPin size={17} />
                                {propertyAddress}
                            </div>

                            <p className="mt-6 text-sm leading-7 text-slate-500">
                                {property.description ||
                                    "A comfortable property with everything you need for convenient living."}
                            </p>

                            {(property.amenities || []).length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {property.amenities.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Starting from
                            </p>

                            <div className="mt-1 flex items-end gap-1">
                                <span className="text-3xl font-extrabold text-slate-900">
                                    ₹
                                    {startingRent ?? "—"}
                                </span>

                                <span className="mb-1 text-sm text-slate-500">
                                    / month
                                </span>
                            </div>

                            <div
                                className={`mt-5 flex items-center gap-2 text-sm font-medium ${
                                    hasAvailableRooms
                                        ? "text-emerald-600"
                                        : "text-slate-500"
                                }`}
                            >
                                <CheckCircle2 size={17} />
                                {!hasAvailableRooms
                                    ? "Currently unavailable"
                                    : "Currently available"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms */}
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div>
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                    Available spaces
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                    Choose your room
                                </h2>
                            </div>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="mt-8">
                                <EmptyState
                                    title="No rooms available"
                                    message="This property currently has no rooms available for rental."
                                />
                            </div>
                        ) : (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                {rooms.map((room) => (
                                    <div
                                        key={room._id}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
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

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRequestingRoom(room._id);
                                                setRequestError("");
                                            }}
                                            disabled={
                                                room.status &&
                                                room.status !== "AVAILABLE"
                                            }
                                            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
                                                requestingRoom === room._id
                                                    ? "bg-blue-600"
                                                    : "bg-slate-900 hover:bg-blue-600"
                                            }`}
                                        >
                                            <Send size={17} />
                                            {requestingRoom === room._id
                                                ? "Selected room"
                                                : "Select this room"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <p className="text-sm font-medium text-slate-500">
                                Interested in this property?
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                Send a rental request
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Choose a room and send your request directly to the owner.
                            </p>

                            {requestSuccess && (
                                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {requestSuccess}
                                </div>
                            )}

                            {requestError && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                    {requestError}
                                </div>
                            )}

                            {selectedRoom ? (
                                <div className="mt-5">
                                    <p className="mb-4 text-sm font-semibold text-slate-700">
                                        Selected:{" "}
                                        {selectedRoom.roomNumber
                                            ? `Room ${selectedRoom.roomNumber}`
                                            : selectedRoom.title ||
                                              "Selected room"}
                                    </p>

                                    <label className="mb-3 block text-sm font-medium text-slate-700">
                                        Move-in date
                                        <input
                                            type="date"
                                            required
                                            min={new Date()
                                                .toISOString()
                                                .slice(0, 10)}
                                            value={requestMoveInDate}
                                            onChange={(event) =>
                                                setRequestMoveInDate(
                                                    event.target.value
                                                )
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </label>

                                    <textarea
                                        value={requestMessage}
                                        onChange={(event) =>
                                            setRequestMessage(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Add a message to the owner (optional)"
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRentalRequest(
                                                    requestingRoom
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
                                                setRequestMoveInDate("");
                                                setRequestError("");
                                            }}
                                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    Select an available room to open the request form.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <MessageSquare
                            size={21}
                            className="text-blue-600"
                        />

                        <h2 className="text-2xl font-bold text-slate-900">
                            Reviews
                        </h2>
                    </div>

                    {reviews.length === 0 ? (
                        <p className="mt-6 text-sm text-slate-500">
                            No reviews yet.
                        </p>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="rounded-2xl border border-slate-200 p-6"
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
                </div>
            </section>
        </div>
    );
};

export default PropertyDetails;