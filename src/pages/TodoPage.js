import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CombinedLoader from "../components/Loading/CombinedLoader";
import todoService from "../services/todoService";
import categoryService from "../services/categoryService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function TodoPage() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await todoService.getTodos();
      setTodos(response.data);
    } catch (error) {
      toast.error(t("failedToFetchTodos"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error(t("failedToFetchCategories"));
    }
  };

  const handleCreateTodo = async () => {
    if (!description) {
      toast.error(t("descriptionIsRequired"));
      return;
    }
    if (!selectedCategory) {
      toast.error(t("categoryIsRequired"));
      return;
    }
    setLoading(true);
    try {
      await todoService.createTodo(description, selectedCategory);
      toast.success(t("todoCreatedSuccess"));
      setDescription("");
      setSelectedCategory("");
      fetchTodos();
    } catch (error) {
      toast.error(t("failedToCreateTodo"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id, completed) => {
    setLoading(true);
    try {
      await todoService.updateTodo(id, undefined, undefined, undefined, completed);
      toast.success(t("todoUpdatedSuccess"));
      fetchTodos();
    } catch (error) {
      toast.error(t("failedToUpdateTodo"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    setLoading(true);
    try {
      await todoService.deleteTodo(id);
      toast.success(t("todoDeletedSuccess"));
      fetchTodos();
    } catch (error) {
      toast.error(t("failedToDeleteTodo"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <CombinedLoader />}

      <h1 className="text-3xl font-bold mb-4">{t("todos")}</h1>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder={t("newTodo")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("selectACategory")} />
          </SelectTrigger>
          <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCreateTodo}>{t("addTodo")}</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">{t("completed")}</th>
              <th className="py-2 px-4 border-b text-left">{t("description")}</th>
              <th className="py-2 px-4 border-b text-left">{t("category")}</th>
              <th className="py-2 px-4 border-b text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => handleUpdateTodo(todo._id, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-4 border-b">{todo.description}</td>
                <td className="py-2 px-4 border-b">{todo.category?.name}</td>
                <td className="py-2 px-4 border-b">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    {t("delete")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}