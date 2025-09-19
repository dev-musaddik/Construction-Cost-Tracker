// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice"; 
import depositReducer from "./depositSlice";
import expenseReducer from "./expenseSlice";
import networkReducer from "./networkSlice";
import modelReducer from "./modelSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    deposit: depositReducer,
    expense: expenseReducer,
    network: networkReducer, // Add the network slice reducer to the store
    model:modelReducer,

  },
});

export default store;
