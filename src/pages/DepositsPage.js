import React, {  useMemo, useState } from "react";
import {  useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import CombinedLoader from "../components/Loading/CombinedLoader";
import DESkeleton from "../components/Skeleton/DESkeleton";
import EmptyState from "../components/EmptyState";
import DepositModal from "../components/Deposit/DepositModal";
import DateDisplay from "../components/DateDisplay";
import Pagination from "../components/Pagination";
import StatCard from "../components/StatCard";
import { fmtMoney } from "../lib/utils";
import { useHandleDepositSave } from "../hooks/useHandleDepositSave";

const toDate = (x) => new Date(x ?? 0);

export default function DepositsPage() {
  const { t } = useTranslation();

  // Pull from Redux (dashboard is the source of truth, deposit slice is a fallback)
  const { dashboardData, loading, error,allDataBalance } = useSelector((s) => s.dashboard);
  const depositSlice = useSelector((s) => s.deposit?.deposits);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const { handleDepositSave, handleDepositDelete } = useHandleDepositSave();

  const [filters, setFilters] = useState({
    keyword: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "date", // 'date' | 'createdAt' | 'amount'
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 10, // ✅ page size already present
  });

  // base deposits (read-only data from Redux)
  const base = useMemo(() => {
    const fromDash = dashboardData?.deposits;
    if (Array.isArray(fromDash) && fromDash.length) return fromDash;
    return Array.isArray(depositSlice) ? depositSlice : [];
  }, [dashboardData, depositSlice]);

  // derived: filtered + sorted + paged (no in-place mutations)
  const { filtered, paged, pages, pageTotal } = useMemo(() => {
    let list = Array.isArray(base) ? base : [];

    const kw = filters.keyword.trim().toLowerCase();
    if (kw)
      list = list.filter((d) =>
        (d.description ?? "").toLowerCase().includes(kw)
      );

    if (filters.minAmount !== "") {
      const min = Number(filters.minAmount);
      list = list.filter((d) => Number(d.amount ?? 0) >= min);
    }
    if (filters.maxAmount !== "") {
      const max = Number(filters.maxAmount);
      list = list.filter((d) => Number(d.amount ?? 0) <= max);
    }

    if (filters.startDate && filters.endDate) {
      const s = new Date(filters.startDate);
      const e = new Date(filters.endDate);
      e.setHours(23, 59, 59, 999); // inclusive end
      list = list.filter((row) => {
        const d = toDate(row.date ?? row.createdAt);
        return d >= s && d <= e;
      });
    } else if (filters.startDate) {
      const s = new Date(filters.startDate);
      list = list.filter((row) => toDate(row.date ?? row.createdAt) >= s);
    } else if (filters.endDate) {
      const e = new Date(filters.endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((row) => toDate(row.date ?? row.createdAt) <= e);
    }

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

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / filters.pageSize)); // Ensure at least 1 page
    const current = Math.min(filters.pageNumber, pages);
    const start = (current - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    const paged = list.slice(start, end);

    const pageTotal = paged.reduce((s, d) => s + Number(d.amount || 0), 0);
    return { filtered: list, paged, pages, pageTotal };
  }, [base, filters]);

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
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      sortBy: "date",
      sortOrder: "desc",
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const handleAddDeposit = () => {
    setCurrentDeposit(null);
    setIsModalOpen(true);
  };

  const handleEditDeposit = (deposit) => {
    setCurrentDeposit(deposit);
    setIsModalOpen(true);
  };

  // Memoize total deposits and expenses calculations
    const totalDepositsForTotalBalance = useMemo(() => {
      return (
        dashboardData?.deposits?.reduce(
          (sum, deposit) => sum + deposit.amount,
          0
        ) || 0
      );
    }, [dashboardData]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {loading && <CombinedLoader />}
      <h1 className="text-3xl font-bold mb-4">{t("deposits")}</h1>

          {/* Overview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{t("total_deposit")}</h2>
            <StatCard value={fmtMoney(totalDepositsForTotalBalance)} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{t("current_page_deposit")}</h2>
            <StatCard value={fmtMoney(pageTotal)} />
          </div>
        </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <Button onClick={handleAddDeposit} className="min-w-[220px]">
          {t("addDeposit")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
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
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700">
            {t("minAmount")}
          </label>
          <Input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange("minAmount", e.target.value)}
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700">
            {t("maxAmount")}
          </label>
          <Input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
          />
        </div>
        <div className="w-44">
          <label className="block text-sm font-medium text-gray-700">
            {t("startDate")}
          </label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </div>
        <div className="w-44">
          <label className="block text-sm font-medium text-gray-700">
            {t("endDate")}
          </label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
        <div className="w-44">
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
        <div className="w-44">
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
        {/* ✅ Page Size Filter */}
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700">
            {t("pageSize")}
          </label>
          <Select
            value={String(filters.pageSize)}
            onValueChange={(v) => handleFilterChange("pageSize", Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
              {[5, 10, 20, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3">
          <Button variant="outline" onClick={resetFilters}>
            {t("reset")}
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <DESkeleton DE={"Deposit"} rows={10} />
      ) : base.length === 0 ? (
        <EmptyState
          title={t("noDepositsFound")}
          subtitle={t("startAddingDeposits")}
          buttonLabel={t("addDeposit")}
          onAction={handleAddDeposit}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("noResults")}
          subtitle={t("tryAdjustingFilters")}
          buttonLabel={t("reset")}
          onAction={resetFilters}
        />
      ) : (
        <div className="overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat p-6 font-[Patrick Hand,Comic Sans MS,cursive]">
          <table className="min-w-full border border-gray-200 bg-transparent">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">
                  {t("description")}
                </th>
                <th className="py-2 px-4 border-b text-left">{t("amount")}</th>
                <th className="py-2 px-4 border-b text-left">{t("date")}</th>
                <th className="py-2 px-4 border-b text-left">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((deposit) => (
                <tr key={deposit._id}>
                  <td className="py-2 px-4 border-b">{deposit.description}</td>
                  <td className="py-2 px-4 border-b">
                    {Number(deposit.amount ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <DateDisplay date={deposit.date ?? deposit.createdAt} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDeposit(deposit)}
                      className="mr-2"
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDepositDelete(deposit._id)}
                    >
                      {t("delete")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-500">
                <td className="py-2 px-4 font-bold">{t("Total")}</td>
                <td className="py-2 px-4 font-bold">{pageTotal.toFixed(2)}</td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {/* Pagination */}
      <Pagination pages={pages} currentPage={filters.pageNumber} onPageChange={(p) => handleFilterChange("pageNumber", p)} />

      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(depositData) => handleDepositSave(depositData, setIsModalOpen)}
        deposit={currentDeposit}
      />
    </div>
  );
}