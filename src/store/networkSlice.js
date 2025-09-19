import { createSlice } from '@reduxjs/toolkit';

// Initial state for the slice
const initialState = {
  isOnline: navigator.onLine, // Set initial state based on the current online status
};

// Create the slice
const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    // Action to set the online status to true
    goOnline(state) {
      state.isOnline = true;
    },
    // Action to set the online status to false
    goOffline(state) {
      state.isOnline = false;
    },
  },
});

// Export actions from the slice
export const { goOnline, goOffline } = networkSlice.actions;

// Export the reducer to be used in the store
export default networkSlice.reducer;
