import React, { useEffect, useMemo, useState } from "react";
import {  useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import CombinedLoader from "../components/Loading/CombinedLoader";
import CategoriesSkeleton from "../components/Skeleton/CategoriesSkeleton";
import CategoryModal from "../components/Category/CategoryModal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import EmptyState from "../components/EmptyState";
import { useHandleCategorySave } from "../hooks/useHandleCategorySave";

const toDate = (x) => new Date(x ?? 0);

export default function CategoriesPage() {
  const { t } = useTranslation();

  const { dashboardData, loading, error } = useSelector((s) => s.dashboard);

  // local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { handleCategorySave, handleCategoryDelete,categoryLoading } = useHandleCategorySave();

  // filters + paging + sort
  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "createdAt", // 'name' | 'createdAt'
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 10,
  });

  // A local, reorderable copy (never mutate Redux arrays)
  const baseCategories = useMemo(() => {
    const list = dashboardData?.categories || dashboardData?.category || [];
    return Array.isArray(list) ? list : [];
  }, [dashboardData]);

  const [categoriesUI, setCategoriesUI] = useState([]);
  useEffect(() => {
    setCategoriesUI(baseCategories);
  }, [baseCategories]);

  // Derived list (filter + sort + page) from categoriesUI
  const { filtered, paged, pages } = useMemo(() => {
    let list = Array.isArray(categoriesUI) ? categoriesUI : [];

    const kw = filters.keyword.trim().toLowerCase();
    if (kw)
      list = list.filter((c) => (c.name ?? "").toLowerCase().includes(kw));

    if (filters.sortBy) {
      const cmp = (a, b) => {
        const key = filters.sortBy;
        let A;
        let B;
        if (key === "name") {
          A = (a.name ?? "").toLowerCase();
          B = (b.name ?? "").toLowerCase();
        } else {
          A = toDate(a.createdAt).getTime();
          B = toDate(b.createdAt).getTime();
        }
        if (A < B) return filters.sortOrder === "asc" ? -1 : 1;
        if (A > B) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      };
      list = [...list].sort(cmp);
    }

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / filters.pageSize));
    const current = Math.min(filters.pageNumber, pages);
    const start = (current - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    const paged = list.slice(start, end);

    return { filtered: list, paged, pages };
  }, [categoriesUI, filters]);

  // Handle DnD reorder on the CURRENT PAGE only (does not mutate Redux arrays)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const currentPageStart = (filters.pageNumber - 1) * filters.pageSize;
    const fromIdx = currentPageStart + result.source.index;
    const toIdx = currentPageStart + result.destination.index;

    setCategoriesUI((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    // TODO: call an API to persist order if your backend supports it
  };

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
      sortBy: "createdAt",
      sortOrder: "desc",
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };
  const handleEditCategory = (c) => {
    setCurrentCategory(c);
    setIsModalOpen(true);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {loading && <CombinedLoader />}

      <h1 className="text-3xl font-bold mb-4">{t("categories")}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm font-medium text-gray-700">
            {t("search")}
          </label>
          <Input
            placeholder={t("searchByName")}
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
          />
        </div>
        <div className="w-48">
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
              <SelectItem value="createdAt">{t("createdAt")}</SelectItem>
              <SelectItem value="name">{t("name")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
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
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3">
          <Button loading={categoryLoading} circle={categoryLoading} variant="destructive" onClick={resetFilters}>
            {t("reset")}
          </Button>
          <Button loading={categoryLoading} circle={categoryLoading} onClick={handleAddCategory}>{t("addCategory") }</Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <>
          <CombinedLoader />
          <CategoriesSkeleton Count={5} />
        </>
      ) : baseCategories.length === 0 ? (
        <EmptyState
          title={t("noCategoriesFound")}
          subtitle={t("startAddingCategories")}
          buttonLabel={t("addCategory")}
          onAction={handleAddCategory}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("noResults")}
          subtitle={t("tryAdjustingFilters")}
          buttonLabel={t("reset")}
          onAction={resetFilters}
        />
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
                      <th className="py-2 px-4 border-b text-left">
                        {t("name")}
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        {t("createdAt")}
                      </th>
                      <th className="py-2 px-4 border-b text-left">ID</th>
                      <th className="py-2 px-4 border-b text-left">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((category, index) => (
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
                            <td className="py-2 px-4 border-b">
                              {toDate(category.createdAt).toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border-b font-mono text-xs">
                              {category._id}
                            </td>
                            <td className="py-2 px-4 border-b">
                              <div className="flex gap-2">
                                <Button
                                loading={categoryLoading} circle={categoryLoading}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  {t("edit")}
                                </Button>
                                <Button
                                loading={categoryLoading} circle={categoryLoading}
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleCategoryDelete(category._id)
                                  }
                                >
                                  {t("delete")}
                                </Button>
                              </div>
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

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {t("showing")}: {(filters.pageNumber - 1) * filters.pageSize + 1}
          {" - "}
          {Math.min(
            filters.pageNumber * filters.pageSize,
            filtered.length
          )}{" "}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(categoryData) => handleCategorySave(categoryData, setIsModalOpen)}
        category={currentCategory}
        loading={categoryLoading}
      />
    </div>
  );
}