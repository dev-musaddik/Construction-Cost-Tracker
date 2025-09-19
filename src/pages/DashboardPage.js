import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fmtMoney, ymdLocal } from "../lib/utils";
import DepositModal from "../components/Deposit/DepositModal";
import ExpenseModal from "../components/Expense/ExpenseModal";
import StatCard from "../components/StatCard";
import RecentDeposits from "../components/Deposit/RecentDeposits";
import RecentExpenses from "../components/Expense/RecentExpenses";
import ChartCard from "../components/Dashboad/ChartCard";
import CombinedLoader from "../components/Loading/CombinedLoader";
import DateFilterBar from "../components/Dashboad/DashboardFilter";
import SkeletonCard from "../components/Skeleton/SkeletonCard";
import { Button } from "../components/ui/button";
// Import the custom hooks, not the functions directly
import { useHandleDepositSave } from "../hooks/useHandleDepositSave";
import { useHandleExpenseSave } from "../hooks/useHandleExpenseSave";

import { downloadDashboardPdf } from "../services/dashboardService";

import { useExpensesVisualizer } from "../hooks/useExpensesVisualizer";
import { useDepositsVisualizer } from "../hooks/useDepositsVisualizer";
import { DownloadDashboardButton } from "../components/DownloadDashboardButton ";

