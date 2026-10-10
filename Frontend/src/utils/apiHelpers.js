export const unwrapList = (payload, keys = []) => {
    if (Array.isArray(payload)) return payload;

    const candidates = [
        ...keys,
        "properties",
        "rooms",
        "requests",
        "bookings",
        "payments",
        "users",
        "favorites",
        "notifications",
        "reviews",
        "data",
    ];

    for (const key of candidates) {
        if (Array.isArray(payload?.[key])) {
            return payload[key];
        }
    }

    return [];
};

export const unwrapOne = (payload, keys = []) => {
    if (!payload || typeof payload !== "object") return payload;

    const candidates = [...keys, "property", "room", "booking", "user", "dashboard"];

    for (const key of candidates) {
        if (payload[key] !== undefined) {
            return payload[key];
        }
    }

    return payload;
};

export const getUserId = (user) => user?.id || user?._id;

export const getPropertyImage = (property, fallbackImage) =>
    property?.images?.[0] ||
    property?.mages?.[0] ||
    fallbackImage ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";

export const formatAddress = (address) => {
    if (!address) return "Location not specified";
    if (typeof address === "string") return address;

    return (
        [address.street, address.city, address.state, address.pincode]
            .filter(Boolean)
            .join(", ") || "Location not specified"
    );
};
