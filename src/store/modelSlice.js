import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDepositModalOpen: false,
  isExpenseModalOpen: false,  // New state for expense modal
};

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setIsDepositModalOpen(state, action) {
      state.isDepositModalOpen = action.payload;
    },
    setIsExpenseModalOpen(state, action) {  // New reducer for expense modal
      state.isExpenseModalOpen = action.payload;
    },
  },
});

export const { setIsDepositModalOpen, setIsExpenseModalOpen } = modelSlice.actions;

export default modelSlice.reducer;