const DashboardPage = () => {
  const { t } = useTranslation();

  const {
    dashboardData,
    categories: categoriesSlice,
    category: categoryLegacy,
    allDataBalance,
    loading,
    error,
  } = useSelector((s) => s.dashboard);
  // Get modal states from the Redux store

  // You'll need to add this in the slice if it doesn't exist yet

  //adding expenses and deposits state
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [currentDeposit, setCurrentDeposit] = useState(null);
  const { handleDepositSave } = useHandleDepositSave();

  const { handleExpenseSave } = useHandleExpenseSave();

  const [query, setQuery] = useState({ date: ymdLocal(), from: "", to: "" });
  const [preset, setPreset] = useState("today");
  const [allTimeTotalBalance, setAllTimeTotalBalance] =
    useState(allDataBalance);

  // Memoize total deposits and expenses calculations
  const totalDepositsForTotalBalance = useMemo(() => {
    return (
      dashboardData?.deposits?.reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      ) || 0
    );
  }, [dashboardData]);

  const totalExpensesForTotalBalance = useMemo(() => {
    return (
      dashboardData?.expenses?.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ) || 0
    );
  }, [dashboardData]);

  // Update AllTimeTotalBalance whenever deposits or expenses change
  useEffect(() => {
    const calculatedBalance =
      totalDepositsForTotalBalance - totalExpensesForTotalBalance;
    setAllTimeTotalBalance(calculatedBalance);
  }, [totalDepositsForTotalBalance, totalExpensesForTotalBalance]);

  // Filter data based on date
  const filteredData = useMemo(() => {
    if (!dashboardData) return {};

    let filteredDeposits = dashboardData.deposits || [];
    let filteredExpenses = dashboardData.expenses || [];
    const parseDate = (date) => {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    // Apply filters based on query.date
    if (query.date) {
      const queryDate = parseDate(query.date);
      if (queryDate) {
        filteredDeposits = filteredDeposits.filter((deposit) => {
          const depositDate = parseDate(deposit.date);
          return (
            depositDate && depositDate.toISOString() === queryDate.toISOString()
          );
        });
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = parseDate(expense.date);
          return (
            expenseDate && expenseDate.toISOString() === queryDate.toISOString()
          );
        });
      }
    }

    // Apply filters based on query.from and query.to
    if (query.from && query.to) {
      const fromDate = parseDate(query.from);
      const toDate = parseDate(query.to);
      if (fromDate && toDate) {
        filteredDeposits = filteredDeposits.filter((deposit) => {
          const depositDate = parseDate(deposit.date);
          return (
            depositDate && depositDate >= fromDate && depositDate <= toDate
          );
        });
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = parseDate(expense.date);
          return (
            expenseDate && expenseDate >= fromDate && expenseDate <= toDate
          );
        });
      }
    }

    return {
      filteredDeposits,
      filteredExpenses,
    };
  }, [dashboardData, query]);

  //Visualizer
  const { formattedExpenses, formattedExpensesOverTime } =
    useExpensesVisualizer(filteredData, dashboardData);

  const { formattedDepositsOverTime } = useDepositsVisualizer(
    filteredData,
    dashboardData
  );

  const totalDeposits = useMemo(() => {
    return (
      filteredData?.filteredDeposits?.reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      ) || 0
    );
  }, [filteredData]);

  const totalExpenses = useMemo(() => {
    return (
      filteredData?.filteredExpenses?.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ) || 0
    );
  }, [filteredData]);

  const onApplyDates = (p) => {
    setQuery(p);
    setPreset(""); // Reset preset filter when applying custom date
  };

  const onPreset = (p) => {
    setPreset(p);
    if (p === "today") setQuery({ date: ymdLocal(), from: "", to: "" });
    if (p === "all") setQuery({ date: "", from: "", to: "" });
  };

  // add deposit and expense func
  const handleAddDeposit = () => {
    setCurrentDeposit(null);
    setIsDepositModalOpen(true);
  };

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsExpenseModalOpen(true);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {loading && <CombinedLoader />}
      <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-2">{t("dashboard")}:</h1>

      <DownloadDashboardButton query={query} />
      </div>
      <DateFilterBar
        onApply={onApplyDates}
        onPreset={onPreset}
        preset={preset}
        loading={loading}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={t("totalExpenses")}
          value={fmtMoney(totalExpenses)}
          loading={loading}
        />
        <StatCard
          label={t("totalDeposits")}
          value={fmtMoney(totalDeposits)}
          loading={loading}
        />
        <StatCard
          label={t("balance")}
          value={fmtMoney(totalDeposits - totalExpenses)}
          allDataTotalBalance={allTimeTotalBalance}
          highlight={totalDeposits - totalExpenses >= 0}
          loading={loading}
        />
        <StatCard
          value={fmtMoney(allTimeTotalBalance)}
          label={t("Total balance")}
          highlight={allTimeTotalBalance >= 0}
          loading={loading}
        />
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap gap-4 w-full justify-center">
        <Button onClick={handleAddDeposit} className="p-2">
          {t("addDeposit")}
        </Button>
        <Button variant="destructive" onClick={handleAddExpense} className="p-2">
          {t("addExpense")}
        </Button>
       
        
      </div>

      {/* Recent Expenses & Deposits */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 mb-4">
        {loading ? (
          <SkeletonCard type="deposit" items={5} />
        ) : (
          <RecentDeposits deposits={filteredData.filteredDeposits} />
        )}
        {loading ? (
          <SkeletonCard type="expense" items={5} />
        ) : (
          <RecentExpenses expenses={filteredData.filteredExpenses} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Expenses by Category */}
        <ChartCard
          title="Expenses by Category"
          data={formattedExpenses || []}
          chartType="pie"
          chartDataKey="total"
          chartNameKey="category"
          tooltipFormatter={(val) => fmtMoney(val)}
          noDataMessage="No expenses by category"
          className="col-span-1 lg:col-span-3" // Make this span full width on smaller screens
        />

        {/* Expenses Over Time (Monthly) */}
        <ChartCard
          title="Expenses Over Time (Monthly)"
          data={formattedExpensesOverTime || []}
          chartType="line"
          chartDataKey="total"
          tooltipFormatter={(val) => fmtMoney(val)}
          noDataMessage="No expenses over time"
          className="col-span-1 lg:col-span-1" // Each takes 1 column on larger screens
        />

        {/* Deposits Over Time (Monthly) */}
        <ChartCard
          title="Deposits Over Time (Monthly)"
          data={formattedDepositsOverTime || []}
          chartType="line"
          chartDataKey="total"
          tooltipFormatter={(val) => fmtMoney(val)}
          noDataMessage="No deposits over time"
          className="col-span-1 lg:col-span-1" // Each takes 1 column on larger screens
        />
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSave={(depositData) =>
          handleDepositSave(depositData, setIsDepositModalOpen)
        }
        deposit={currentDeposit}
      />
      {/* Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={(expenseData) =>
          handleExpenseSave(expenseData, setIsExpenseModalOpen)
        }
        expense={currentExpense}
      />
    </div>
  );
};

export default DashboardPage;
