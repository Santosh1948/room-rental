import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../pages/public/Home";
import Properties from "../pages/public/Properties";
import PropertyDetails from "../pages/public/PropertyDetailPage";
import About from "../pages/public/About";
import NotFound from "../pages/public/NotFound";
import Unauthorized from "../pages/public/Unauthorized";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserDashboard from "../pages/user/UserDashboard";
import MyRequests from "../pages/user/MyRequests";
import MyBookings from "../pages/user/MyBookings";
import MyPayments from "../pages/user/MyPayments";
import Favorites from "../pages/user/Favorites";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerProperties from "../pages/owner/OwnerProperties";
import OwnerRequests from "../pages/owner/OwnerRequests";
import OwnerBookings from "../pages/owner/OwnerBookings";
import OwnerPayments from "../pages/owner/OwnerPayments";
import OwnerReviews from "../pages/owner/OwnerReviews";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProperties from "../pages/admin/AdminProperties";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminPayments from "../pages/admin/AdminPayments";

import Notifications from "../pages/shared/Notifications";
import Profile from "../pages/user/Profile";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/about" element={<About />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={["USER", "OWNER", "ADMIN"]} />}>
                <Route
                    element={
                        <DashboardLayout
                            title="Account"
                            subtitle="Your profile and notifications."
                        />
                    }
                >
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
                <Route
                    element={
                        <DashboardLayout
                            title="Renter dashboard"
                            subtitle="Your requests, bookings, and saved homes."
                        />
                    }
                >
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/my-requests" element={<MyRequests />} />
                    <Route path="/my-payments" element={<MyPayments />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
                <Route
                    element={
                        <DashboardLayout
                            title="Owner dashboard"
                            subtitle="Manage listings, requests, and bookings."
                        />
                    }
                >
                    <Route
                        path="/owner/dashboard"
                        element={<OwnerDashboard />}
                    />
                    <Route
                        path="/owner/properties"
                        element={<OwnerProperties />}
                    />
                    <Route
                        path="/owner/requests"
                        element={<OwnerRequests />}
                    />
                    <Route
                        path="/owner/bookings"
                        element={<OwnerBookings />}
                    />
                    <Route
                        path="/owner/payments"
                        element={<OwnerPayments />}
                    />
                    <Route
                        path="/owner/reviews"
                        element={<OwnerReviews />}
                    />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                    element={
                        <DashboardLayout
                            title="Admin dashboard"
                            subtitle="Platform-wide visibility and controls."
                        />
                    }
                >
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route
                        path="/admin/properties"
                        element={<AdminProperties />}
                    />
                    <Route
                        path="/admin/bookings"
                        element={<AdminBookings />}
                    />
                    <Route
                        path="/admin/payments"
                        element={<AdminPayments />}
                    />
                </Route>
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
