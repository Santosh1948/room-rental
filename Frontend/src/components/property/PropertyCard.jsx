import {
    Heart,
    MapPin,
    Home,
    ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({
    property,
    isFavorite = false,
    onFavorite,
}) => {
    const navigate = useNavigate();

    const image =
        property.images?.[0] ||
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";

    const rent =
        property.monthlyRent ||
        property.rent ||
        property.price ||
        0;

    const location =
        property.address?.city ||
        property.city ||
        "Location unavailable";

    const propertyType =
        property.propertyType ||
        "PROPERTY";

    const handleCardClick = () => {
        navigate(`/properties/${property._id}`);
    };

    const handleFavorite = (event) => {
        event.stopPropagation();

        if (onFavorite) {
            onFavorite(property);
        }
    };

    return (
        <article
            onClick={handleCardClick}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={image}
                    alt={property.title || "Rental property"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                        event.currentTarget.src =
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";
                    }}
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                        {propertyType}
                    </span>

                    <button
                        type="button"
                        onClick={handleFavorite}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-105"
                        aria-label={
                            isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                        }
                    >
                        <Heart
                            size={18}
                            className={
                                isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-slate-600"
                            }
                        />
                    </button>
                </div>

                {property.isAvailable && (
                    <div className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                        Available
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-900">
                            {property.title ||
                                property.name ||
                                "Rental Property"}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin
                                size={15}
                                className="shrink-0"
                            />

                            <span className="truncate">
                                {location}
                            </span>
                        </div>
                    </div>

                    <ArrowUpRight
                        size={19}
                        className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
                    />
                </div>

                <div className="my-4 h-px bg-slate-100" />

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Starting from
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-slate-900">
                            ₹{Number(rent).toLocaleString("en-IN")}
                            <span className="ml-1 text-sm font-medium text-slate-400">
                                /month
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Home size={14} />
                        View details
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PropertyCard;