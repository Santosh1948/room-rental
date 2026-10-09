import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Compass size={30} />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">
                404
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
                Page not found
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
                The page you are looking for may have moved or no longer exists.
            </p>
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
                <ArrowLeft size={17} />
                Back to home
            </Link>
        </div>
    </section>
);

export default NotFound;
