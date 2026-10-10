import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    BedDouble,
    CheckCircle2
} from "lucide-react";

import roomService from "../../services/roomService";
import ImageUploader from "../ImageUploader";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "TRIPLE", "SHARED"];

const ROOM_STATUS = [
    "AVAILABLE",
    "RENTED",
    "MAINTENANCE",
];

const emptyRoom = {
    roomNumber: "",
    roomType: "SINGLE",
    rent: "",
    securityDeposit: "",
    amenities: [],
    images: [],
    status: "AVAILABLE",
};

const RoomManager = ({ property, onClose }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [form, setForm] = useState(emptyRoom);

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await roomService.getRoomsByProperty(
                property._id
            );

            const list = Array.isArray(data)
                ? data
                : data?.rooms || data?.data || [];

            setRooms(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load rooms."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, [property._id]);

    const openCreate = () => {
        setEditingRoom(null);
        setForm(emptyRoom);
        setError("");
        setShowForm(true);
    };

    const openEdit = (room) => {
        setEditingRoom(room);

        setForm({
            roomNumber: room.roomNumber || "",
            roomType: room.roomType || "SINGLE",
            rent: room.rent || "",
            securityDeposit: room.securityDeposit || "",
            amenities: room.amenities || [],
            images: room.images || [],
            status: room.status || "AVAILABLE",
        });

        setError("");
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addRoom = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (editingRoom) {
                await roomService.updateRoom(
                    editingRoom._id,
                    form
                );
            } else {
                await roomService.createRoom(
                    property._id,
                    form
                );
            }

            await loadRooms();

            setForm(emptyRoom);
            setEditingRoom(null);
            setShowForm(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to save room."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteRoom = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this room?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await roomService.deleteRoom(id);

            setRooms((prev) =>
                prev.filter((room) => room._id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to delete room."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="mx-auto my-6 max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                            <BedDouble size={18} />
                            Room Management
                        </div>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {property.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage all rooms in this property.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={21} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">
                    {/* Top Actions */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-500">
                                Total rooms
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {rooms.length}
                            </p>
                        </div>

                        <button
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Room
                        </button>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <BedDouble size={26} />
                            </div>

                            <h3 className="mt-4 font-bold text-slate-900">
                                No rooms added
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add the first room for this property.
                            </p>

                            <button
                                onClick={openCreate}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus size={17} />
                                Add Room
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {rooms.map((room) => (
                                <div
                                    key={room._id}
                                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">
                                                    Room{" "}
                                                    {room.roomNumber}
                                                </h3>

                                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                                                    {room.roomType}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-slate-500">
                                                ₹
                                                {Number(
                                                    room.rent || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}{" "}
                                                / month
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                room.status ===
                                                "AVAILABLE"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : room.status ===
                                                        "RENTED"
                                                      ? "bg-blue-50 text-blue-700"
                                                      : "bg-amber-50 text-amber-700"
                                            }`}
                                        >
                                            {room.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-xs text-slate-400">
                                                Security Deposit
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-slate-800">
                                                ₹
                                                {Number(
                                                    room.securityDeposit ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-xs text-slate-400">
                                                Amenities
                                            </p>
                                            <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-800">
                                                {room.amenities
                                                    ?.length
                                                    ? room.amenities.join(
                                                          ", "
                                                      )
                                                    : "None"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                                        <button
                                            onClick={() =>
                                                openEdit(room)
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteRoom(
                                                    room._id
                                                )
                                            }
                                            className="rounded-xl border border-red-100 px-4 py-2.5 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room Form */}
                {showForm && (
                    <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    {editingRoom
                                        ? "Edit Room"
                                        : "Add New Room"}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the room details below.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowForm(false)
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={addRoom}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Room Number
                                </label>

                                <input
                                    name="roomNumber"
                                    value={form.roomNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="101"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Room Type
                                </label>

                                <select
                                    name="roomType"
                                    value={form.roomType}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                                >
                                    {ROOM_TYPES.map((type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Monthly Rent
                                </label>

                                <input
                                    name="rent"
                                    type="number"
                                    min="0"
                                    value={form.rent}
                                    onChange={handleChange}
                                    required
                                    placeholder="8000"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Security Deposit
                                </label>

                                <input
                                    name="securityDeposit"
                                    type="number"
                                    min="0"
                                    value={form.securityDeposit}
                                    onChange={handleChange}
                                    required
                                    placeholder="10000"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                                >
                                    {ROOM_STATUS.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <ImageUploader
                                    endpoint="/upload/rooms"
                                    existingImages={form.images || []}
                                    onChange={(nextImages) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            images: nextImages,
                                        }))
                                    }
                                    label="Room gallery"
                                    maxFiles={5}
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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
                                            {editingRoom
                                                ? "Update Room"
                                                : "Create Room"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomManager;