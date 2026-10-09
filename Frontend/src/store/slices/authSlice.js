import { createSlice } from "@reduxjs/toolkit";

const safeParse = (value) => {
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const storedUser = safeParse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
    user: storedUser,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            const { user, token } = action.payload;

            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },

        updateUser: (state, action) => {
            state.user = action.payload;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        },
    },
});

export const {
    loginSuccess,
    logout,
    updateUser,
} = authSlice.actions;

export default authSlice.reducer;