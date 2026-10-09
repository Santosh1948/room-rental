import { useEffect, useState } from "react";
import {
    Building2,
    Plus,
    Pencil,
    Trash2,
    MapPin,
    Home,
    CheckCircle2,
    X,
    Loader2,
    Image as ImageIcon,
    BedDouble
} from "lucide-react";

import propertyService from "../../services/propertyService";
import RoomManager from "../../components/property/RoomManager";

const PROPERTY_TYPES = [
    "HOUSE",
    "APARTMENT",
    "PG",
    "HOSTEL",
    "FLAT",
];

const emptyForm = {
    title: "",
    description: "",
    propertyType: "APARTMENT",
    address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
    },
    amenities: [],
    images: [],
    isAvailable: true,
};

const OwnerProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const [amenityInput, setAmenityInput] = useState("");
    const [imageInput, setImageInput] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);

    const loadProperties = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await propertyService.getProperties();

            const list = Array.isArray(data)
                ? data
                : data?.properties || data?.data || [];

            setProperties(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load your properties."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const openCreateForm = () => {
        setEditingProperty(null);
        setForm(emptyForm);
        setAmenityInput("");
        setImageInput("");
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const openEditForm = (property) => {
        setEditingProperty(property);

        setForm({
            title: property.title || "",
            description: property.description || "",
            propertyType: property.propertyType || "APARTMENT",
            address: {
                street: property.address?.street || "",
                city: property.address?.city || "",
                state: property.address?.state || "",
                pincode: property.address?.pincode || "",
            },
            amenities: property.amenities || [],
            images: property.images || [],
            isAvailable:
                property.isAvailable !== undefined
                    ? property.isAvailable
                    : true,
        });

        setAmenityInput("");
        setImageInput("");
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingProperty(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const addAmenity = () => {
        const value = amenityInput.trim();

        if (!value) return;

        if (form.amenities.includes(value)) {
            setAmenityInput("");
            return;
        }

        setForm((prev) => ({
            ...prev,
            amenities: [...prev.amenities, value],
        }));

        setAmenityInput("");
    };

    const removeAmenity = (amenity) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.filter(
                (item) => item !== amenity
            ),
        }));
    };

    const addImage = () => {
        const value = imageInput.trim();

        if (!value) return;

        if (form.images.includes(value)) {
            setImageInput("");
            return;
        }

        setForm((prev) => ({
            ...prev,
            images: [...prev.images, value],
        }));

        setImageInput("");
    };

    const removeImage = (image) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((item) => item !== image),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (editingProperty) {
                await propertyService.updateProperty(
                    editingProperty._id,
                    form
                );

                setSuccess("Property updated successfully.");
            } else {
                await propertyService.createProperty(form);

                setSuccess("Property created successfully.");
            }

            await loadProperties();

            setTimeout(() => {
                setShowForm(false);
                setEditingProperty(null);
                setForm(emptyForm);
                setSuccess("");
            }, 700);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to save property."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this property?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await propertyService.deleteProperty(id);

            setProperties((prev) =>
                prev.filter((property) => property._id !== id)
            );

            setSuccess("Property deleted successfully.");

            setTimeout(() => setSuccess(""), 2500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to delete property."
            );
        }
    };

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                            <Building2 size={18} />
                            Owner Workspace
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            My Properties
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Manage your rental properties, locations,
                            amenities and availability from one place.
                        </p>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <Plus size={19} />
                        Add Property
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <div className="h-48 animate-pulse bg-slate-200" />

                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Building2 size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No properties yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Add your first property and start managing
                            rooms and rental requests.
                        </p>

                        <button
                            onClick={openCreateForm}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Your First Property
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {properties.map((property) => {
                            const image =
                                property.images?.[0] ||
                                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80";

                            return (
                                <article
                                    key={property._id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={image}
                                            alt={property.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                                            {property.propertyType}
                                        </div>

                                        <div
                                            className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                property.isAvailable
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-slate-800 text-white"
                                            }`}
                                        >
                                            {property.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
                                            {property.title}
                                        </h2>

                                        <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                                            <MapPin
                                                size={17}
                                                className="mt-0.5 shrink-0 text-blue-500"
                                            />

                                            <span className="line-clamp-2">
                                                {property.address?.city},{" "}
                                                {property.address?.state}
                                                {property.address?.pincode
                                                    ? ` - ${property.address.pincode}`
                                                    : ""}
                                            </span>
                                        </div>

                                        {property.description && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {property.description}
                                            </p>
                                        )}

                                        {/* Amenities */}
                                        {property.amenities?.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {property.amenities
                                                    .slice(0, 3)
                                                    .map((amenity) => (
                                                        <span
                                                            key={amenity}
                                                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}

                                                {property.amenities.length >
                                                    3 && (
                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                        +
                                                        {property.amenities
                                                            .length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                                            <button
                                                onClick={() =>
                                                    openEditForm(property)
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        property._id
                                                    )
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Property Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm sm:p-6">
                    <div className="flex min-h-full items-center justify-center">
                        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingProperty
                                            ? "Edit Property"
                                            : "Add New Property"}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add accurate property details for
                                        renters.
                                    </p>
                                </div>

                                <button
                                    onClick={closeForm}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={21} />
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="max-h-[75vh] overflow-y-auto p-5 sm:p-6"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Title */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Property Title
                                        </label>

                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            minLength={3}
                                            maxLength={100}
                                            placeholder="e.g. Green View PG"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    {/* Property Type */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Property Type
                                        </label>

                                        <select
                                            name="propertyType"
                                            value={form.propertyType}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        >
                                            {PROPERTY_TYPES.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Availability
                                        </label>

                                        <select
                                            value={
                                                form.isAvailable
                                                    ? "true"
                                                    : "false"
                                            }
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    isAvailable:
                                                        e.target.value ===
                                                        "true",
                                                }))
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        >
                                            <option value="true">
                                                Available
                                            </option>
                                            <option value="false">
                                                Unavailable
                                            </option>
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Describe the property, nearby facilities, atmosphere, etc."
                                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        <p className="mt-1 text-right text-xs text-slate-400">
                                            {form.description.length}/1000
                                        </p>
                                    </div>

                                    {/* Street */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Street Address
                                        </label>

                                        <input
                                            name="street"
                                            value={form.address.street}
                                            onChange={handleAddressChange}
                                            placeholder="Street / Area / Landmark"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            City
                                        </label>

                                        <input
                                            name="city"
                                            value={form.address.city}
                                            onChange={handleAddressChange}
                                            required
                                            placeholder="Bhubaneswar"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            State
                                        </label>

                                        <input
                                            name="state"
                                            value={form.address.state}
                                            onChange={handleAddressChange}
                                            required
                                            placeholder="Odisha"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Pincode
                                        </label>

                                        <input
                                            name="pincode"
                                            value={form.address.pincode}
                                            onChange={handleAddressChange}
                                            required
                                            placeholder="751024"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    {/* Amenities */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Amenities
                                        </label>

                                        <div className="flex gap-2">
                                            <input
                                                value={amenityInput}
                                                onChange={(e) =>
                                                    setAmenityInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key ===
                                                        "Enter"
                                                    ) {
                                                        e.preventDefault();
                                                        addAmenity();
                                                    }
                                                }}
                                                placeholder="WiFi, Parking, AC..."
                                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                            />

                                            <button
                                                type="button"
                                                onClick={addAmenity}
                                                className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {form.amenities.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {form.amenities.map(
                                                    (amenity) => (
                                                        <button
                                                            type="button"
                                                            key={amenity}
                                                            onClick={() =>
                                                                removeAmenity(
                                                                    amenity
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                                        >
                                                            {amenity}
                                                            <X
                                                                size={13}
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Images */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <ImageIcon size={16} />
                                            Image URLs
                                        </label>

                                        <div className="flex gap-2">
                                            <input
                                                value={imageInput}
                                                onChange={(e) =>
                                                    setImageInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key ===
                                                        "Enter"
                                                    ) {
                                                        e.preventDefault();
                                                        addImage();
                                                    }
                                                }}
                                                placeholder="https://example.com/property-image.jpg"
                                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                            />

                                            <button
                                                type="button"
                                                onClick={addImage}
                                                className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {form.images.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {form.images.map(
                                                    (image) => (
                                                        <div
                                                            key={image}
                                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-2"
                                                        >
                                                            <img
                                                                src={image}
                                                                alt=""
                                                                className="h-12 w-16 rounded-lg object-cover"
                                                            />

                                                            <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
                                                                {image}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeImage(
                                                                        image
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                            >
                                                                <X
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Error */}
                                {error && (
                                    <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={saving}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2
                                                    size={17}
                                                />
                                                {editingProperty
                                                    ? "Update Property"
                                                    : "Create Property"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {selectedProperty && (
                <RoomManager
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                />
            )}
        </section>
    );
};

export default OwnerProperties;