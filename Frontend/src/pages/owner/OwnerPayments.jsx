import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import paymentService from "../../services/paymentService";
import { unwrapList } from "../../utils/apiHelpers";
import { formatCurrency, formatDateTime } from "../../utils/format";
import StatusBadge from "../../components/common/StatusBadge";
import AlertBox from "../../components/common/AlertBox";
import EmptyState from "../../components/common/EmptyState";

const OwnerPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await paymentService.getOwnerPayments();
                setPayments(unwrapList(data, ["payments"]));
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load payments."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

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

            {payments.length === 0 ? (
                <EmptyState
                    icon={CreditCard}
                    title="No payments received"
                    description="When tenants pay rent or a deposit, those records will show here."
                />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Tenant</th>
                                <th className="px-4 py-3">Property</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className="border-b border-slate-100 last:border-0"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {payment.user?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {payment.property?.title || "—"}
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {payment.paymentType}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            status={payment.status}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {formatDateTime(payment.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OwnerPayments;
