// store/depositSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
  deposits: [],
};

const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    setDeposits(state, action) {
      state.deposits = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = "";
    },
  },
});

export const { setDeposits, setLoading, setError, clearError } = depositSlice.actions;
export default depositSlice.reducer;

