import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import categoryService from "../services/categoryService";
import CategoryModal from "../components/CategoryModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CategoriesSkeleton from "../components/CategoriesSkeleton";
import DataLoader from "../components/DataLoader";
import { useLoading } from "../context/LoadingContext";
import CombinedLoader from "../components/CombinedLoader";

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const { navigationLoading } = useLoading();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError(t("failedToFetchCategories"));
      setLoading(false);
      toast.error(t("failedToFetchCategories"));
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm(t("confirmDeleteCategory"))) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
        toast.success(t("categoryDeletedSuccess"));
      } catch (err) {
        setError(t("failedToDeleteCategory"));
        toast.error(t("failedToDeleteCategory"));
      }
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (categoryData._id) {
        await categoryService.updateCategory(
          categoryData._id,
          categoryData.name
        );
        toast.success(t("categoryUpdatedSuccess"));
      } else {
        await categoryService.createCategory(categoryData.name);
        toast.success(t("categoryAddedSuccess"));
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(t("failedToSaveCategory"));
      toast.error(t("failedToSaveCategory"));
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);
    // Optionally, send updated order to backend if persistence is needed
    // For now, it's just a visual reorder
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // if(loading){
  //  return <CategoriesSkeleton Count={5} />
  // }
  
  return (
    <div className="container mx-auto p-4">
    {(!navigationLoading && loading ) ?
    (
    <>
      {/* <DataLoader /> */}
      <CombinedLoader/>
      <CategoriesSkeleton Count={5} />
    </>
  )
  
  :
  
   <>
      <h1 className="text-3xl font-bold mb-4">{t("categories")}</h1>
      <div className="w-full flex justify-end">
      <button
        onClick={handleAddCategory}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center"
      >
        {t("addCategory")}
      </button>

      </div>
      {categories.length === 0 ? (
        <p>{t("noCategoriesFound")}</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                className="overflow-x-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">{t("name")}</th>
                      <th className="py-2 px-4 border-b ">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <Draggable
                        key={category._id}
                        draggableId={category._id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td className="py-2 px-4 border-b">
                              {category.name}
                            </td>
                            <td className="py-2 px-6 border-b flex justify-center items-center">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                              >
                                {t("edit")}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(category._id)
                                }
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              >
                                {t("delete")}
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      </>
  
  }
     

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={currentCategory}
      />
    </div>
  );
};

export default CategoriesPage;
