import React, { useEffect, useMemo, useState } from "react";
import {useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CombinedLoader from "../components/Loading/CombinedLoader";
import EmptyState from "../components/EmptyState";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";


// ---- utils ----
const toDate = (x) => new Date(x ?? 0);
const getCatId = (e) =>
  typeof e?.category === "object" ? e.category?._id : e?.category;
const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ContractExpensesPage() {
  const { t } = useTranslation();

  const { dashboardData, loading, error } = useSelector((s) => s.dashboard);

  // ---------- local UI state ----------
  const [selectedCategory, setSelectedCategory] = useState("");
  const [agreementAmounts, setAgreementAmounts] = useState({}); // by categoryId
  const [filters, setFilters] = useState({
    keyword: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "date", // 'date' | 'createdAt' | 'amount'
    sortOrder: "desc",
    contractOnly: true, // only show expenses with isContract===true when present
    pageNumber: 1,
    pageSize: 10, // Default page size
  });

  // ---------- base data from Redux ----------
  const categories = useMemo(() => {
    const list = dashboardData?.categories || dashboardData?.category || [];
    return Array.isArray(list) ? list : [];
  }, [dashboardData]);

  const allExpenses = useMemo(() => {
    const list = dashboardData?.expenses || [];
    return Array.isArray(list) ? list : [];
  }, [dashboardData]);

  // Filter categories based on isContract in expenses
  const filteredCategories = useMemo(() => {
    const validCategories = new Set();

    // Find all category ids linked to expenses where isContract is true
    allExpenses.forEach((expense) => {
      if (expense.isContract && expense.category) {
        validCategories.add(expense.category);
      }
    });

    // Filter categories to only include those valid for isContract
    return categories.filter((category) => validCategories.has(category._id));
  }, [categories, allExpenses]);

  // auto-select first category when available
  useEffect(() => {
    if (!selectedCategory && filteredCategories.length > 0) {
      setSelectedCategory(filteredCategories[0]._id);
    }
  }, [filteredCategories, selectedCategory]);

  // quick map for category names by id
  const catIdToName = useMemo(() => {
    const m = new Map();
    for (const c of filteredCategories) m.set(c._id, c.name);
    return m;
  }, [filteredCategories]);

  // ---------- derived: filtered + sorted + paged ----------
  const { filtered, paged, pages, totals } = useMemo(() => {
    let list = allExpenses;

    // contractOnly (only apply if any item has the flag to avoid hiding everything)
    const hasFlag = list.some((e) =>
      Object.prototype.hasOwnProperty.call(e, "isContract")
    );
    if (filters.contractOnly && hasFlag) {
      list = list.filter((e) => e.isContract === true);
    }

    // category selection
    if (selectedCategory) {
      list = list.filter((e) => getCatId(e) === selectedCategory);
    }

    // keyword
    const kw = filters.keyword.trim().toLowerCase();
    if (kw)
      list = list.filter((e) =>
        (e.description ?? "").toLowerCase().includes(kw)
      );

    // amounts
    if (filters.minAmount !== "") {
      const min = Number(filters.minAmount);
      list = list.filter((e) => Number(e.amount ?? 0) >= min);
    }
    if (filters.maxAmount !== "") {
      const max = Number(filters.maxAmount);
      list = list.filter((e) => Number(e.amount ?? 0) <= max);
    }

    // dates (inclusive)
    if (filters.startDate) {
      const s = new Date(filters.startDate);
      list = list.filter((row) => toDate(row.date ?? row.createdAt) >= s);
    }
    if (filters.endDate) {
      const e = new Date(filters.endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((row) => toDate(row.date ?? row.createdAt) <= e);
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
          B = toDate(b[key] ?? b.date ?? b.createdAt).getTime();
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

    const totalAll = list.reduce((s, e) => s + Number(e.amount || 0), 0);

    // pagination
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / filters.pageSize));
    const current = Math.min(filters.pageNumber, pages);
    const start = (current - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    const paged = list.slice(start, end);

    const pageTotal = paged.reduce((s, e) => s + Number(e.amount || 0), 0);

    return { filtered: list, paged, pages, totals: { totalAll, pageTotal } };
  }, [allExpenses, selectedCategory, filters]);

  const handleAgreementAmountChange = (category, amount) => {
    setAgreementAmounts((prev) => ({ ...prev, [category]: String(amount) }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      pageNumber: field === "pageNumber" ? value : 1, // Ensure pageNumber resets
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      sortBy: "date",
      sortOrder: "desc",
      contractOnly: true,
      pageNumber: 1,
      pageSize: 10, // Default page size
    });
  };

  if (error) return <p className="text-red-500">{error}</p>;

  const agreementAmount = Number(agreementAmounts[selectedCategory] ?? 5000);
  const progress =
    agreementAmount > 0
      ? Math.min(100, (totals.totalAll / agreementAmount) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <CombinedLoader />}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t("contractExpenses")}
      </h1>

      {/* Top controls */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        {/* Category list */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {(filteredCategories || []).map((c) => (
              <div
                key={c._id}
                className={`cursor-pointer sm:text-lg text-sm p-3 rounded-lg transition-all duration-200 ${
                  selectedCategory === c._id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedCategory(c._id)}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("search")}
              </label>
              <Input
                placeholder={t("searchByDescription")}
                value={filters.keyword}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("minAmount")}
              </label>
              <Input
                type="number"
                value={filters.minAmount}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("maxAmount")}
              </label>
              <Input
                type="number"
                value={filters.maxAmount}
                onChange={(e) =>
                  handleFilterChange("maxAmount", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("startDate")}
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("endDate")}
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
            <div>
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
                <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200 rounded-md shadow-lg">
                  <SelectItem value="date">{t("date")}</SelectItem>
                  <SelectItem value="createdAt">{t("createdAt")}</SelectItem>
                  <SelectItem value="amount">{t("amount")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
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
                <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200 rounded-md shadow-lg">
                  <SelectItem value="desc">{t("descending")}</SelectItem>
                  <SelectItem value="asc">{t("ascending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <input
                id="contractOnly"
                type="checkbox"
                checked={filters.contractOnly}
                onChange={(e) =>
                  handleFilterChange("contractOnly", e.target.checked)
                }
                className="w-4 h-4"
              />
              <label htmlFor="contractOnly" className="text-sm text-gray-700">
                {t("contractOnly")}
              </label>
            </div>

            {/* New Page Size filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("pageSize")}
              </label>
              <Select
                value={filters.pageSize}
                onValueChange={(v) => handleFilterChange("pageSize", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200 rounded-md shadow-lg">
                  <SelectItem value={10}>10</SelectItem>
                  <SelectItem value={25}>25</SelectItem>
                  <SelectItem value={50}>50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters}>
                {t("reset")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement + progress */}
      <div className="bg-white shadow rounded p-4 mb-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <p className="text-lg font-semibold text-gray-800">
            {t("totalExpenses")}: ${fmt(totals.totalAll)}
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("agreementAmount")}:
            </label>
            <Input
              type="number"
              value={agreementAmounts[selectedCategory] ?? 5000}
              onChange={(e) =>
                handleAgreementAmountChange(selectedCategory, e.target.value)
              }
              className="mt-1 w-40"
            />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className={`${
              progress < 50
                ? "bg-green-500"
                : progress < 80
                ? "bg-yellow-500"
                : "bg-red-500"
            } h-2 rounded-full`}
            style={{ width: `${progress}%`, transition: "width 0.25s ease" }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {t("agreementAmount")}: ${fmt(agreementAmount)} • {t("amount")}: $ 
          {fmt(totals.totalAll)}
        </p>
        <p className="text-xs text-gray-500">
          {agreementAmount - totals.totalAll <= 0
            ? t("agreementReached")
            : `${t("remaining")}: $${fmt(agreementAmount - totals.totalAll)}`}
        </p>
      </div>

      {/* Expenses list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={t("noExpenses")}
          subtitle={t("tryAdjustingFilters")}
          buttonLabel={t("reset")}
          onAction={resetFilters}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {paged.map((expense) => (
            <div
              key={expense._id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {expense.description}
              </h2>
              <p className="text-green-700 font-medium">
                {t("amount")}: ${fmt(expense.amount)}
              </p>
              <p className="text-gray-600">
                {t("date")}:{" "}
                {toDate(expense.date ?? expense.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {t("category")}:{" "}
                {catIdToName.get(getCatId(expense)) ??
                  expense.category?.name ??
                  expense.category ??
                  "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          {t("showing")} {(filters.pageNumber - 1) * filters.pageSize + 1}{" "}
          {" - "}
          {Math.min(filters.pageNumber * filters.pageSize, filtered.length)}{" "}
          {t("of")} {filtered.length}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={filters.pageNumber <= 1}
            onClick={() =>
              setFilters((p) => ({
                ...p,
                pageNumber: Math.max(1, p.pageNumber - 1),
              }))
            }
          >
            {t("prev")}
          </Button>
          <span className="px-2 self-center">
            {filters.pageNumber} / {pages}
          </span>
          <Button
            variant="outline"
            disabled={filters.pageNumber >= pages}
            onClick={() =>
              setFilters((p) => ({
                ...p,
                pageNumber: Math.min(pages, p.pageNumber + 1),
              }))
            }
          >
            {t("next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
