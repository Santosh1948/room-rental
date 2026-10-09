import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

import propertyService from "../../services/propertyService";
import PropertyCard from "../../components/common/PropertyCard";
import { unwrapList } from "../../utils/apiHelpers";

const Home = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [featured, setFeatured] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const data = await propertyService.getProperties();
                setFeatured(unwrapList(data, ["properties"]).slice(0, 6));
            } catch {
                setFeatured([]);
            } finally {
                setFeaturedLoading(false);
            }
        };

        loadFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = city.trim()
            ? `?city=${encodeURIComponent(city.trim())}`
            : "";
        navigate(`/properties${query}`);
    };

    return (
        <div className="overflow-hidden bg-white">
            {/* Hero */}
            <section className="relative bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_30%)]" />

                <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
                    {/* Left */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-200">
                            <Sparkles size={16} />
                            Find a place you'll love
                        </div>

                        <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
                            Find a room that
                            <span className="block text-blue-400">
                                feels like home.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                            Discover comfortable rooms and properties,
                            connect with owners, and manage your entire rental
                            journey from one place.
                        </p>

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="mt-9 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20"
                        >
                            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                                    <MapPin
                                        size={20}
                                        className="shrink-0 text-blue-600"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Location
                                        </p>

                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) =>
                                                setCity(e.target.value)
                                            }
                                            placeholder="Search by city..."
                                            className="mt-1 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Search size={18} />
                                    Search
                                </button>
                            </div>
                        </form>

                        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-blue-400"
                                />
                                Verified listings
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-blue-400"
                                />
                                Easy rental requests
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-blue-400"
                                />
                                Secure accounts
                            </div>
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="relative hidden lg:block">
                        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

                        <div className="relative mx-auto max-w-md">
                            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
                                <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-900">
                                    <div className="flex h-full flex-col justify-between p-7">
                                        <div className="flex items-center justify-between">
                                            <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                                                Featured
                                            </div>

                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                                                <Building2 size={19} />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-blue-100">
                                                Comfortable living
                                            </p>

                                            <h3 className="mt-2 text-3xl font-bold text-white">
                                                Your next
                                                <br />
                                                chapter starts here.
                                            </h3>

                                            <div className="mt-6 flex items-center gap-2 text-sm text-blue-100">
                                                <MapPin size={16} />
                                                Find properties near you
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating card */}
                            <div className="absolute -bottom-8 -left-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Star
                                            size={19}
                                            fill="currentColor"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Trusted experience
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Simple. Clear. Convenient.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                Featured
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Latest properties
                            </h2>
                        </div>
                        <Link
                            to="/properties"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Browse all
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {featuredLoading ? (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-80 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : featured.length === 0 ? (
                        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
                            Listings will appear here once owners add
                            properties.
                        </p>
                    ) : (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={property}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                Explore
                            </p>

                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Find what fits your lifestyle
                            </h2>
                        </div>

                        <Link
                            to="/properties"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View all properties
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: "Single Room",
                                text: "Private spaces for comfortable living.",
                                icon: "01",
                            },
                            {
                                title: "Shared Room",
                                text: "Affordable options for students and professionals.",
                                icon: "02",
                            },
                            {
                                title: "Apartment",
                                text: "More space for a complete lifestyle.",
                                icon: "03",
                            },
                            {
                                title: "PG / Hostel",
                                text: "Convenient stays with essential amenities.",
                                icon: "04",
                            },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                to="/properties"
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                                        {item.icon}
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                                    />
                                </div>

                                <h3 className="mt-6 text-lg font-bold text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {item.text}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Roomly */}
            <section className="py-20">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                            Why Roomly
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need for a simpler rental journey.
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
                            From discovering a property to sending a rental
                            request and managing bookings, Roomly keeps
                            everything organized in one place.
                        </p>

                        <Link
                            to="/about"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Learn more
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            {
                                icon: Search,
                                title: "Easy discovery",
                                text: "Browse properties and find rooms that match your needs.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Secure access",
                                text: "Role-based accounts keep user and owner actions protected.",
                            },
                            {
                                icon: Building2,
                                title: "Owner friendly",
                                text: "Owners can manage properties, rooms, requests and bookings.",
                            },
                            {
                                icon: Star,
                                title: "Better experience",
                                text: "Reviews, favorites and notifications keep everything connected.",
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={20} />
                                    </div>

                                    <h3 className="mt-5 font-bold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {item.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-slate-950 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                            Simple process
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                            Rent with confidence
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                            A straightforward process designed to make finding
                            and renting a room easier.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                number: "01",
                                title: "Explore",
                                text: "Browse properties and rooms based on your preferences.",
                            },
                            {
                                number: "02",
                                title: "Request",
                                text: "Choose a room and send a rental request to the owner.",
                            },
                            {
                                number: "03",
                                title: "Move forward",
                                text: "Once approved, manage your booking and payment from your dashboard.",
                            },
                        ].map((item) => (
                            <div
                                key={item.number}
                                className="rounded-2xl border border-white/10 bg-white/5 p-7"
                            >
                                <span className="text-sm font-bold text-blue-400">
                                    {item.number}
                                </span>

                                <h3 className="mt-5 text-xl font-bold text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center shadow-2xl shadow-blue-600/20 sm:px-12">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Ready to find your next place?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-blue-100">
                        Explore available properties and start your rental
                        journey today.
                    </p>

                    <Link
                        to="/properties"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                        Explore properties
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;