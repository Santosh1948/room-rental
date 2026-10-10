import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

import { formatAddress, getPropertyImage } from "../../utils/apiHelpers";

const PropertyCard = ({ property, fallbackImage }) => {
    const image = getPropertyImage(property, fallbackImage);

    return (
        <Link
            to={`/properties/${property._id}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={property.title || "Property"}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                        if (
                            fallbackImage &&
                            event.currentTarget.src !== fallbackImage
                        ) {
                            event.currentTarget.src = fallbackImage;
                        }
                    }}
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur">
                    {property.propertyType || "Rental"}
                </div>
            </div>

            <div className="p-5">
                <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
                    {property.title || "Property"}
                </h2>

                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} className="shrink-0 text-blue-600" />
                    {formatAddress(property.address)}
                </p>

                {property.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                        {property.description}
                    </p>
                )}

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    View details
                    <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </span>
            </div>
        </Link>
    );
};

export default PropertyCard;
