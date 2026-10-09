import { Inbox } from "lucide-react";

const EmptyState = ({
    title = "Nothing here yet",
    message = "There is no data to display.",
    action = null,
}) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Inbox
                    size={28}
                    className="text-slate-400"
                />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {message}
            </p>

            {action && (
                <div className="mt-5">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;