import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
    text = "Loading...",
    fullScreen = false,
}) => {
    return (
        <div
            className={
                fullScreen
                    ? "flex min-h-[60vh] items-center justify-center"
                    : "flex items-center justify-center py-12"
            }
        >
            <div className="flex flex-col items-center gap-3">
                <Loader2
                    size={30}
                    className="animate-spin text-blue-600"
                />

                <p className="text-sm font-medium text-slate-500">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;