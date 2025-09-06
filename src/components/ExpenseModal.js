import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import categoryService from "../services/categoryService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DataLoader from "./DataLoader";

const ExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(""); // holds category code (preferred) or _id fallback
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryValueOf = (cat) => (cat?.code ? cat.code : cat?._id);

  // Populate fields when opening (EDIT vs CREATE)
  useEffect(() => {
    if (expense) {
      setDescription(expense.description ?? "");
      setAmount(String(expense.amount ?? ""));
      const ymd = expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      setDate(ymd);
      // ✅ FIX: use expense.category (singular) and prefer code
      setCategory(expense.category?.code ?? expense.category?._id ?? "");
    } else {
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory("");
    }
  }, [expense]);

  // Load categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const list = Array.isArray(response?.data) ? response.data : [];
        setCategories(list);
        // Default selection on create: first category
        if (!category && list.length > 0) setCategory(categoryValueOf(list[0]));
      } catch (error) {
        console.error(t("failedToFetchCategoriesModal"), error);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (loading) return; // ✅ Prevent multiple clicks

    let selected = category;

    // If user somehow selected an ObjectId, map it to its code
    if (/^[0-9a-fA-F]{24}$/.test(selected)) {
      const found = categories.find((c) => c._id === selected);
      if (found?.code) selected = found.code;
    }

    const payload = {
      _id: expense?._id,
      description: String(description || "").trim(),
      amount: Number(amount),
      date,
      category: selected,
    };

    // ✅ Basic validations
    if (!payload.description) return toast.error(t("missingDescription"));

    // ✅ Check description length (at least 3 chars)
    if (payload.description.length < 3) {
      return toast.error(t("descriptionMinLength")); // e.g. "Description must be at least 3 characters"
    }

    if (!payload.amount || Number.isNaN(payload.amount) || payload.amount <= 0)
      return toast.error(t("invalidAmount"));

    if (!payload.date || payload.date.length !== 10)
      return toast.error(t("invalidDate"));

    if (!payload.category) return toast.error(t("missingCategory"));

    try {
      setLoading(true); // ✅ Start loading

      await onSave(payload);
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {loading && <DataLoader />}
        <DialogHeader>
          <DialogTitle>
            {expense ? t("editExpense") : t("addExpense")}
          </DialogTitle>
          {/* a11y: description to avoid console warning */}
          <DialogDescription>{t("expenseModalDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder={t("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            placeholder={t("amount")}
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectACategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem
                  key={cat._id || cat.code}
                  value={categoryValueOf(cat)}
                >
                  {cat.name}
                  {cat.code ? ` (${cat.code})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            loading={loading}
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button
            loading={loading}
            circle={loading}
            text={t("save")}
            onClick={handleSave}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
