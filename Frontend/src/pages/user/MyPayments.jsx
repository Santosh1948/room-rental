
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Loader2,
    Receipt,
    Wallet,
} from "lucide-react";

import paymentService from "../../services/paymentService";
import bookingService from "../../services/bookingService";

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState("");
    const [paymentType, setPaymentType] = useState("RENT");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [paymentData, bookingData] = await Promise.all([
                paymentService.getMyPayments(),
                bookingService.getMyBookings(),
            ]);

            const paymentItems = Array.isArray(paymentData)
                ? paymentData
                : paymentData.payments || paymentData.data || [];

            const bookingItems = Array.isArray(bookingData)
                ? bookingData
                : bookingData.bookings || bookingData.data || [];

            setPayments(paymentItems);
            setBookings(bookingItems);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load payment information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const selected = bookings.find(
        (booking) => booking._id === selectedBooking
    );

    const handleBookingChange = (id) => {
        setSelectedBooking(id);
        setAmount("");
        setSuccess("");
        setError("");
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        if (!selectedBooking) {
            setError("Please select a booking.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid payment amount.");
            return;
        }

        try {
            setPaying(true);
            setError("");
            setSuccess("");

            await paymentService.createPayment(selectedBooking, {
                paymentType,
                amount: Number(amount),
            });

            setSuccess("Payment completed successfully.");
            setAmount("");
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Payment could not be completed."
            );
        } finally {
            setPaying(false);
        }
    };

    const formatCurrency = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        to="/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                SECURE ACCOUNT
                            </p>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Payments
                            </h1>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                        Manage your rental payments and view transaction history.
                    </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                {/* Payment form */}
                <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Make a payment
                            </h2>
                            <p className="text-xs text-slate-500">
                                Simulated payment for development
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                            <CheckCircle2 size={17} />
                            {success}
                        </div>
                    )}

                    {bookings.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-5 text-center">
                            <p className="font-semibold text-slate-800">
                                No bookings available
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                You need a booking before making a payment.
                            </p>
                            <Link
                                to="/my-bookings"
                                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View my bookings
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handlePayment} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Select booking
                                </label>
                                <select
                                    value={selectedBooking}
                                    onChange={(event) =>
                                        handleBookingChange(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">Choose a booking</option>
                                    {bookings.map((booking) => (
                                        <option
                                            key={booking._id}
                                            value={booking._id}
                                        >
                                            {booking.property?.title ||
                                                booking.property?.name ||
                                                "Booking"}{" "}
                                            — {booking._id.slice(-6)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selected && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Selected booking
                                    </p>
                                    <p className="mt-1 font-bold text-slate-900">
                                        {selected.property?.title ||
                                            selected.property?.name ||
                                            "Rental booking"}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Monthly rent:{" "}
                                        <strong>
                                            {formatCurrency(
                                                selected.monthlyRent ||
                                                    selected.rent ||
                                                    selected.amount
                                            )}
                                        </strong>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Payment type
                                </label>
                                <select
                                    value={paymentType}
                                    onChange={(event) => {
                                        setPaymentType(event.target.value);
                                        setAmount("");
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="RENT">Rent</option>
                                    <option value="SECURITY_DEPOSIT">
                                        Security deposit
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(event.target.value)
                                    }
                                    placeholder="Enter payment amount"
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    The backend validates the amount against
                                    the selected payment type.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={paying || !selectedBooking}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {paying ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        Pay now
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Payment history */}
                <div>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Payment history
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Your recent transactions
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                            <Receipt size={20} />
                        </div>
                    </div>

                    {payments.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <Receipt
                                size={30}
                                className="mx-auto text-slate-300"
                            />
                            <h3 className="mt-4 font-bold text-slate-800">
                                No transactions yet
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Your completed payments will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <article
                                    key={payment._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {payment.paymentType
                                                        ?.replaceAll("_", " ") ||
                                                        "Payment"}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatDate(
                                                        payment.paidAt ||
                                                            payment.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="shrink-0 text-lg font-extrabold text-slate-900">
                                            {formatCurrency(payment.amount)}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="text-xs text-slate-400">
                                            ID: {payment._id?.slice(-8)}
                                        </span>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                            {payment.status || "SUCCESS"}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Payments;