import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: "favorites",

    initialState: {
        items: [],
        loading: false,
    },

    reducers: {
        setFavorites: (state, action) => {
            state.items = action.payload;
        },

        addFavorite: (state, action) => {
            const exists = state.items.some(
                (item) => item._id === action.payload._id
            );

            if (!exists) {
                state.items.push(action.payload);
            }
        },

        removeFavorite: (state, action) => {
            state.items = state.items.filter(
                (item) => item._id !== action.payload
            );
        },

        clearFavorites: (state) => {
            state.items = [];
        },

        setFavoriteLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    setFavoriteLoading,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;