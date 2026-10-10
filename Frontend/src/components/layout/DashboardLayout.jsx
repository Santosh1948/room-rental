import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { getNavForRole } from "../../config/dashboardNav";

const DashboardLayout = ({ title, subtitle }) => {
    const { user } = useSelector((state) => state.auth);
    const { pathname } = useLocation();
    const navItems = getNavForRole(user?.role);
    const showPageHeading = pathname !== "/profile";

    return (
        <div className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {showPageHeading && (title || subtitle) && (
                    <div className="mb-8">
                        {title && (
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="mt-2 text-sm text-slate-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
                            {navItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to.endsWith("/dashboard")}
                                        className={({ isActive }) =>
                                            `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                            }`
                                        }
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </aside>

                    <div className="min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
