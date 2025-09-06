// src/context/LoadingContext.js
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [navigationLoading, setNavigationLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ navigationLoading, setNavigationLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for easy access
export const useLoading = () => useContext(LoadingContext);
