import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't load this information. Please try again.",
    onRetry,
}) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle
                    size={28}
                    className="text-red-500"
                />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState;