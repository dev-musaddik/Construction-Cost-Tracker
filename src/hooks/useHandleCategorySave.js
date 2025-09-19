import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { setDashboardData } from "../store/dashboardSlice";
import categoryService from "../services/categoryService";
import { useState } from "react";

// Custom Hook: useHandleCategorySave
export const useHandleCategorySave = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((s) => s.dashboard);

  // State to track loading status
  const [ categoryLoading, setCategoryLoading] = useState(false);

  const handleCategorySave = async (categoryData, setIsCategoryModalOpen) => {
    // Confirmation before save
    const confirmMessage = categoryData._id
      ? t("confirmUpdateCategory")
      : t("confirmAddCategory");

    const userConfirmed = window.confirm(confirmMessage);
    if (!userConfirmed) {
      return; // Exit if user cancels
    }

    setCategoryLoading(true); // Start categoryLoading

    // Optimistic UI update for categories
    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback

    const isUpdate = !!categoryData._id;
    const tempId = `temp-${Date.now()}`;
    const optimisticData = {
      ...categoryData,
      _id: isUpdate ? categoryData._id : tempId,
    };

    const newCategories = isUpdate
      ? dashboardData.categories.map((c) =>
          c._id === categoryData._id ? optimisticData : c
        )
      : [optimisticData, ...dashboardData.categories];

    dispatch(
      setDashboardData({
        ...dashboardData,
        categories: newCategories,
      })
    );

    try {
      let response;
      if (isUpdate) {
        response = await categoryService.updateCategory(
          categoryData._id,
          categoryData.name
        );
        toast.success(t("categoryUpdated"));
      } else {
        response = await categoryService.createCategory(categoryData.name);
        toast.success(t("categoryAdded"));
      }

      if (response?.data) {
        const finalCategories = isUpdate
          ? dashboardData.categories.map((c) =>
              c._id === response.data._id ? response.data : c
            )
          : newCategories.map((c) => (c._id === tempId ? response.data : c));

        dispatch(
          setDashboardData({
            ...dashboardData,
            categories: finalCategories,
          })
        );
        setIsCategoryModalOpen(false); // Close modal on success
      }
    } catch (error) {
      toast.error(t("failedToSaveCategory"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    } finally {
      setCategoryLoading(false); // Stop categoryLoading after the operation
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    // Confirmation before delete
    const userConfirmed = window.confirm(t("confirmDeleteCategory"));
    if (!userConfirmed) {
      return; // Exit if user cancels
    }

    setCategoryLoading(true); // Start categoryLoading

    const originalDashboardData = { ...dashboardData }; // Save original dashboard data for rollback

    dispatch(
      setDashboardData({
        ...dashboardData,
        categories: dashboardData.categories.filter(
          (category) => category._id !== categoryId
        ),
      })
    );

    try {
      await categoryService.deleteCategory(categoryId);
      toast.success(t("categoryDeleted"));
    } catch (error) {
      toast.error(t("failedToDeleteCategory"));
      dispatch(setDashboardData(originalDashboardData)); // Rollback on failure
    } finally {
      setCategoryLoading(false); // Stop categoryLoading after the operation
    }
  };

  return { handleCategorySave, handleCategoryDelete, categoryLoading };
};
