import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    CalendarCheck,
    CreditCard,
    UserCheck,
    UserX,
    ArrowRight,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import adminService from "../../services/adminService";

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getDashboard();

            setDashboard(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const getValue = (...values) => {
        for (const value of values) {
            if (
                value !== undefined &&
                value !== null &&
                typeof value === "number"
            ) {
                return value;
            }
        }

        return 0;
    };

    const stats = [
        {
            label: "Total Users",
            value: getValue(
                dashboard?.totalUsers,
                dashboard?.users,
                dashboard?.userCount
            ),
            icon: Users,
            link: "/admin/users",
        },
        {
            label: "Total Properties",
            value: getValue(
                dashboard?.totalProperties,
                dashboard?.properties,
                dashboard?.propertyCount
            ),
            icon: Building2,
            link: "/admin/properties",
        },
        {
            label: "Total Bookings",
            value: getValue(
                dashboard?.totalBookings,
                dashboard?.bookings,
                dashboard?.bookingCount
            ),
            icon: CalendarCheck,
            link: "/admin/bookings",
        },
        {
            label: "Total Payments",
            value: getValue(
                dashboard?.totalPayments,
                dashboard?.payments,
                dashboard?.paymentCount
            ),
            icon: CreditCard,
            link: "/admin/payments",
        },
    ];

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
                            />
                        ))}
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-56 animate-pulse rounded-2xl bg-white shadow-sm"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                        <AlertCircle
                            className="mx-auto text-red-500"
                            size={40}
                        />

                        <h2 className="mt-4 text-lg font-bold text-red-900">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={loadDashboard}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                                <ShieldCheck size={23} />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Admin Dashboard
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage and monitor your Roomly platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadDashboard}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.label}
                                to={stat.link}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={21} />
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                                    />
                                </div>

                                <p className="mt-5 text-sm font-medium text-slate-500">
                                    {stat.label}
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {stat.value}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Management */}
                <div className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Platform Management
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Quickly access important admin operations.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                        <Link
                            to="/admin/users"
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Users size={22} />
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                Manage Users
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                View users, roles and account status.
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                                View Users
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </div>
                        </Link>

                        <Link
                            to="/admin/properties"
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Building2 size={22} />
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                Properties
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Monitor properties listed by owners.
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                View Properties
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </div>
                        </Link>

                        <Link
                            to="/admin/bookings"
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <CalendarCheck size={22} />
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                Bookings
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Monitor active and completed bookings.
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-600">
                                View Bookings
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </div>
                        </Link>

                        <Link
                            to="/admin/payments"
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <CreditCard size={22} />
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                Payments
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Review payment transactions and records.
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-amber-600">
                                View Payments
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Admin Overview */}
                <div className="mt-8 grid gap-6 lg:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <UserCheck size={20} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Platform Access
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Account management
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-slate-600">
                            Administrators can monitor users and control
                            account access across the Roomly platform.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <UserX size={20} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    User Control
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Activate or deactivate
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-slate-600">
                            Review suspicious or inactive accounts and
                            update their status when necessary.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                        <ShieldCheck size={25} />

                        <h3 className="mt-5 font-bold">
                            Roomly Administration
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Centralized control for users, properties,
                            bookings and payments.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;