import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import favoriteReducer from "./slices/favoriteSlice";
import notificationReducer from "./slices/notificationSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        favorites: favoriteReducer,
        notifications: notificationReducer,
    },
});