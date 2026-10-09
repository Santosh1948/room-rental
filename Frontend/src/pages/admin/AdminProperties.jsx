import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Search,
    RefreshCw,
    MapPin,
    User,
    Home,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";

import adminService from "../../services/adminService";

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [availabilityFilter, setAvailabilityFilter] =
        useState("ALL");

    const loadProperties = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getProperties();

            const propertyList = Array.isArray(data)
                ? data
                : data?.properties || [];

            setProperties(propertyList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load properties."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            const query = search.trim().toLowerCase();

            const ownerName =
                property.owner?.name ||
                property.owner?.fullName ||
                "";

            const ownerEmail =
                property.owner?.email || "";

            const address =
                typeof property.address === "string"
                    ? property.address
                    : [
                          property.address?.area,
                          property.address?.city,
                          property.address?.state,
                      ]
                          .filter(Boolean)
                          .join(" ");

            const matchesSearch =
                !query ||
                property.title?.toLowerCase().includes(query) ||
                property.name?.toLowerCase().includes(query) ||
                address.toLowerCase().includes(query) ||
                ownerName.toLowerCase().includes(query) ||
                ownerEmail.toLowerCase().includes(query);

            const matchesType =
                typeFilter === "ALL" ||
                property.propertyType === typeFilter;

            const isAvailable =
                property.isAvailable === true;

            const matchesAvailability =
                availabilityFilter === "ALL" ||
                (availabilityFilter === "AVAILABLE" &&
                    isAvailable) ||
                (availabilityFilter === "UNAVAILABLE" &&
                    !isAvailable);

            return (
                matchesSearch &&
                matchesType &&
                matchesAvailability
            );
        });
    }, [
        properties,
        search,
        typeFilter,
        availabilityFilter,
    ]);

    const getPropertyName = (property) => {
        return (
            property.title ||
            property.name ||
            "Untitled Property"
        );
    };

    const getLocation = (property) => {
        if (typeof property.address === "string") {
            return property.address;
        }

        return [
            property.address?.area,
            property.address?.city,
            property.address?.state,
        ]
            .filter(Boolean)
            .join(", ") || "Location not provided";
    };

    const getOwnerName = (property) => {
        return (
            property.owner?.name ||
            property.owner?.fullName ||
            property.owner?.email ||
            "Unknown owner"
        );
    };

    const getRent = (property) => {
        const rent =
            property.rent ??
            property.monthlyRent ??
            property.price;

        if (rent === undefined || rent === null) {
            return "Not specified";
        }

        return `₹${Number(rent).toLocaleString("en-IN")}/month`;
    };

    const getTypeLabel = (type) => {
        if (!type) return "Property";

        return type
            .toString()
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />

                    <div className="mt-8 h-20 animate-pulse rounded-2xl bg-white" />

                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <Building2 size={22} />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Property Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor properties listed on Roomly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadProperties}
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
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">

                        {/* Search */}
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
                                placeholder="Search property, location or owner..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Property Type */}
                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">
                                All Types
                            </option>
                            <option value="PG">PG</option>
                            <option value="HOSTEL">Hostel</option>
                            <option value="APARTMENT">
                                Apartment
                            </option>
                            <option value="HOUSE">
                                House
                            </option>
                            <option value="FLAT">Flat</option>
                        </select>

                        {/* Availability */}
                        <select
                            value={availabilityFilter}
                            onChange={(e) =>
                                setAvailabilityFilter(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">
                                All Availability
                            </option>
                            <option value="AVAILABLE">
                                Available
                            </option>
                            <option value="UNAVAILABLE">
                                Unavailable
                            </option>
                        </select>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredProperties.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-900">
                                {properties.length}
                            </span>{" "}
                            properties
                        </p>
                    </div>
                </div>

                {/* Property Cards */}
                {filteredProperties.length > 0 && (
                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredProperties.map((property) => {
                            const available =
                                property.isAvailable === true;

                            const image =
                                property.images?.[0] ||
                                property.image ||
                                property.imageUrl;

                            return (
                                <article
                                    key={property._id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={getPropertyName(
                                                    property
                                                )}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-slate-300">
                                                <Building2
                                                    size={48}
                                                />
                                            </div>
                                        )}

                                        <div className="absolute left-4 top-4">
                                            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                                                {getTypeLabel(
                                                    property.propertyType
                                                )}
                                            </span>
                                        </div>

                                        <div className="absolute right-4 top-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    available
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}
                                            >
                                                {available ? (
                                                    <CheckCircle2
                                                        size={13}
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={13}
                                                    />
                                                )}

                                                {available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h2 className="truncate text-lg font-bold text-slate-900">
                                            {getPropertyName(
                                                property
                                            )}
                                        </h2>

                                        <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                                            <MapPin
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />

                                            <span className="line-clamp-2">
                                                {getLocation(
                                                    property
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-y border-slate-100 py-4">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Monthly Rent
                                                </p>

                                                <p className="mt-1 font-bold text-slate-900">
                                                    {getRent(
                                                        property
                                                    )}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-slate-400">
                                                    Property ID
                                                </p>

                                                <p className="mt-1 max-w-24 truncate font-mono text-xs font-medium text-slate-600">
                                                    {property._id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Owner */}
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <User size={17} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-400">
                                                    Property Owner
                                                </p>

                                                <p className="truncate text-sm font-semibold text-slate-700">
                                                    {getOwnerName(
                                                        property
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Empty */}
                {filteredProperties.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <Home
                            size={44}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                            No properties found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminProperties;