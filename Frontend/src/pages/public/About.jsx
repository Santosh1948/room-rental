import { Link } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const About = () => (
    <div className="bg-white">
        <section className="bg-slate-950 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                    About Roomly
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Making room rental simple, transparent, and human.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                    Roomly connects renters and property owners with a clean
                    workflow—from discovery and requests to bookings and
                    payments—all in one platform.
                </p>
            </div>
        </section>

        <section className="py-20">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                {[
                    {
                        icon: Sparkles,
                        title: "Designed for clarity",
                        text: "Browse listings with rich details, photos, and room-level pricing so decisions are easy.",
                    },
                    {
                        icon: ShieldCheck,
                        title: "Built on trust",
                        text: "Secure accounts, role-based access, and structured rental requests keep everyone aligned.",
                    },
                    {
                        icon: HeartHandshake,
                        title: "Owner & renter friendly",
                        text: "Owners manage properties and requests; renters track bookings and payments in dedicated dashboards.",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-8"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Icon size={22} />
                            </div>
                            <h2 className="mt-6 text-xl font-bold text-slate-900">
                                {item.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {item.text}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                    <div className="flex items-center gap-3 text-blue-600">
                        <Building2 size={22} />
                        <p className="text-sm font-bold uppercase tracking-widest">
                            Ready to explore?
                        </p>
                    </div>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                        Find your next room today.
                    </h2>
                </div>
                <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                    Browse properties
                    <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    </div>
);

export default About;
