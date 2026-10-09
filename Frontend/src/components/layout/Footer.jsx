import { Link } from "react-router-dom";
import { Home, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="lg:col-span-2">
                <Link to="/" className="inline-flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Home size={20} />
                    </div>
                    <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-white">
                        Room<span className="text-blue-400">ly</span>
                    </span>
                </Link>

                <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                    Discover rooms and properties, connect with trusted owners,
                    and manage your rental journey in one beautiful place.
                </p>
            </div>

            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                    Explore
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                    <li>
                        <Link to="/properties" className="hover:text-white">
                            Properties
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-white">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" className="hover:text-white">
                            Create account
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                    Contact
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-400" />
                        hello@roomly.app
                    </li>
                    <li className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-400" />
                        +91 98765 43210
                    </li>
                    <li className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-400" />
                        India
                    </li>
                </ul>
            </div>
        </div>

        <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>© {new Date().getFullYear()} Roomly. All rights reserved.</p>
                <p>Built for modern room rental experiences.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
