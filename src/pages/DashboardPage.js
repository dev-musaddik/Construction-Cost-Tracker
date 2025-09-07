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

import DepositModal from "../components/DepositModal";
import depositService from "../services/depositService";
import ExpenseModal from "../components/ExpenseModal";
import expenseService from "../services/expenseService";
import RecentDeposits from "../components/RecentDeposits";
import RecentExpenses from "../components/RecentExpenses";
import StatCard from "../components/StatCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import ErrorFallback from "../components/ErrorFallback";
import { Router } from "lucide-react";
import { fmtMoney } from "../lib/utils";
import SkeletonCard from "../components/SkeletonCard";
import PieChartSkeleton from "../components/PieChartSkeleton";
import { dummyExpenses } from "../components/dummyExpenses";
import axios from "axios";
import DataLoader from "../components/DataLoader";
import { useLoading } from "../context/LoadingContext";
import SignatureLoading from "../components/SignatureLoading ";
import CombinedLoader from "../components/CombinedLoader";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

// Format currency in user's locale, fallback USD if not specified

const monthLabel = (month, year) => {
  if (!month || !year) return "Unknown";
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
};

// YYYY-MM-DD in local time (for <input type="date"/>)
const ymdLocal = (d = new Date()) => {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
};

// ----------------------------- DateFilterBar ------------------------------
function DateFilterBar({
  onApply,
  onPreset,
  preset,
  weekStart,
  setWeekStart,
  loading,
}) {
  console.log(onApply);
  const { t } = useTranslation();
  const [mode, setMode] = useState("day"); // 'day' | 'range'
  const [date, setDate] = useState(ymdLocal());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const apply = () => {
    if (mode === "day") {
      if (!date) return toast.error(t("selectADate"));
      onApply({ date, from: "", to: "" });
    } else {
      if (!from || !to) return toast.error(t("selectFromAndToDates"));
      if (from > to) return toast.error(t("fromCannotBeAfterTo"));
      onApply({ date: "", from, to });
    }
  };

  //   //send data

  const presetBtn = (label, value, onClick) => (
    <Button
      loading={loading}
      text={label}
      type="button"
      variant={preset === value ? "default" : "outline"}
      onClick={onClick}
      className='flex-1 min-w-[220px] w-full sm:w-auto'
    >
      {label}
    </Button>
  );

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 flex flex-col md:flex-wrap md:flex-row gap-3 items-start md:items-end">
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-sm font-medium">{t("mode")}:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            loading={loading}
            text={t("singleDay")}
            type="button"
            variant={mode === "day" ? "default" : "outline"}
            onClick={() => setMode("day")}
          >
            {t("singleDay")}
          </Button>
          <Button
            loading={loading}
            text={t("dateRange")}
            type="button"
            variant={mode === "range" ? "default" : "outline"}
            onClick={() => setMode("range")}
          >
            {t("dateRange")}
          </Button>
        </div>
      </div>

      {mode === "day" ? (
        <div className="flex items-end gap-2 flex-wrap w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2 flex-wrap w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("from")}</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("to")}</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4 w-full justify-start">
        {presetBtn(t("allTime"), "all", () => onPreset("all"))}
        {presetBtn(t("today"), "today", () => onPreset("today"))}
        {presetBtn(t("thisWeek"), "weekly", () => onPreset("weekly"))}
        {presetBtn(t("thisMonth"), "monthly", () => onPreset("monthly"))}
        {/* <div className="flex items-center gap-2">
          <label className="text-sm">{t("weekStarts")}</label>
          <select
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="mon">{t("mon")}</option>
            <option value="sun">{t("sun")}</option>
          </select>
        </div> */}
        <Button
          loading={loading}
          text={t("apply")}
          type="button"
          variant="apply"
          onClick={apply}
        >
          {t("apply")}
        </Button>
      </div>
    </div>
  );
}

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
      try {
        setLoading(true);
        setError(""); // Reset any previous errors
        const params = buildParams();
        console.log(params);

        // API call 1 for dashboard data
        try {
          const data = await DashboardAPI.getDashboardData(params, { signal });
          setDashboardData(data || null);
        } catch (err) {
          console.error("Failed to fetch dashboard data", err);
          setError("Failed to fetch dashboard data.");
          toast.error("Failed to fetch dashboard data.");
        }

        // API call 2 for all data balance
        try {
          const allData = await DashboardAPI.getDashboardData(); // This is a second API request
          setAllDataBalance(allData.balance || null);
        } catch (err) {
          console.error("Failed to fetch balance data", err);
          setError("Failed to fetch balance data.");
          toast.error("Failed to fetch balance data.");
        }
      } catch (err) {
        console.error("Unexpected error occurred", err);
        setError("Unexpected error occurred. Please try again.");
        toast.error("Unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

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

  const sendData = async () => {
    try {
      const userString = localStorage.getItem("user"); // JSON string
      if (!userString) {
        console.error("No user found in localStorage");
        return; // stop execution
      }

      const user = JSON.parse(userString); // now it's an object
      console.log(user.token); // prints your JWT

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      // Loop through expenses inside the same scope as config
      for (const expense of dummyExpenses) {
        await axios.post(
          "https://construction-cost-tracker-server-g2.vercel.app/api/expenses",
          expense,
          config
        );
      }

      console.log("All expenses sent!");
    } catch (err) {
      console.error(
        "Error sending expenses:",
        err.response?.data || err.message
      );
    }
  };

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

  // ------------- UI -------------
  // if (loading) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <DashboardSkeleton />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <ErrorFallback
        t={t}
        error={error}
        retrySeconds={1000}
        onRetry={dashboardData}
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
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
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {t("expensesByCategory")}
            </h2>
            {expensesByCategory.length === 0 ? (
              <p className="text-sm text-gray-500">
                {t("noExpensesByCategory")}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="total"
                    nameKey="category"
                  >
                    {expensesByCategory.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => fmtMoney(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {t("expensesOverTimeMonthly")}
            </h2>
            {formattedExpensesOverTime.length === 0 ? (
              <p className="text-sm text-gray-500">{t("noExpensesOverTime")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={formattedExpensesOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(val) => fmtMoney(val)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
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
