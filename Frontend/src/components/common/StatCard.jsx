const StatCard = ({ label, value, hint, icon: Icon, accent = "blue" }) => {
    const accents = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>
                    {hint && (
                        <p className="mt-1 text-xs text-slate-400">{hint}</p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
                    >
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
