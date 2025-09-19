// store/expenseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
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

export const { setExpenses, setLoading, setError, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
