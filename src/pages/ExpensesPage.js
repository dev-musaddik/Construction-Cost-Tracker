import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ExpenseModal from "../components/Expense/ExpenseModal";
import CombinedLoader from "../components/Loading/CombinedLoader";
import { fmtMoney } from "../lib/utils";
import DESkeleton from "../components/Skeleton/DESkeleton";
import { useHandleExpenseSave } from "../hooks/useHandleExpenseSave";

// ---------- helpers ----------
const toDate = (x) => new Date(x ?? 0);
const getCatId = (e) =>
  typeof e?.category === "object" ? e.category?._id : e?.category;
const getCatName = (e, map) =>
  map.get(getCatId(e)) ?? e?.category?.name ?? e?.category ?? "—";

export default function ExpensesPage() {
  const { t } = useTranslation();

  // pull from dashboard slice; support both `categories` and legacy `category` keys
  const {
    dashboardData,
    categories: categoriesSlice,
    category: categoryLegacy,
    allDataBalance,
    loading,
    error,
  } = useSelector((s) => s.dashboard);

  // also read expense slice as a fallback if dashboardData not present
  const expenseSlice = useSelector((s) => s.expense?.expenses);

  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: "all",
    startDate: "",
    endDate: "",
    sortBy: "date", // 'date' | 'amount' | 'createdAt'
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 10, // Default page size
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const { handleExpenseSave, handleExpenseDelete } = useHandleExpenseSave();

  // normalize categories list from dashboard
  const categories = useMemo(() => {
    const list =
      dashboardData?.categories || categoriesSlice || categoryLegacy || [];
    return Array.isArray(list) ? list : [];
  }, [dashboardData, categoriesSlice, categoryLegacy]);

  // create a quick id->name map for O(1) lookups
  const catIdToName = useMemo(() => {
    const m = new Map();
    for (const c of categories) m.set(c._id, c.name);
    return m;
  }, [categories]);

  // normalize expenses
  const expenses = useMemo(() => {
    const fromDashboard = dashboardData?.expenses;
    if (Array.isArray(fromDashboard) && fromDashboard.length)
      return fromDashboard;
    return Array.isArray(expenseSlice) ? expenseSlice : [];
  }, [dashboardData, expenseSlice]);

  // derived + filtered + sorted + paged (no mutations)
  const { filtered, paged, pages, pageTotal } = useMemo(() => {
    let list = Array.isArray(expenses) ? expenses : [];

    // keyword
    const kw = filters.keyword.trim().toLowerCase();
    if (kw)
      list = list.filter((e) =>
        (e.description ?? "").toLowerCase().includes(kw)
      );

    // category by id (supports both id string and embedded object)
    if (filters.categoryId !== "all") {
      list = list.filter((e) => getCatId(e) === filters.categoryId);
    }

    // date range inclusive
    if (filters.startDate && filters.endDate) {
      const s = new Date(filters.startDate);
      const e = new Date(filters.endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((row) => {
        const d = toDate(row.date ?? row.createdAt);
        return d >= s && d <= e;
      });
    }

    // sort safely
    if (filters.sortBy) {
      const cmp = (a, b) => {
        const key = filters.sortBy;
        let A;
        let B;
        if (key === "amount") {
          A = Number(a.amount || 0);
          B = Number(b.amount || 0);
        } else if (key === "createdAt" || key === "date") {
          A = toDate(a[key] ?? a.date ?? a.createdAt).getTime();
          B = toDate(b[key] ?? b.date ?? a.createdAt).getTime();
        } else {
          A = (a[key] ?? "").toString().toLowerCase();
          B = (b[key] ?? "").toString().toLowerCase();
        }
        if (A < B) return filters.sortOrder === "asc" ? -1 : 1;
        if (A > B) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      };
      list = [...list].sort(cmp);
    }

    // pagination
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / filters.pageSize));
    const current = Math.min(filters.pageNumber, pages);
    const start = (current - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    const paged = list.slice(start, end);

    const pageTotal = paged.reduce((s, e) => s + Number(e.amount || 0), 0);

    return { filtered: list, paged, pages, pageTotal };
  }, [expenses, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      pageNumber: field === "pageNumber" ? value : 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      categoryId: "all",
      startDate: "",
      endDate: "",
      sortBy: "date",
      sortOrder: "desc",
      pageNumber: 1,
      pageSize: 10, // Reset to default page size
    });
  };

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    console.log(expense);
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };



  const totalExpensesForTotalBalance = useMemo(() => {
      return (
        dashboardData?.expenses?.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ) || 0
      );
    }, [dashboardData]);
  

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {loading && <CombinedLoader />}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t("expenses")}</h1>

        {/* Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {t("total_expenses")}
            </h2>
            <StatCard value={fmtMoney(totalExpensesForTotalBalance)} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {t("current_page_expenses")}
            </h2>
            <StatCard value={fmtMoney(pageTotal)} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("search")}
            </label>
            <Input
              placeholder={t("searchByDescription")}
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
            />
          </div>

          {/* Category filter by ID, label shows name */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("category")}
            </label>
            <Select
              value={filters.categoryId}
              onValueChange={(v) => handleFilterChange("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
                <SelectItem value="all">{t("all")}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}{" "}
                    <span className="text-xs text-gray-400">• {c._id}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("startDate")}
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("endDate")}
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          {/* Sort by / order */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("sortBy")}
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(v) => handleFilterChange("sortBy", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
                <SelectItem value="date">{t("date")}</SelectItem>
                <SelectItem value="createdAt">{t("createdAt")}</SelectItem>
                <SelectItem value="amount">{t("amount")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("order")}
            </label>
            <Select
              value={filters.sortOrder}
              onValueChange={(v) => handleFilterChange("sortOrder", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
                <SelectItem value="desc">{t("descending")}</SelectItem>
                <SelectItem value="asc">{t("ascending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              {t("pageSize")}
            </label>
            <Select
              value={filters.pageSize.toString()}
              onValueChange={(v) =>
                handleFilterChange("pageSize", parseInt(v, 10))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-4">
          <Button variant="outline" onClick={resetFilters}>
            {t("reset")}
          </Button>
          <Button variant="destructive" onClick={handleAddExpense}>
            {t("addExpense")}
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <DESkeleton DE="Expenses" rows={10} />
        ) : Array.isArray(expenses) && expenses.length === 0 ? (
          <EmptyState
            title={t("noExpensesFound")}
            subtitle={t("startAddingExpenses")}
            buttonLabel={t("addExpense")}
            onAction={handleAddExpense}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("noResults")}
            subtitle={t("tryAdjustingFilters")}
            buttonLabel={t("reset")}
            onAction={resetFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="bg-transparent">
                  <th>{t("description")}</th>
                  <th>{t("amount")}</th>
                  <th>{t("category")}</th>
                  <th>{t("date")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="space-x-2" >
                {paged.map((row) => (
                  <tr key={row._id}>
                    <td>{row.description}</td>
                    <td>{fmtMoney(row.amount)}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{getCatName(row, catIdToName)}</span>
                        {/* Hide the category ID on small screens */}
                        <span className="text-xs text-gray-400 hidden lg:flex">
                          {getCatId(row)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {toDate(row.date ?? row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="flex flex-col sm:flex-row sm:space-x-2 sm:w-full">
                      <Button
                        onClick={() => handleEditExpense(row)}
                        className="w-full sm:w-auto p-2 auto mb-1 sm:mb-0"
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleExpenseDelete(row._id)}
                        className="w-full p-2 mb-2  sm:w-auto"
                      >
                        {t("delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          pages={pages}
          currentPage={filters.pageNumber}
          onPageChange={(p) => handleFilterChange("pageNumber", p)}
        />

        {/* Page Data */}
        <div className="text-sm mb-4">
          {t("currentPageData")} {filters.pageNumber} / {filtered.length}
        </div>
        {/* Modal */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(expenseData) =>
            handleExpenseSave(expenseData, setIsModalOpen)
          }
          expense={currentExpense}
        />
      </div>
    </>
  );
}
