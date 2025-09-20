// useHandleExpenseSave.js
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { setDashboardData } from "../store/dashboardSlice";
import expenseService from "../services/expenseService";

// Custom Hook: useHandleExpenseSave
export const useHandleExpenseSave = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((s) => s.dashboard);

  const handleExpenseSave = async (expenseData, setIsExpenseModalOpen) => {
    const descriptionMinLength = 3;

    // Check for description length
    if (expenseData.description.length < descriptionMinLength) {
      toast.error(
        `Description must be at least ${descriptionMinLength} characters long.`
      );
      return;
    }

    // Optimistic UI update for expenses
    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback

    const isUpdate = !!expenseData._id;
    const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic UI
    const optimisticData = {
      ...expenseData,
      _id: isUpdate ? expenseData._id : tempId,
    };

    const newExpenses = isUpdate
      ? dashboardData.expenses.map((e) =>
          e._id === expenseData._id ? optimisticData : e
        )
      : [optimisticData, ...dashboardData.expenses];

    dispatch(
      setDashboardData({
        ...dashboardData,
        expenses: newExpenses,
      })
    );

    try {
      let response;
      if (isUpdate) {
        response = await expenseService.updateExpense(
          expenseData._id,
          expenseData.description,
          expenseData.amount,
          expenseData.category,
          expenseData.date,
          expenseData.isContract
        );
        toast.success(t("expenseUpdated"));
      } else {
        response = await expenseService.createExpense(
          expenseData.description,
          expenseData.amount,
          expenseData.category,
          expenseData.date,
          expenseData.isContract
        );
        toast.success(t("expenseAdded"));
      }

      if (response?.data) {
        const finalExpenses = isUpdate
          ? dashboardData.expenses.map((e) =>
              e._id === response.data._id ? response.data : e
            )
          : newExpenses.map((e) => (e._id === tempId ? response.data : e));

        dispatch(
          setDashboardData({
            ...dashboardData,
            expenses: finalExpenses,
          })
        );
        setIsExpenseModalOpen(false); // Close modal on success
      }
    } catch (error) {
      toast.error(t("failedToSaveExpense"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    }
  };

  const handleExpenseDelete = async (expenseId) => {
    const isConfirmed = window.confirm(t("confirmDeleteExpense")); // Confirmation dialog

    if (!isConfirmed) return; // If user cancels, exit the function

    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback

    dispatch(
      setDashboardData({
        ...dashboardData,
        expenses: dashboardData.expenses.filter(
          (expense) => expense._id !== expenseId
        ),
      })
    );

    try {
      await expenseService.deleteExpense(expenseId);
      toast.success(t("expenseDeleted"));
    } catch (error) {
      toast.error(t("failedToDeleteExpense"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    }
  };

  return { handleExpenseSave, handleExpenseDelete };
};
