import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Heart,
    MapPin,
    ArrowRight,
    Trash2,
    Home,
    Loader2,
} from "lucide-react";

import favoriteService from "../../services/favoriteService";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await favoriteService.getFavorites();

            // Backend may return array directly or inside favorites
            const items = Array.isArray(data)
                ? data
                : data.favorites || data.data || [];

            setFavorites(items);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your favorite properties."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const handleRemove = async (propertyId) => {
        try {
            setRemovingId(propertyId);

            await favoriteService.removeFavorite(propertyId);

            setFavorites((prev) =>
                prev.filter((item) => {
                    const property = item.property || item;
                    return property._id !== propertyId;
                })
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to remove this favorite."
            );
        } finally {
            setRemovingId(null);
        }
    };

    const getProperty = (item) => item.property || item;

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-8 h-10 w-56 animate-pulse rounded-lg bg-slate-200" />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-3xl bg-white shadow-sm"
                            >
                                <div className="h-56 animate-pulse bg-slate-200" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                                    <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error && favorites.length === 0) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Heart size={28} />
                    </div>

                    <h1 className="text-xl font-bold text-slate-900">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={loadFavorites}
                        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <Heart size={24} fill="currentColor" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                YOUR COLLECTION
                            </p>

                            <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900">
                                Favorite Properties
                            </h1>
                        </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                        Keep track of the properties you love and come back
                        whenever you're ready to find your next home.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {favorites.length === 0 ? (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
                            <Heart size={34} />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            No favorites yet
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            When you find a property you like, save it here
                            so you can easily find it later.
                        </p>

                        <Link
                            to="/properties"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            Explore Properties
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                {favorites.length}{" "}
                                {favorites.length === 1
                                    ? "property"
                                    : "properties"}{" "}
                                saved
                            </p>

                            <Link
                                to="/properties"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Explore more
                            </Link>
                        </div>

                        {/* Property Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((item) => {
                                const property = getProperty(item);

                                const image =
                                    property.images?.[0] ||
                                    property.image ||
                                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";

                                return (
                                    <article
                                        key={property._id}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        {/* Image */}
                                        <div className="relative h-60 overflow-hidden">
                                            <img
                                                src={image}
                                                alt={property.title || "Property"}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                                                <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                                                    {property.propertyType ||
                                                        "PROPERTY"}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleRemove(
                                                            property._id
                                                        )
                                                    }
                                                    disabled={
                                                        removingId ===
                                                        property._id
                                                    }
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-lg backdrop-blur transition hover:bg-red-50 disabled:opacity-60"
                                                    title="Remove favorite"
                                                >
                                                    {removingId ===
                                                    property._id ? (
                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            </div>

                                            {property.isAvailable && (
                                                <span className="absolute bottom-4 left-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                                                    Available
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
                                                {property.title ||
                                                    property.name ||
                                                    "Untitled Property"}
                                            </h2>

                                            <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                                <MapPin
                                                    size={16}
                                                    className="shrink-0"
                                                />

                                                <span className="line-clamp-1">
                                                    {property.city ||
                                                        property.location ||
                                                        "Location unavailable"}
                                                </span>
                                            </div>

                                            <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-400">
                                                        Starting from
                                                    </p>

                                                    <p className="mt-1 text-lg font-extrabold text-slate-900">
                                                        ₹
                                                        {property.monthlyRent ||
                                                            property.rent ||
                                                            property.price ||
                                                            "—"}
                                                        <span className="ml-1 text-xs font-medium text-slate-400">
                                                            / month
                                                        </span>
                                                    </p>
                                                </div>

                                                <Link
                                                    to={`/properties/${property._id}`}
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                    title="View property"
                                                >
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Favorites;