import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { setDashboardData } from "../store/dashboardSlice";
import depositService from "../services/depositService";

// Custom Hook: useHandleDepositSave
export const useHandleDepositSave = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((s) => s.dashboard);

  const handleDepositSave = async (depositData, setIsDepositModalOpen) => {
    const descriptionMinLength = 3;

    // Check for description length
    if (depositData.description.length < descriptionMinLength) {
      toast.error(
        `Description must be at least ${descriptionMinLength} characters long.`
      );
      return;
    }

    // Optimistic UI update for deposits
    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback
    
    const isUpdate = !!depositData._id;
    const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
    const optimisticData = { ...depositData, _id: isUpdate ? depositData._id : tempId };

    const newDeposits = isUpdate
      ? dashboardData.deposits.map((d) =>
          d._id === depositData._id ? optimisticData : d
        )
      : [optimisticData, ...dashboardData.deposits];

    dispatch(
      setDashboardData({
        ...dashboardData,
        deposits: newDeposits,
      })
    );

    try {
      let response;
      if (isUpdate) {
        const userConfirmed = window.confirm(t("confirmUpdateDeposit")); // Confirm before updating
        if (!userConfirmed) {
          return; // Abort if user cancels
        }
        response = await depositService.updateDeposit(
          depositData._id,
          depositData.description,
          depositData.amount,
          depositData.date
        );
        toast.success(t("depositUpdated"));
      } else {
        response = await depositService.createDeposit(
          depositData.description,
          depositData.amount,
          depositData.date
        );
        toast.success(t("depositAdded"));
      }

      if (response?.data) {
        const finalDeposits = isUpdate
          ? dashboardData.deposits.map((d) =>
              d._id === response.data._id ? response.data : d
            )
          : newDeposits.map((d) => (d._id === tempId ? response.data : d));

        dispatch(
          setDashboardData({
            ...dashboardData,
            deposits: finalDeposits,
          })
        );
        setIsDepositModalOpen(false); // Close modal on success
      }
    } catch (error) {
      toast.error(t("failedToSaveDeposit"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    }
  };

  const handleDepositDelete = async (depositId) => {
    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback

    // Ask for confirmation before deleting
    const userConfirmed = window.confirm(t("confirmDeleteDeposit")); // Confirm before deleting
    if (!userConfirmed) {
      return; // Abort if user cancels
    }

    dispatch(
      setDashboardData({
        ...dashboardData,
        deposits: dashboardData.deposits.filter(
          (deposit) => deposit._id !== depositId
        ),
      })
    );

    try {
      await depositService.deleteDeposit(depositId);
      toast.success(t("depositDeleted"));
    } catch (error) {
      toast.error(t("failedToDeleteDeposit"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    }
  };

  return { handleDepositSave, handleDepositDelete };
};
