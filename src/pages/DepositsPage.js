import React, { useState, useEffect, useCallback } from "react";
import depositService from "../services/depositService";
import DepositModal from "../components/DepositModal";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import DESkeleton from "../components/DESkeleton";
import { useLoading } from "../context/LoadingContext";
import CombinedLoader from "../components/CombinedLoader";

const normalizeDeposits = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.deposits)) return d.deposits;
  return [];
};

const DepositsPage = () => {
  const { t } = useTranslation();
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { navigationLoading } = useLoading();

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await depositService.getDeposits();
      const normalizedDeposits = normalizeDeposits(response);
      setDeposits(normalizedDeposits);
      setFilteredDeposits(normalizedDeposits); // Initially set filtered deposits to all deposits
      toast.success(t("depositsFetchedSuccess")); // Success toast when deposits are fetched
    } catch (err) {
      setError(t("failedToFetchDeposits"));
      toast.error(t("failedToFetchDeposits")); // Error toast if fetching fails
      setDeposits([]);
      setFilteredDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handleAddDeposit = () => {
    setCurrentDeposit(null);
    setIsModalOpen(true);
  };

  const handleEditDeposit = (deposit) => {
    setCurrentDeposit(deposit);
    setIsModalOpen(true);
  };

  const handleDeleteDeposit = async (id) => {
    if (window.confirm(t("confirmDeleteDeposit"))) {
      try {
        await depositService.deleteDeposit(id);
        toast.success(t("depositDeletedSuccess")); // Success toast for successful deletion
        await fetchDeposits();
      } catch (err) {
        toast.error(t("failedToDeleteDeposit")); // Error toast for failed deletion
      }
    }
  };

  const handleSaveDeposit = async (depositData) => {
    try {
      if (depositData._id) {
        await depositService.updateDeposit(
          depositData._id,
          depositData.description,
          depositData.amount,
          depositData.date
        );
        toast.success(t("depositUpdatedSuccess")); // Success toast when deposit is updated
      } else {
        await depositService.createDeposit(
          depositData.description,
          depositData.amount,
          depositData.date
        );
        toast.success(t("depositAddedSuccess")); // Success toast for new deposit
      }
      setIsModalOpen(false);
      await fetchDeposits();
    } catch (err) {
      toast.error(t("failedToSaveDeposit")); // Error toast for save failure
    }
  };

  // Filter deposits based on filter criteria
  const filterDeposits = () => {
    let filtered = deposits;

    // Filter by description
    if (descriptionFilter) {
      filtered = filtered.filter((deposit) =>
        deposit.description
          .toLowerCase()
          .includes(descriptionFilter.toLowerCase())
      );
    }

    // Filter by amount range
    if (minAmount) {
      filtered = filtered.filter((deposit) => deposit.amount >= minAmount);
    }
    if (maxAmount) {
      filtered = filtered.filter((deposit) => deposit.amount <= maxAmount);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(
        (deposit) => new Date(deposit.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (deposit) => new Date(deposit.date) <= new Date(endDate)
      );
    }

    setFilteredDeposits(filtered);
  };

  // Apply filter when "Apply Filters" button is clicked
  const handleApplyFilters = () => {
    filterDeposits(); // Trigger filter when the "Apply Filters" button is clicked
  };

  // Reset all filter criteria
  const resetFilters = () => {
    setDescriptionFilter("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setFilteredDeposits(deposits); // Show all deposits when filters are reset
    toast.info(t("filtersReset")); // Optionally show a toast that filters have been reset
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {navigationLoading ? "" : loading && <CombinedLoader />}
      <h1 className="text-3xl font-bold mb-4">{t("deposits")}</h1>

      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <Button onClick={handleAddDeposit} className="min-w-[220px]">
          {t("addDeposit")}
        </Button>
      </div>

      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap gap-4 w-full justify-start">
        {/* Description Filter */}
        <div className="flex-1 min-w-[220px] w-full sm:w-auto">
          <label
            htmlFor="descriptionFilter"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            {t("searchByDescription")}
          </label>
          <input
            id="descriptionFilter"
            type="text"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("searchByDescription")}
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
            aria-label={t("searchByDescription")}
          />
        </div>

        {/* Min Amount */}
        <div className="flex-1 min-w-[220px] w-full sm:w-auto">
          <label
            htmlFor="minAmount"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            {t("minAmount")}
          </label>
          <input
            id="minAmount"
            type="number"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("minAmount")}
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            aria-label={t("minAmount")}
          />
        </div>

        {/* Max Amount */}
        <div className="flex-1 min-w-[220px] w-full sm:w-auto">
          <label
            htmlFor="maxAmount"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            {t("maxAmount")}
          </label>
          <input
            id="maxAmount"
            type="number"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("maxAmount")}
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            aria-label={t("maxAmount")}
          />
        </div>

        {/* Start Date */}
        <div className="flex-1 min-w-[220px] w-full sm:w-auto">
          <label
            htmlFor="startDate"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            {t("startDate")}
          </label>
          <input
            id="startDate"
            type="date"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label={t("startDate")}
          />
        </div>

        {/* End Date */}
        <div className="flex-1 min-w-[220px] w-full sm:w-auto">
          <label
            htmlFor="endDate"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            {t("endDate")}
          </label>
          <input
            id="endDate"
            type="date"
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label={t("endDate")}
          />
        </div>

        {/* Apply Filters Button */}
        <div className="flex flex-wrap gap-3 w-full justify-center sm:justify-start items-end sm:items-end p-1 text-sm">
          <Button
            variant="apply"
            onClick={handleApplyFilters}
            className="w-full sm:w-auto"
          >
            {t("applyFilters")}
          </Button>

          {/* Reset Filters Button */}
          <Button
            variant="destructive"
            className="w-full sm:w-auto p-2 rounded-lg text-white"
            onClick={resetFilters}
            aria-label={t("resetFilters")}
          >
            {t("resetFilters")}
          </Button>
        </div>
      </div>

      {loading ? (
        <DESkeleton DE={"Deposit"} rows={10} />
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
              {filteredDeposits.map((deposit) => (
                <tr key={deposit._id}>
                  <td className="py-2 px-4 border-b">{deposit.description}</td>
                  <td className="py-2 px-4 border-b">
                    {Number(deposit.amount ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(deposit.date).toLocaleDateString()}
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
                      onClick={() => handleDeleteDeposit(deposit._id)}
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
                <td className="py-2 px-4 font-bold">
                  {filteredDeposits
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
        </div>
      )}

      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeposit}
        deposit={currentDeposit}
      />
    </div>
  );
};

export default DepositsPage;
