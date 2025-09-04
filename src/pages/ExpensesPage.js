// pages/ExpensesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import expenseService from "../services/expenseService";
import categoryService from "../services/categoryService";
import ExpenseModal from "../components/ExpenseModal";
import { toast } from "react-toastify";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTranslation } from "react-i18next";
import StatCard from "../components/StatCard";
import DashboardAPI from "../services/dashboardService";
import EmptyState from "../components/EmptyState";
import DESkeleton from "../components/DESkeleton";

const categoryValueOf = (cat) => (cat?.code ? cat.code : cat?._id);
const ExpensesPage = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    categoryFilter: "all",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 10, // NEW
  });
  const [pages, setPages] = useState(1);
  const [totalExpensesAmount, setTotalExpensesAmount] = useState("");
  // all data set for add before money
  const [allDataBalance, setAllDataBalance] = useState();
  // useEffect(() => {
  //   const fetchExpensesData = async () => {
  //     setLoading(true);
  //     try {
  //       console.groupCollapsed(
  //         "%c[ExpensesPage] fetchExpensesData",
  //         "color:#3b82f6"
  //       );
  //       console.debug("filters =>", filters);

  //       // Initialize totalAmount
  //       let totalAmount = 0;
  //       let allExpenses = [];

  //       // Loop through all pages and fetch expenses
  //       // let page = 1;
  //       // let hasNextPage = true;

  //       // while (hasNextPage) {
  //         const res = await expenseService.getExpenses(
  //           filters.keyword?.trim() || "",
  //           filters.categoryFilter === "all"
  //             ? undefined
  //             : filters.categoryFilter,
  //           filters.startDate || undefined,
  //           filters.endDate || undefined,
  //           filters.sortBy,
  //           filters.sortOrder,
  //           page,
  //           filters.pageSize // pass pageSize to API
  //         );
  //         console.debug("response for page", page, "=>", res?.data);

  //         const fetchedExpenses = res?.data?.expenses || [];
  //         allExpenses = allExpenses.concat(fetchedExpenses);

  //         // Calculate total amount for this page
  //         totalAmount += fetchedExpenses.reduce(
  //           (sum, expense) => sum + expense.amount,
  //           0
  //         );

  //         // Check if there is a next page
  //         hasNextPage = page < res?.data?.pages;
  //         page++;
  //       }

  //       setExpenses(allExpenses); // Set all expenses
  //       setTotalExpensesAmount(totalAmount); // Set the total amount
  //       setPages(page - 1); // Set the number of pages
  //     } catch (err) {
  //       console.error("[ExpensesPage] getExpenses error:", err);
  //       setError(t("failedToFetchExpenses"));
  //       toast.error(t("failedToFetchExpenses"));
  //     } finally {
  //       console.groupEnd();
  //       setLoading(false);
  //     }
  //   };

  // Fetch dashboard data (with abort support)

  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  // Optional combined loading for legacy UI:
  useEffect(() => {
    setLoading(loadingExpenses || loadingCategories);
  }, [loadingExpenses, loadingCategories, setLoading]);

  // Fetch expenses whenever filters (page, sort, date, keyword, etc.) change:
  useEffect(() => {
    let mounted = true; // prevents setState after unmount / stale responses

    const fetchExpensesData = async () => {
      setExpenses([]);
      console.log(filters);
      setLoadingExpenses(true);
      try {
        console.groupCollapsed(
          "%c[ExpensesPage] fetchExpensesData",
          "color:#3b82f6"
        );
        console.debug("filters =>", filters);

        const res = await expenseService.getExpenses(
          filters.keyword?.trim() || "",
          filters.categoryFilter === "all" ? undefined : filters.categoryFilter,
          filters.startDate || undefined,
          filters.endDate || undefined,
          filters.sortBy,
          filters.sortOrder,
          filters.pageNumber,
          filters.pageSize
        );

        const fetchedExpenses = res?.data?.expenses ?? [];
        const totalForPage = fetchedExpenses.reduce(
          (sum, e) => sum + (e.amount || 0),
          0
        );

        if (!mounted) return;
        setExpenses(fetchedExpenses);
        setTotalExpensesAmount(totalForPage);
        setPages(res?.data?.pages ?? 1);
      } catch (err) {
        if (!mounted) return;
        console.error("[ExpensesPage] getExpenses error:", err);
        setError(t("failedToFetchExpenses"));
        toast.error(t("failedToFetchExpenses"));
      } finally {
        console.groupEnd();
        if (mounted) setLoadingExpenses(false);
      }
    };

    fetchExpensesData();

    return () => {
      mounted = false;
    };
  }, [filters, t]); // keep filters here because expenses depend on them

  // Fetch categories once (or when translation t changes)
  useEffect(() => {
    let mounted = true;

    const fetchCategoriesData = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoryService.getCategories();
        const list = Array.isArray(response?.data) ? response.data : [];
        if (!mounted) return;
        setCategories(list);
        console.debug("[ExpensesPage] categories =>", list);
      } catch (err) {
        if (!mounted) return;
        console.error("[ExpensesPage] getCategories error:", err);
        toast.error(t("failedToFetchCategories"));
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };

    fetchCategoriesData();

    return () => {
      mounted = false;
    };
  }, [t]);

  //dashboard data for total expense
  const fetchDashboardData = useCallback(
    async (signal) => {
      // setDashboardLoading(true);
      // setDashboardError("");
      try {
        const params = {};
        const data = await DashboardAPI.getDashboardData(params, { signal });
        const total = data.expenses.reduce((s, d) => s + d.amount, 0);
        // assuming API returns { balance, ... }
        setAllDataBalance(total ?? null);
        console.log(total);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
          return;
        }
        console.error("[Dashboard] error:", err);
        // setDashboardError(t("failedToFetchDashboardData"));
        toast.error(t("failedToFetchDashboardData"));
      } finally {
        // setDashboardLoading(false);
      }
    },
    [filters, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => controller.abort();
  }, [fetchDashboardData]);

  const handleAddExpense = () => {
    setCurrentExpense(null);
    setIsModalOpen(true);
  };
  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm(t("confirmDeleteExpense"))) {
      try {
        await expenseService.deleteExpense(id);
        toast.success(t("expenseDeletedSuccess"));
        setFilters((prev) => ({ ...prev, pageNumber: 1 }));
      } catch (err) {
        console.error("[ExpensesPage] deleteExpense error:", err);
        toast.error(t("failedToDeleteExpense"));
      }
    }
  };

  const handleSaveExpense = async (expenseData) => {
    console.groupCollapsed(
      "%c[ExpensesPage] handleSaveExpense",
      "color:#16a34a"
    );
    console.debug("payload =>", expenseData);
    try {
      if (expenseData._id) {
        await expenseService.updateExpense(
          expenseData._id,
          expenseData.description,
          expenseData.amount,
          expenseData.category,
          expenseData.date
        );
        toast.success(t("expenseUpdatedSuccess"));
      } else {
        await expenseService.createExpense(
          expenseData.description,
          expenseData.amount,
          expenseData.category,
          expenseData.date
        );
        toast.success(t("expenseAddedSuccess"));
      }
      setIsModalOpen(false);
      setFilters((prev) => ({ ...prev, pageNumber: 1 }));
    } catch (err) {
      console.error("[ExpensesPage] save error:", err);
      toast.error(t("failedToSaveExpense"));
    } finally {
      console.groupEnd();
    }
  };

  const handleExportCsv = () => {
    const url = "https://construction-cost-tracker-server-g2.vercel.app/api/expenses/export/csv";
    console.debug("[ExpensesPage] export CSV ->", url);
    window.open(url, "_blank");
  };
  const handleExportPdf = () => toast.info(t("pdfExportNotImplemented"));
  const handleExportExcel = () => toast.info(t("excelExportNotImplemented"));

  // Same filter handler you wrote, now also respects pageSize
  const handleFilterChange = (field, value, { keepPage = false } = {}) => {
    console.log(field, value, keepPage);
    setFilters((prev) => {
      let next = { ...prev, [field]: value };

      if (field === "keyword") next.keyword = (value ?? "").toString();
      if (field === "categoryFilter") next.categoryFilter = value || "all";

      const isValidDate = (d) => !!d && !Number.isNaN(new Date(d).getTime());
      if (field === "startDate" || field === "endDate") {
        const { startDate, endDate } = next;
        if (isValidDate(startDate) && isValidDate(endDate)) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (start > end) {
            if (field === "startDate") {
              toast.info(t("startAfterEndAdjusted"));
              next.endDate = next.startDate;
            } else {
              toast.info(t("endBeforeStartAdjusted"));
              next.startDate = next.endDate;
            }
          }
        }
      }

      if (!keepPage) next.pageNumber = 1;
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      categoryFilter: "all",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      pageNumber: 1,
      pageSize: 10,
    });
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {/* {loading && <SkeletonLoader />} */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t("expenses")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Total Expenses */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {t("total_expenses")}
            </h2>
            <StatCard value={allDataBalance} />
          </div>

          {/* Current Page Expenses */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {t("current_page_expenses")}
            </h2>
            <StatCard value={totalExpensesAmount} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-4 items-end justify-between">
          {/* Category Filter */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-gray-700"
            >
              {t("category")}
            </label>
            <Select
              onValueChange={(value) =>
                handleFilterChange("categoryFilter", value)
              }
              value={filters.categoryFilter}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat._id || cat.code}
                    value={categoryValueOf(cat)}
                  >
                    {cat.name}
                    {cat.code ? ` (${cat.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t("startDate")}
            </label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t("endDate")}
            </label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort By */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="sortBy"
              className="block text-sm font-medium text-gray-700"
            >
              {t("sortBy")}
            </label>
            <Select
              onValueChange={(value) => handleFilterChange("sortBy", value)}
              value={filters.sortBy}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t("date")}</SelectItem>
                <SelectItem value="amount">{t("amount")}</SelectItem>
                <SelectItem value="date">
                  {t("date")} ({t("transaction")})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-700"
            >
              {t("order")}
            </label>
            <Select
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
              value={filters.sortOrder}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("sortOrder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("descending")}</SelectItem>
                <SelectItem value="asc">{t("ascending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size */}
          <div className="flex-1 min-w-[120px]">
            <label
              htmlFor="pageSize"
              className="block text-sm font-medium text-gray-700"
            >
              {t("pageSize") || "Page size"}
            </label>
            <Select
              onValueChange={(value) =>
                handleFilterChange("pageSize", Number(value))
              }
              value={String(filters.pageSize)}
              className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAddExpense}
              className="min-w-[120px] bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              {t("addExpense")}
            </Button>
            <Button
              onClick={handleExportCsv}
              variant="outline"
              className="min-w-[120px] border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md focus:ring-2 focus:ring-gray-500"
            >
              {t("exportCsv")}
            </Button>
            <Button
              onClick={handleExportPdf}
              variant="outline"
              className="min-w-[120px] border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md focus:ring-2 focus:ring-gray-500"
            >
              {t("exportPdf")}
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="min-w-[120px] border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md focus:ring-2 focus:ring-gray-500"
            >
              {t("exportExcel")}
            </Button>
            <Button
              onClick={resetFilters}
              variant="secondary"
              className="min-w-[120px] bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
            >
              {t("reset")}
            </Button>
            <Button
              variant="default"
              size="lg"
              className="min-w-[120px] hover:bg-primary/90 focus:ring-2 focus:ring-blue-500"
            >
              {t("addExpense")}
            </Button>
          </div>
        </div>

        {loading ? (
          // 1. Show loader if still loading
          // <SkeletonLoader />
          <DESkeleton DE="Expenses" rows={15} />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 10h6M9 14h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                />
              </svg>
            }
            title={t("noExpensesFound")}
            subtitle={t("startAddingExpenses")}
            buttonLabel={t("addExpense")}
            onAction={handleAddExpense}
          />
        ) : (
          // Your normal content for when there are expenses

          <div className="overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat p-6 font-[Patrick Hand,Comic Sans MS,cursive]">
            <table className="min-w-full bg-transparent ">
              <thead>
                <tr className="bg-transparent border-b-2 border-gray-300">
                  <th className="py-3 px-4 text-left font-bold text-slate-800 tracking-wide">
                    {t("description")}
                  </th>
                  <th className="py-3 px-4 text-left font-bold text-slate-800 tracking-wide">
                    {t("amount")}
                  </th>
                  <th className="py-3 px-4 text-left font-bold text-slate-800 tracking-wide">
                    {t("category")}
                  </th>
                  <th className="py-3 px-4 text-left font-bold text-slate-800 tracking-wide">
                    {t("date")}
                  </th>
                  <th className="py-3 px-4 text-left font-bold text-slate-800 tracking-wide">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-slate-100/30 transition-colors border-b border-gray-200"
                  >
                    <td className="py-3 px-4 text-slate-800 italic">
                      {expense.description}
                    </td>
                    <td className="py-3 px-4 text-slate-800 italic">
                      {Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-800 italic">
                      {expense.category
                        ? expense.category.name
                        : t("notAvailable")}
                    </td>
                    <td className="py-3 px-4 text-slate-800 italic">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString()
                        : new Date(expense.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                        className="rounded-lg border-slate-400 hover:bg-sky-50 hover:text-sky-700 font-[inherit]"
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="rounded-lg font-[inherit]"
                      >
                        {t("delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr
                  className="border-t-2 border-gray-500
"
                >
                  <td className="py-2 px-4 font-bold">{t("Total")}</td>
                  <td className="py-2 px-4 font-bold">
                    {expenses
                      .reduce(
                        (sum, deposit) => sum + Number(deposit.amount ?? 0),
                        0
                      )
                      .toFixed(2)}
                  </td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                </tr>
              </tfoot>
            </table>
            {pages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === filters.pageNumber ? "outline" : "default"}
                    onClick={() =>
                      handleFilterChange("pageNumber", p, { keepPage: true })
                    }
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-all shadow-sm border font-[inherit] ${
                      {
                        true: "bg-sky-100 text-sky-700 border-sky-300",
                        false:
                          "bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                      }[p === filters.pageNumber]
                    }`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExpense}
          expense={currentExpense}
        />
      </div>
    </>
  );
};

export default ExpensesPage;
