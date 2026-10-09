const variants = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
};

const AlertBox = ({ variant = "error", children }) => (
    <div
        role={variant === "error" ? "alert" : "status"}
        className={`rounded-xl border px-4 py-3 text-sm font-medium ${variants[variant]}`}
    >
        {children}
    </div>
);

export default AlertBox;
