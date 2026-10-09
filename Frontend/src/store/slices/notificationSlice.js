import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",

    initialState: {
        items: [],
        unreadCount: 0,
    },

    reducers: {
        setNotifications: (state, action) => {
            state.items = action.payload;

            state.unreadCount = action.payload.filter(
                (notification) => !notification.isRead
            ).length;
        },

        markAsRead: (state, action) => {
            const notification = state.items.find(
                (item) => item._id === action.payload
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount -= 1;
            }
        },

        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    setNotifications,
    markAsRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;