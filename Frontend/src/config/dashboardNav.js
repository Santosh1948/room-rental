import {
    Building2,
    CalendarCheck,
    CreditCard,
    Heart,
    Home,
    Inbox,
    LayoutDashboard,
    Send,
    Shield,
    Star,
    UserRound,
    Users,
} from "lucide-react";

export const userNav = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/my-requests", label: "My Requests", icon: Send },
    { to: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
    { to: "/my-payments", label: "Payments", icon: CreditCard },
    { to: "/favorites", label: "Favorites", icon: Heart },
    { to: "/notifications", label: "Notifications", icon: Inbox },
    { to: "/profile", label: "Profile", icon: UserRound },
];

export const ownerNav = [
    { to: "/owner/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/owner/properties", label: "Properties", icon: Building2 },
    { to: "/owner/requests", label: "Requests", icon: Send },
    { to: "/owner/bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/owner/payments", label: "Payments", icon: CreditCard },
    { to: "/owner/reviews", label: "Reviews", icon: Star },
    { to: "/notifications", label: "Notifications", icon: Inbox },
    { to: "/profile", label: "Profile", icon: UserRound },
];

export const adminNav = [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/properties", label: "Properties", icon: Building2 },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/notifications", label: "Notifications", icon: Inbox },
    { to: "/profile", label: "Profile", icon: UserRound },
];

export const getDashboardHome = (role) => {
    if (role === "OWNER") return "/owner/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    return "/dashboard";
};

export const getNavForRole = (role) => {
    if (role === "OWNER") return ownerNav;
    if (role === "ADMIN") return adminNav;
    return userNav;
};

export const roleLabels = {
    USER: { label: "Renter", icon: Home },
    OWNER: { label: "Owner", icon: Building2 },
    ADMIN: { label: "Admin", icon: Shield },
};
