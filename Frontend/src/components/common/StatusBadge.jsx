const styles = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    REJECTED: "bg-red-50 text-red-700 ring-red-200",
    CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
    ACTIVE: "bg-blue-50 text-blue-700 ring-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    RENTED: "bg-violet-50 text-violet-700 ring-violet-200",
    MAINTENANCE: "bg-orange-50 text-orange-700 ring-orange-200",
    SUCCESS: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    FAILED: "bg-red-50 text-red-700 ring-red-200",
};

const StatusBadge = ({ status }) => {
    const normalized = (status || "UNKNOWN").toUpperCase();
    const className =
        styles[normalized] || "bg-slate-100 text-slate-600 ring-slate-200";

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
        >
            {normalized.replace(/_/g, " ")}
        </span>
    );
};

export default StatusBadge;
