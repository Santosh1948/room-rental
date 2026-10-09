import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import propertyService from "../../services/propertyService";
import favoriteService from "../../services/favoriteService";
import {
    addFavorite,
    removeFavorite,
} from "../../store/slices/favoriteSlice";
import { unwrapList } from "../../utils/apiHelpers";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PropertyCard from "../../components/property/PropertyCard";

const propertyTypes = [
    { value: "", label: "All types" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "FLAT", label: "Flat" },
    { value: "PG", label: "PG" },
    { value: "HOSTEL", label: "Hostel" },
    { value: "House", label: "House" },
];

const Properties = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const favoriteItems = useSelector(
        (state) => state.favorites.items
    );

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const city = searchParams.get("city") || "";
    const propertyType = searchParams.get("propertyType") || "";

    const handleFavorite = async (property) => {
        if (!isAuthenticated || user?.role !== "USER") {
            navigate("/login");
            return;
        }

        const alreadyFavorite = favoriteItems.some(
            (item) => item._id === property._id
        );

        try {
            if (alreadyFavorite) {
                await favoriteService.removeFavorite(
                    property._id
                );

                dispatch(removeFavorite(property._id));
            } else {
                const response =
                    await favoriteService.addFavorite(
                        property._id
                    );

                const favorite =
                    response.favorite ||
                    response.data ||
                    response;

                dispatch(addFavorite(favorite));
            }
        } catch (error) {
            console.error(
                "Favorite action failed:",
                error
            );
        }
    };

    const fetchProperties = useCallback(async (isCurrent = () => true) => {
        try {
            if (isCurrent()) {
                setLoading(true);
                setError("");
            }

            const params = {};
            if (city) params.city = city;
            if (propertyType) params.propertyType = propertyType;

            const response = await propertyService.getProperties(params);
            const results = unwrapList(response, ["properties"]);

            if (isCurrent()) {
                setProperties(results);
            }
        } catch (err) {
            if (isCurrent()) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load properties."
                );
            }
        } finally {
            if (isCurrent()) {
                setLoading(false);
            }
        }
    }, [city, propertyType]);

    useEffect(() => {
        let isCurrent = true;
        void Promise.resolve().then(() => {
            if (isCurrent) {
                return fetchProperties(() => isCurrent);
            }
        });
        return () => {
            isCurrent = false;
        };
    }, [fetchProperties]);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
            <PageContainer>
                <PageHeader
                    title="Find your next place"
                    description="Explore verified rooms, PGs, hostels, apartments and houses that match your needs."
                />

                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="grid w-full gap-2 sm:grid-cols-[1fr_180px_auto]">
                        <label className="relative">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={city}
                                onChange={(e) =>
                                    updateFilter("city", e.target.value)
                                }
                                placeholder="Search by city..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </label>

                        <label className="relative">
                            <SlidersHorizontal
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <select
                                value={propertyType}
                                onChange={(e) =>
                                    updateFilter(
                                        "propertyType",
                                        e.target.value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            >
                                {propertyTypes.map((type) => (
                                    <option
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button
                            type="button"
                            onClick={() => setSearchParams({})}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {loading && (
                    <LoadingSpinner
                        text="Finding available properties..."
                    />
                )}

                {!loading && error && (
                    <ErrorState
                        message={error}
                        onRetry={fetchProperties}
                    />
                )}

                {!loading &&
                    !error &&
                    properties.length === 0 && (
                        <EmptyState
                            title="No properties found"
                            message="Try changing your search or filters to find more rental options."
                        />
                    )}

                {!loading &&
                    !error &&
                    properties.length > 0 && (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    {properties.length}{" "}
                                    {properties.length === 1
                                        ? "property"
                                        : "properties"}{" "}
                                    found
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        isFavorite={favoriteItems.some(
                                            (item) =>
                                                item._id === property._id
                                        )}
                                        onFavorite={handleFavorite}
                                    />
                                ))}
                            </div>
                        </>
                    )}
            </PageContainer>
        </div>
    );
};

export default Properties;
