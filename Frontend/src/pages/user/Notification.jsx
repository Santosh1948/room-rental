import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import notificationService from "../../services/notificationService";
import {
    setNotifications,
    markAsRead,
    clearNotifications,
} from "../../store/slices/notificationSlice";

const Notifications = () => {
    const dispatch = useDispatch();

    const notifications = useSelector(
        (state) => state.notifications.items
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await notificationService.getNotifications();

            const items = Array.isArray(data)
                ? data
                : data.notifications || data.data || [];

            dispatch(setNotifications(items));
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
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            setActionId(id);

            await notificationService.markAsRead(id);

            dispatch(markAsRead(id));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to mark notification as read."
            );
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            setActionId(id);

            await notificationService.deleteNotification(id);

            const updated = notifications.filter(
                (notification) => notification._id !== id
            );

            dispatch(setNotifications(updated));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to delete notification."
            );
        } finally {
            setActionId(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        const unread = notifications.filter(
            (notification) => !notification.isRead
        );

        try {
            for (const notification of unread) {
                await notificationService.markAsRead(
                    notification._id
                );
            }

            dispatch(
                setNotifications(
                    notifications.map((notification) => ({
                        ...notification,
                        isRead: true,
                    }))
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to mark all notifications as read."
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        to="/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Bell size={24} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-blue-600">
                                    UPDATES
                                </p>

                                <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-slate-900">
                                    Notifications
                                </h1>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <CheckCheck size={17} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Stay updated about your rental requests, bookings,
                        payments, and other account activity.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
                            />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    /* Empty State */
                    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                            <Bell size={34} />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            You're all caught up
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            You don't have any notifications right now.
                            We'll let you know when something important
                            happens.
                        </p>

                        <Link
                            to="/properties"
                            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            Explore Properties
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Summary */}
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                {notifications.length}{" "}
                                {notifications.length === 1
                                    ? "notification"
                                    : "notifications"}
                            </p>

                            {unreadCount > 0 && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>

                        {notifications.map((notification) => {
                            const isUnread = !notification.isRead;
                            const isProcessing =
                                actionId === notification._id;

                            return (
                                <article
                                    key={notification._id}
                                    className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                                        isUnread
                                            ? "border-blue-200 bg-blue-50/30"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                isUnread
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            <Bell size={20} />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h2
                                                            className={`text-sm font-bold ${
                                                                isUnread
                                                                    ? "text-slate-900"
                                                                    : "text-slate-700"
                                                            }`}
                                                        >
                                                            {notification.title ||
                                                                "Notification"}
                                                        </h2>

                                                        {isUnread && (
                                                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                                        {notification.message ||
                                                            notification.text ||
                                                            "You have a new update."}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-xs text-slate-400">
                                                    {formatDate(
                                                        notification.createdAt
                                                    )}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {isUnread && (
                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                                    >
                                                        {isProcessing ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Check size={14} />
                                                        )}
                                                        Mark as read
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            notification._id
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Notifications;