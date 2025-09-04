import React, { useState, useEffect, useCallback } from "react";
import depositService from "../services/depositService";
import DepositModal from "../components/DepositModal";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import DESkeleton from "../components/DESkeleton";

const normalizeDeposits = (res) => {
  // Accept either { data: [ ... ] } or { data: { deposits: [ ... ] } }
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.deposits)) return d.deposits;
  return []; // fallback to empty array
};

const DepositsPage = () => {
  const { t } = useTranslation();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await depositService.getDeposits();
      setDeposits(normalizeDeposits(response));
    } catch (err) {
      setError(t("failedToFetchDeposits"));
      toast.error(t("failedToFetchDeposits"));
      setDeposits([]); // keep UI consistent
    } finally {
      setLoading(false);
    }
    console.log(loading)
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
        toast.success(t("depositDeletedSuccess"));
        await fetchDeposits(); // always refetch using the same normalizer
      } catch (err) {
        toast.error(t("failedToDeleteDeposit"));
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
        toast.success(t("depositUpdatedSuccess"));
      } else {
        await depositService.createDeposit(
          depositData.description,
          depositData.amount,
          depositData.date
        );
        toast.success(t("depositAddedSuccess"));
      }
      setIsModalOpen(false);
      await fetchDeposits(); // consistent refresh
    } catch (err) {
      toast.error(t("failedToSaveDeposit"));
    }
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <h1 className="text-3xl font-bold mb-4">{t("deposits")}</h1>
  //       <div className="flex flex-wrap gap-4 mb-4 items-end">
  //         <Skeleton className="h-10 w-[200px]" />
  //       </div>
  //       <div className="overflow-x-auto">
  //         <Skeleton className="h-[400px] w-full" />
  //       </div>
  //     </div>
  //   );
  // }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t("deposits")}</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <Button onClick={handleAddDeposit} className="min-w-[120px]">
          {t("addDeposit")}
        </Button>
      </div>
      {loading ? (
        <DESkeleton DE={"Deposit"} rows={10} />
      // ) : deposits.length === 0 ? (
        // <p>{t("noDepositsFound")}</p>
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
              {deposits.map((deposit) => (
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
            {/* Stat line at the bottom */}
            <tfoot>
              <tr
                className="border-t-2 border-gray-500
"
              >
                <td className="py-2 px-4 font-bold">{t("Total")}</td>
                <td className="py-2 px-4 font-bold">
                  {deposits
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
