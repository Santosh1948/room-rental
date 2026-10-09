import { useEffect, useMemo, useState } from "react";
import {
    Users,
    Search,
    RefreshCw,
    UserCheck,
    UserX,
    Shield,
    AlertCircle,
    Loader2,
} from "lucide-react";

import adminService from "../../services/adminService";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminService.getUsers();

            // Supports either direct array or { users: [] }
            const userList = Array.isArray(data)
                ? data
                : data?.users || [];

            setUsers(userList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleStatusChange = async (user) => {
        const currentStatus =
            user.isActive !== undefined
                ? user.isActive
                : user.status === "ACTIVE";

        const newStatus = !currentStatus;

        const confirmed = window.confirm(
            `${newStatus ? "Activate" : "Deactivate"} ${user.name || "this user"}'s account?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(user._id);
            setError("");
            setSuccess("");

            const response = await adminService.updateUserStatus(
                user._id,
                {
                    isActive: newStatus,
                }
            );

            const updatedUser =
                response?.user || response?.data || response;

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item._id === user._id
                        ? {
                              ...item,
                              ...(updatedUser?._id
                                  ? updatedUser
                                  : {
                                        isActive: newStatus,
                                    }),
                          }
                        : item
                )
            );

            setSuccess(
                `User ${newStatus ? "activated" : "deactivated"} successfully.`
            );

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to update user status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const query = search.trim().toLowerCase();

            const matchesSearch =
                !query ||
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.phone?.toLowerCase().includes(query);

            const matchesRole =
                roleFilter === "ALL" ||
                user.role === roleFilter;

            const isActive =
                user.isActive !== undefined
                    ? user.isActive
                    : user.status === "ACTIVE";

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && isActive) ||
                (statusFilter === "INACTIVE" && !isActive);

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [users, search, roleFilter, statusFilter]);

    const getInitials = (name = "") => {
        return (
            name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase() || "U"
        );
    };

    const getUserStatus = (user) => {
        if (user.isActive !== undefined) {
            return user.isActive;
        }

        return user.status === "ACTIVE";
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-violet-50 text-violet-700";
            case "OWNER":
                return "bg-blue-50 text-blue-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

                    <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />

                    <div className="mt-8 h-20 animate-pulse rounded-2xl bg-white" />

                    <div className="mt-6 space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-20 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Users size={22} />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                    User Management
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage Roomly user accounts and access.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadUsers}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                        <UserCheck size={18} />
                        {success}
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">

                        {/* Search */}
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by name, email or phone..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Role */}
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="USER">Users</option>
                            <option value="OWNER">Owners</option>
                            <option value="ADMIN">Admins</option>
                        </select>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-900">
                                {filteredUsers.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-900">
                                {users.length}
                            </span>{" "}
                            users
                        </p>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Phone
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => {
                                    const active = getUserStatus(user);
                                    const isUpdating =
                                        updatingId === user._id;

                                    return (
                                        <tr
                                            key={user._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                                        {getInitials(
                                                            user.name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-slate-900">
                                                            {user.name ||
                                                                "Unnamed User"}
                                                        </p>

                                                        <p className="truncate text-sm text-slate-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    <Shield size={13} />
                                                    {user.role || "USER"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {user.phone || "—"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 text-sm font-semibold ${
                                                        active
                                                            ? "text-emerald-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            active
                                                                ? "bg-emerald-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    />
                                                    {active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    disabled={
                                                        isUpdating ||
                                                        user.role === "ADMIN"
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            user
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        active
                                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                    }`}
                                                >
                                                    {isUpdating ? (
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                    ) : active ? (
                                                        <UserX size={15} />
                                                    ) : (
                                                        <UserCheck
                                                            size={15}
                                                        />
                                                    )}

                                                    {isUpdating
                                                        ? "Updating..."
                                                        : active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="mt-6 space-y-4 lg:hidden">
                    {filteredUsers.map((user) => {
                        const active = getUserStatus(user);
                        const isUpdating =
                            updatingId === user._id;

                        return (
                            <div
                                key={user._id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                            {getInitials(
                                                user.name
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-slate-900">
                                                {user.name ||
                                                    "Unnamed User"}
                                            </p>

                                            <p className="truncate text-sm text-slate-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getRoleStyle(
                                            user.role
                                        )}`}
                                    >
                                        {user.role || "USER"}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-700">
                                            {user.phone || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Status
                                        </p>

                                        <p
                                            className={`mt-1 text-sm font-semibold ${
                                                active
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {active
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    disabled={
                                        isUpdating ||
                                        user.role === "ADMIN"
                                    }
                                    onClick={() =>
                                        handleStatusChange(user)
                                    }
                                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        active
                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    }`}
                                >
                                    {isUpdating ? (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : active ? (
                                        <UserX size={17} />
                                    ) : (
                                        <UserCheck size={17} />
                                    )}

                                    {isUpdating
                                        ? "Updating..."
                                        : active
                                        ? "Deactivate Account"
                                        : "Activate Account"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Empty */}
                {filteredUsers.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <Users
                            size={42}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                            No users found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminUsers;