import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";

import { getDashboardHome } from "../../config/dashboardNav";

const Unauthorized = () => {
    const { user } = useSelector((state) => state.auth);
    const home = getDashboardHome(user?.role);

    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
            <div className="max-w-lg text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <ShieldAlert size={30} />
                </div>
                <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
                    Access denied
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                    You do not have permission to view this page with your
                    current account role.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        to={home}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Go to dashboard
                    </Link>
                    <Link
                        to="/"
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Unauthorized;
