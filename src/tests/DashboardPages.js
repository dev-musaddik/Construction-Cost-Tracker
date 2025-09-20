import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

// ✅ Use the enhanced service (params builder + auth). Remove unused imports.
import DashboardAPI, {
  buildDashboardParams,
} from "../services/dashboardService";

import DepositModal from "../components/Deposit/DepositModal";
import depositService from "../services/depositService";
import ExpenseModal from "../components/Expense/ExpenseModal";
import expenseService from "../services/expenseService";
import RecentDeposits from "../components/Deposit/RecentDeposits";
import StatCard from "../components/StatCard";
import ErrorFallback from "../components/ErrorFallback";
import { fmtMoney, monthLabel, ymdLocal } from "../lib/utils";
import SkeletonCard from "../components/Skeleton/SkeletonCard";
import PieChartSkeleton from "../components/Skeleton/PieChartSkeleton";
import { dummyExpenses } from "../components/dummyExpenses";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";
import CombinedLoader from "../components/Loading/CombinedLoader";
import DateFilterBar from "../components/Dashboad/DashboardFilter";
import RecentExpenses from "../components/Expense/RecentExpenses";
import ChartCard from "../components/Dashboad/ChartCard";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];





// -------------------------------- Page -----------------------------------
const DashboardPage = () => {

  
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Unified params used by backend (single day OR range) + optional filter presets
  const [query, setQuery] = useState({ date: ymdLocal(), from: "", to: "" });
  const [preset, setPreset] = useState("today"); // 'all' | 'today' | 'weekly' | 'monthly'
  const [weekStart, setWeekStart] = useState("mon");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // all data set for add before money
  const [allDataBalance, setAllDataBalance] = useState();
  const { navigationLoading } = useLoading();
  console.log(navigationLoading);

  const buildParams = useCallback(() => {
    console.groupCollapsed("%c[DashboardPage] buildParams", "color:#f59e0b");
    console.debug("state =>", { preset, query, weekStart });

    // ✅ Short-circuit ALL-TIME before calling the builder (prevents date validation from running)
    if (preset === "all") {
      console.debug("built params =>", {});
      console.groupEnd();
      return {};
    }

    // Preset windows (today/weekly/monthly)
    if (preset) {
      const p = buildDashboardParams({ filter: preset, weekStart });
      console.debug("built params =>", p);
      console.groupEnd();
      return p;
    }

    // Explicit date/range
    const clean = buildDashboardParams({ ...query, weekStart });
    console.debug("built params =>", clean);
    console.groupEnd();
    return clean;
  }, [preset, query, weekStart]);

  // ---------------------- Heart of this Dashboard -------------------
  const fetchDashboardData = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      const params = buildParams();
      console.log("🔄 Fetching dashboard data with params:", params);

      try {
        // === API 1: Dashboard Data ===
        const dashboardResponse = await DashboardAPI.getDashboardData(params, {
          signal,
        });
        setDashboardData(dashboardResponse || null);
        console.log("✅ Dashboard data fetched:", dashboardResponse);

        // === API 2: All Data Balance ===
        const balanceResponse = await DashboardAPI.getDashboardData({ signal });
        setAllDataBalance(balanceResponse.balance || null);
        console.log("💰 Balance data fetched:", balanceResponse);
      } catch (err) {
        console.error("❌ Error in fetchDashboardData:", err);

        if (err.name === "AbortError") {
          console.warn("⚠️ Request aborted by user.");
          return;
        }

        setError("Failed to fetch dashboard data. Please try again.");
        toast.error("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // Retry function that uses an AbortController
  const retryFunction = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchDashboardData(signal);
  };

  // Initial & reactive fetch with abort safety
  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => controller.abort();
  }, [fetchDashboardData]);

  const onApplyDates = (p) => {
    setPreset(""); // switching to explicit date/range clears preset filter
    setQuery(p);
  };

  const onPreset = (p) => {
    setPreset(p);
  };

  // ------------- Derived data -------------
  const {
    totalExpenses = 0,
    totalDeposits = 0,
    balance = 0,
    expensesByCategory = [],
    expensesOverTime = [],
    deposits = [],
    expenses = [],
    meta,
  } = dashboardData || {};

  const { allDataTotalBalance = [] } = allDataBalance || {};


  // for developer send any kind of data then use this 
  // const sendData = async () => {
  //   try {
  //     const userString = localStorage.getItem("user"); // JSON string
  //     if (!userString) {
  //       console.error("No user found in localStorage");
  //       return; // stop execution
  //     }

  //     const user = JSON.parse(userString); // now it's an object
  //     console.log(user.token); // prints your JWT

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     // Loop through expenses inside the same scope as config
  //     for (const expense of dummyExpenses) {
  //       await axios.post(
  //         "https://construction-cost-tracker-server-g2.vercel.app/api/expenses",
  //         expense,
  //         config
  //       );
  //     }

  //     console.log("All expenses sent!");
  //   } catch (err) {
  //     console.error(
  //       "Error sending expenses:",
  //       err.response?.data || err.message
  //     );
  //   }
  // };

  const formattedExpensesOverTime = useMemo(
    () =>
      (expensesOverTime || [])
        .map((row) => {
          const month = row?._id?.month ?? null;
          const year = row?._id?.year ?? null;
          return {
            name: monthLabel(month, year),
            total: Number(row?.total ?? 0),
            _sortKey:
              year && month ? Number(year) * 100 + Number(month) : -Infinity,
          };
        })
        .filter((r) => r._sortKey !== -Infinity)
        .sort((a, b) => a._sortKey - b._sortKey),
    [expensesOverTime]
  );

 

  if (error) {
    return (
      <ErrorFallback
        t={t}
        error={error}
        retrySeconds={1000}
        onRetry={retryFunction}
        onReport={() => console.log("report")}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 transition-all duration-300 ease-in-out">
      {/* {navigationLoading?'' : loading && <DataLoader/>} */}
      {loading && !navigationLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center">
          <CombinedLoader />
        </div>
      )}

      {/* <CombinedLoader/> */}
      <h1 className="text-3xl font-bold mb-2">{t("dashboard")}</h1>

      {loading ? (
        <div className="flex items-center">
          <p className="text-sm text-gray-500 mb-4">Range:</p>
          <p className="text-sm text-gray-300 bg-gray-200 animate-pulse mb-4 h-4 w-2/6 rounded"></p>
        </div>
      ) : (
        <p className="text-sm text-gray-800 mb-4 and border-yellow-300">
          {meta?.startDate ? (
            `${t("range")}: ${new Date(
              meta.startDate
            ).toLocaleString()} — ${new Date(meta.endDate).toLocaleString()}`
          ) : (
            <>
              {t("range")}: {t("allTime")}
            </>
          )}
        </p>
      )}

      <DateFilterBar
        onApply={onApplyDates}
        onPreset={onPreset}
        preset={preset}
        weekStart={weekStart}
        setWeekStart={setWeekStart} 
        loading={loading}
      />
      {/* <Button loading={loading} onClick={sendData}>Send Dummy Expenses</Button> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          type="totalExpenses"
          loading={loading}
          label={t("totalExpenses")}
          value={fmtMoney(totalExpenses)}
        />
        <StatCard
          loading={loading}
          label={t("totalDeposits")}
          value={fmtMoney(totalDeposits)}
        />
        <StatCard
          loading={loading}
          label={t("balance")}
          value={fmtMoney(balance)}
          highlight={balance >= 0}
          allDataTotalBalance={allDataBalance}
        />
        <StatCard
          type="totalBalance"
          loading={loading}
          label={t("Total balance")}
          value={
            allDataBalance <= 0
              ? fmtMoney(allDataBalance)
              : fmtMoney(allDataBalance)
          }
          highlight={allDataBalance >= 0}
        />
      </div>

      <div className="flex justify-end mb-4 space-x-4 mt-6">
        <Button
          loading={loading}
          text={t("addDeposit")}
          onClick={() => setIsDepositModalOpen(true)}
          variant="apply"
        >
          {t("addDeposit")}
        </Button>
        <Button
          loading={loading}
          text={t("addExpense")}
          onClick={() => setIsExpenseModalOpen(true)}
          variant="destructive"
        >
          {t("addExpense")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 mb-4">
        {loading ? (
          <>
            <SkeletonCard type="expense" items={5} />
            <SkeletonCard type="deposit" items={5} />
          </>
        ) : (
          <>
            <RecentExpenses expenses={expenses} />
            <RecentDeposits deposits={deposits} />
          </>
        )}
      </div>
      {loading ? (
        <PieChartSkeleton items={expensesByCategory.length} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartCard
        title="Expenses by Category"
        data={expensesByCategory}
        chartType="pie"
        chartDataKey="total"
        chartNameKey="category"
        tooltipFormatter={(val) => fmtMoney(val)}
        noDataMessage="No expenses by category"
      />
      <ChartCard
        title="Expenses Over Time (Monthly)"
        data={formattedExpensesOverTime}
        chartType="line"
        chartDataKey="total"
        tooltipFormatter={(val) => fmtMoney(val)}
        noDataMessage="No expenses over time"
      />
    </div>
      )}
      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSave={async (depositData) => {
          try {
            if (depositData._id) {
              await depositService.updateDeposit(
                depositData._id,
                depositData.description,
                depositData.amount,
                depositData.date
              );
              toast.success(t("depositUpdated"));
            } else {
              await depositService.createDeposit(
                depositData.description,
                depositData.amount,
                depositData.date
              );
              toast.success(t("depositAdded"));
            }
            setIsDepositModalOpen(false);
            const controller = new AbortController();
            fetchDashboardData(controller.signal);
          } catch (e) {
            toast.error(t("failedToSaveDeposit"));
          }
        }}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={async (expenseData) => {
          try {
            // ✅ Check for missing fields
            if (
              !expenseData.description ||
              !expenseData.amount ||
              !expenseData.category ||
              !expenseData.date
            ) {
              toast.error(t("pleaseFillInAllFields"));
              return;
            }

            // ✅ Validate amount
            const amountNum = Number(expenseData.amount);
            if (!Number.isFinite(amountNum) || amountNum <= 0) {
              toast.error(t("pleaseEnterAValidAmount"));
              return;
            }

            // ✅ If expense already exists → update
            if (expenseData._id) {
              await expenseService.updateExpense(
                expenseData._id,
                expenseData.description,
                expenseData.amount,
                expenseData.category,
                expenseData.date,
                expenseData.isContract
              );
              toast.success(t("expenseUpdated"));
            }
            // ✅ Otherwise → create new expense
            else {
              await expenseService.createExpense(
                expenseData.description,
                expenseData.amount,
                expenseData.category,
                expenseData.date,
                expenseData.isContract
              );
              toast.success(t("expenseAdded"));
            }

            // ✅ Close modal & refresh data
            setIsExpenseModalOpen(false);
            const controller = new AbortController();
            fetchDashboardData(controller.signal);
          } catch (e) {
            toast.error(t("failedToSaveExpense"));
          }
        }}
      />
    </div>
  );
};

export default DashboardPage;
