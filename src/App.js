import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ExpensesPage from "./pages/ExpensesPage";
import DepositsPage from "./pages/DepositsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import TodoPage from "./pages/TodoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import usePageLoader from "./hooks/usePageLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "./context/LoadingContext";
import ContractExpensesPage from "./pages/ContractExpensesPage ";
import CombinedLoader from "./components/Loading/CombinedLoader";
import { goOffline, goOnline } from "./store/networkSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setError, setLoading } from "./store/dashboardSlice";
import { DashboardAPI } from "./services/dashboardService";
import DataLoader from "./components/Loading/DataLoader";

function App() {
  const { user } = useAuth();
  const loading = usePageLoader();
  const { setNavigationLoading } = useLoading();
  const [initialLoad, setInitialLoad] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); // Track data loading state
  const location = useLocation(); // Get the current route location

  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard);
  const isOnline = useSelector((state) => state.network.isOnline);

  useEffect(() => {
    // If the user is logged in and dashboardData is not loaded yet, fetch the data
    if (user) {
      const fetchDashboardData = async () => {
        setDataLoading(true); // Set loading to true when fetching data
        dispatch(setLoading(true));
        try {
          const response = await DashboardAPI.getAll(); // Correct method call
          dispatch(setDashboardData(response)); // Store data in Redux
        } catch (error) {
          dispatch(setError("Failed to load data. Error:", error.message));
          console.error("Dashboard data fetch error:", error.message);
        } finally {
          dispatch(setLoading(false));
          setDataLoading(false); // Set loading to false once data is fetched
        }
      };

      fetchDashboardData();
    }

    // If the user logs out, clear the dashboard data
    else if (!user && dashboardData) {
      dispatch(setDashboardData(null));
    }
  }, [user, dispatch]); // Only depend on `user` and `dispatch`

  // Set navigation loading inside useEffect to prevent re-renders
  useEffect(() => {
    setNavigationLoading(loading);
  }, [loading, setNavigationLoading]);

  // Detect full page refresh
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "reload" || navType === "navigate") {
      setInitialLoad(true);
    } else {
      setInitialLoad(false);
    }
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      toast.success("You are online!");
      if (navigator.onLine && !dataLoading) {
        setTimeout(() => {
          window.location.reload();
        }, 5000); // Wait for 5 seconds before reloading
      }
    };

    const handleOffline = () => {
      dispatch(goOffline()); // Dispatch action to set offline status
      toast.error("You are offline!");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch, dataLoading]);

  return (
    <>
      {/* Show loader while navigating */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full  flex items-center justify-center z-50">
          <CombinedLoader />
        </div>
      )}

      <Navbar />
      <main className="py-3">
        <div className="container mx-auto">
          <Routes location={location}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposits"
              element={
                <ProtectedRoute>
                  <DepositsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contract"
              element={
                <ProtectedRoute>
                  <ContractExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <TodoPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
