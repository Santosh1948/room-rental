import { useEffect, useState } from "react";
import { Bell, Loader2, Trash2 } from "lucide-react";

import notificationService from "../../services/notificationService";
import { unwrapList } from "../../utils/apiHelpers";
import { formatDateTime } from "../../utils/format";
import AlertBox from "../../components/common/AlertBox";
import EmptyState from "../../components/common/EmptyState";

const Notifications = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await notificationService.getNotifications();
            setItems(unwrapList(data, ["notifications"]));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleRead = async (id) => {
        try {
            setActionId(id);
            await notificationService.markAsRead(id);
            setItems((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, isRead: true } : item
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to update notification."
            );
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            setActionId(id);
            await notificationService.deleteNotification(id);
            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to delete notification."
            );
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={28} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && <AlertBox>{error}</AlertBox>}

            {items.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="No notifications yet"
                    description="Updates about requests, bookings, and payments will appear here."
                />
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <article
                            key={item._id}
                            className={`rounded-2xl border p-5 shadow-sm ${
                                item.isRead
                                    ? "border-slate-200 bg-white"
                                    : "border-blue-200 bg-blue-50/40"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        {item.type || "UPDATE"}
                                    </p>
                                    <h3 className="mt-1 font-bold text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {item.message}
                                    </p>
                                    <p className="mt-3 text-xs text-slate-400">
                                        {formatDateTime(item.createdAt)}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    {!item.isRead && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRead(item._id)
                                            }
                                            disabled={actionId === item._id}
                                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            Mark read
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(item._id)
                                        }
                                        disabled={actionId === item._id}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-600 disabled:opacity-60"
                                        aria-label="Delete notification"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
