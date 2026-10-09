import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";

import reviewService from "../../services/reviewService";
import { unwrapList } from "../../utils/apiHelpers";
import { formatDate } from "../../utils/format";
import AlertBox from "../../components/common/AlertBox";
import EmptyState from "../../components/common/EmptyState";

const OwnerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await reviewService.getOwnerReviews();
                setReviews(unwrapList(data, ["reviews"]));
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load reviews."
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

            {reviews.length === 0 ? (
                <EmptyState
                    icon={Star}
                    title="No reviews yet"
                    description="Tenants can leave a review after a booking is completed."
                />
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <article
                            key={review._id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {review.property?.title ||
                                            "Property"}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {review.user?.name || "Tenant"} ·{" "}
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-amber-500">
                                    <Star size={16} fill="currentColor" />
                                    {review.rating}
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {review.comment || "No comment provided."}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerReviews;
