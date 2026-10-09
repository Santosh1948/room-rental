import { useEffect, useMemo, useState } from "react";
import {
    CreditCard,
    Search,
    RefreshCw,
    User,
    Building2,
    CheckCircle2,
    Clock3,
    XCircle,
    AlertCircle,
    IndianRupee,
} from "lucide-react";

import adminService from "../../services/adminService";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getPayments();

            const paymentList = Array.isArray(data)
                ? data
                : data?.payments || [];

            setPayments(paymentList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load payments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const getStatus = (payment) => {
        return (
            payment.status ||
            payment.paymentStatus ||
            "UNKNOWN"
        )
            .toString()
            .toUpperCase();
    };

    const getPaymentType = (payment) => {
        return (
            payment.type ||
            payment.paymentType ||
            "PAYMENT"
        )
            .toString()
            .toUpperCase();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "SUCCESS":
            case "COMPLETED":
            case "PAID":
                return {
                    className:
                        "bg-emerald-50 text-emerald-700",
                    icon: CheckCircle2,
                };

            case "PENDING":
                return {
                    className:
                        "bg-amber-50 text-amber-700",
                    icon: Clock3,
                };

            case "FAILED":
            case "CANCELLED":
            case "CANCELED":
                return {
                    className:
                        "bg-red-50 text-red-700",
                    icon: XCircle,
                };

            default:
                return {
                    className:
                        "bg-slate-100 text-slate-700",
                    icon: Clock3,
                };
        }
    };

    const getUserName = (payment) => {
        return (
            payment.user?.name ||
            payment.user?.fullName ||
            payment.user?.email ||
            payment.renter?.name ||
            payment.renter?.email ||
            "Unknown user"
        );
    };

    const getOwnerName = (payment) => {
        return (
            payment.owner?.name ||
            payment.owner?.fullName ||
            payment.owner?.email ||
            "Unknown owner"
        );
    };

    const getPropertyName = (payment) => {
        return (
            payment.property?.title ||
            payment.property?.name ||
            payment.propertyName ||
            payment.booking?.property?.title ||
            payment.booking?.property?.name ||
            "Unknown property"
        );
    };

    const getAmount = (payment) => {
        const amount =
            payment.amount ??
            payment.totalAmount ??
            payment.paidAmount;

        if (
            amount === undefined ||
            amount === null
        ) {
            return "—";
        }

        return `₹${Number(amount).toLocaleString(
            "en-IN"
        )}`;
    };

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const query = search.trim().toLowerCase();

            const user =
                payment.user?.name ||
                payment.user?.email ||
                payment.renter?.name ||
                payment.renter?.email ||
                "";

            const owner =
                payment.owner?.name ||
                payment.owner?.email ||
                "";

            const property =
                payment.property?.title ||
                payment.property?.name ||
                payment.propertyName ||
                payment.booking?.property?.title ||
                payment.booking?.property?.name ||
                "";

            const paymentId =
                payment._id || "";

            const matchesSearch =
                !query ||
                user.toLowerCase().includes(query) ||
                owner.toLowerCase().includes(query) ||
                property.toLowerCase().includes(query) ||
                paymentId
                    .toLowerCase()
                    .includes(query);

            const status = getStatus(payment);
            const type = getPaymentType(payment);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            const matchesType =
                typeFilter === "ALL" ||
                type === typeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );
        });
    }, [
        payments,
        search,
        statusFilter,
        typeFilter,
    ]);

    const totalAmount = useMemo(() => {
        return filteredPayments.reduce(
            (total, payment) => {
                const status = getStatus(payment);

                if (
                    ![
                        "SUCCESS",
                        "COMPLETED",
                        "PAID",
                    ].includes(status)
                ) {
                    return total;
                }

                const amount =
                    Number(payment.amount) ||
                    Number(payment.totalAmount) ||
                    Number(payment.paidAmount) ||
                    0;

                return total + amount;
            },
            0
        );
    }, [filteredPayments]);

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        <div className="h-28 animate-pulse rounded-2xl bg-white" />
                        <div className="h-28 animate-pulse rounded-2xl bg-white" />
                    </div>

                    <div className="mt-6 space-y-4">
                        {Array.from({ length: 6 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-28 animate-pulse rounded-2xl bg-white"
                                />
                            )
                        )}
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                                <CreditCard size={22} />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Payment Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor Roomly payment transactions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadPayments}
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

                {/* Summary */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <IndianRupee size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Successful Amount
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CreditCard size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Transactions
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {filteredPayments.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
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
                                placeholder="Search user, owner, property or payment ID..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

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
                            <option value="RENT">
                                Rent
                            </option>
                            <option value="SECURITY_DEPOSIT">
                                Security Deposit
                            </option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">
                                All Status
                            </option>
                            <option value="SUCCESS">
                                Success
                            </option>
                            <option value="PENDING">
                                Pending
                            </option>
                            <option value="FAILED">
                                Failed
                            </option>
                        </select>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredPayments.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-900">
                                {payments.length}
                            </span>{" "}
                            transactions
                        </p>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px]">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Property
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredPayments.map(
                                    (payment) => {
                                        const status =
                                            getStatus(
                                                payment
                                            );

                                        const type =
                                            getPaymentType(
                                                payment
                                            );

                                        const style =
                                            getStatusStyle(
                                                status
                                            );

                                        const StatusIcon =
                                            style.icon;

                                        return (
                                            <tr
                                                key={
                                                    payment._id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                                            <CreditCard
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {type.replace(
                                                                    /_/g,
                                                                    " "
                                                                )}
                                                            </p>

                                                            <p className="mt-1 max-w-36 truncate font-mono text-xs text-slate-400">
                                                                {
                                                                    payment._id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <User
                                                            size={
                                                                16
                                                            }
                                                            className="text-slate-400"
                                                        />

                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-700">
                                                                {getUserName(
                                                                    payment
                                                                )}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {getOwnerName(
                                                                    payment
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Building2
                                                            size={
                                                                16
                                                            }
                                                            className="text-slate-400"
                                                        />

                                                        <span className="max-w-48 truncate text-sm font-medium text-slate-700">
                                                            {getPropertyName(
                                                                payment
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="font-bold text-slate-900">
                                                        {getAmount(
                                                            payment
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-slate-600">
                                                    {formatDate(
                                                        payment.paidAt ||
                                                            payment.createdAt
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${style.className}`}
                                                    >
                                                        <StatusIcon
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="mt-6 space-y-4 lg:hidden">
                    {filteredPayments.map(
                        (payment) => {
                            const status =
                                getStatus(payment);

                            const type =
                                getPaymentType(payment);

                            const style =
                                getStatusStyle(status);

                            const StatusIcon =
                                style.icon;

                            return (
                                <article
                                    key={payment._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                                <CreditCard
                                                    size={20}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="font-bold text-slate-900">
                                                    {type.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </h2>

                                                <p className="mt-1 truncate font-mono text-xs text-slate-400">
                                                    {payment._id}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.className}`}
                                        >
                                            <StatusIcon
                                                size={13}
                                            />
                                            {status}
                                        </span>
                                    </div>

                                    <div className="mt-5 border-y border-slate-100 py-4">
                                        <div className="flex items-center gap-2">
                                            <User
                                                size={16}
                                                className="text-slate-400"
                                            />

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    User
                                                </p>

                                                <p className="text-sm font-semibold text-slate-700">
                                                    {getUserName(
                                                        payment
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Building2
                                                size={16}
                                                className="text-slate-400"
                                            />

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Property
                                                </p>

                                                <p className="text-sm font-semibold text-slate-700">
                                                    {getPropertyName(
                                                        payment
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Amount
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {getAmount(
                                                    payment
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {formatDate(
                                                    payment.paidAt ||
                                                        payment.createdAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>

                {/* Empty */}
                {filteredPayments.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <CreditCard
                            size={44}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                            No payments found
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

export default AdminPayments;