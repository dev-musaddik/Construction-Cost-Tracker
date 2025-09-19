import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
  dashboardData: null,
  allDataBalance: null,
  totalExpenses: 0,
  totalDeposits: 0,
  totalCategories: 0,
  balance: 0,
  categories: [],
  deposits: [],
  expenses: [],
  expensesByCategory: [],
  expensesOverTime: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData(state, action) {
      // Check if the payload is not null or undefined
      const data = action.payload || {};

      // Update state properties with default empty or zero values if data is not available
      state.dashboardData = data;
      state.totalExpenses = data.totalExpenses || 0;
      state.totalDeposits = data.totalDeposits || 0;
      state.balance = data.balance || 0;
      state.categories = data.categories || [];
      state.deposits = data.deposits || [];
      state.expenses = data.expenses || [];
      state.expensesByCategory = data.expensesByCategory || [];
      state.expensesOverTime = data.expensesOverTime || [];
    },
    setAllDataBalance(state, action) {
      state.allDataBalance = action.payload;
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

export const {
  setDashboardData,
  setAllDataBalance,
  setLoading,
  setError,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
