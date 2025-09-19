import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog.jsx";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CombinedLoader from "../Loading/CombinedLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import categoryService from "../../services/categoryService";
import { Button } from "../ui/button.jsx";
import DateDisplay from "../DateDisplay.js";
// import { useDispatch } from "react-redux";

const ExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(""); // holds category code (preferred) or _id fallback
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isContract, setIsContract] = useState(false); // New state for isContract
  const categoryValueOf = (cat) => (cat?.code ? cat.code : cat?._id);

  // Populate fields when opening (EDIT vs CREATE)
  useEffect(() => {
    if (expense) {
      console.log(expense);
      setDescription(expense.description ?? "");
      setAmount(String(expense.amount ?? ""));
      const ymd = expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      setDate(ymd);
      // ✅ FIX: use expense.category (singular) and prefer code
      setCategory(expense?.category ?? expense.category?._id ?? "");
      setIsContract(expense.isContract ?? false); // Populate isContract from expense
    } else {
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory("");
      setIsContract(false); // Default to false on create
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
        // if (!category && list.length > 0) setCategory(categoryValueOf(list[0]));
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

    // ✅ Debug: Check category before checking its ObjectId format
    console.log("Selected category before check:", selected,category);

    // ✅ Always send _id to the API, not code
    if (/^[0-9a-fA-F]{24}$/.test(selected)) {
      // already an ObjectId, keep it
      console.log("Selected is already an ObjectId:", selected);
    } else {
      // If user picked a code, find its _id
      const found = categories.find((c) => c.code === selected);
      console.log("Found category by code:", found);

      if (found?._id) {
        selected = found._id;
        console.log("Updated selected category with _id:", selected);
      } else {
        console.log("No category found for the selected code.");
      }
    }

    const payload = {
      _id: expense?._id,
      description: String(description || "").trim(),
      amount: Number(amount),
      date,
      category: selected,
      isContract,
    };

    // ✅ Debug: Check payload before validation
    console.log("Payload before validation:", payload);

    // ✅ Basic validations
    if (!payload.description) {
      console.log("Validation error: Missing description");
      return toast.error(t("missingDescription"));
    }

    // ✅ Check description length (at least 3 chars)
    if (payload.description.length < 3) {
      console.log("Validation error: Description too short");
      return toast.error(t("descriptionMinLength")); // e.g. "Description must be at least 3 characters"
    }

    if (
      !payload.amount ||
      Number.isNaN(payload.amount) ||
      payload.amount <= 0
    ) {
      console.log("Validation error: Invalid amount", payload.amount);
      return toast.error(t("invalidAmount"));
    }

    if (!payload.date || payload.date.length !== 10) {
      console.log("Validation error: Invalid date format", payload.date);
      return toast.error(t("invalidDate"));
    }

    if (!payload.category) {
      console.log("Validation error: Missing category");
      return toast.error(t("missingCategory"));
    }

    try {
      setLoading(true); // ✅ Start loading
      console.log("Saving data with payload:", payload);

      await onSave(payload);

      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error during save operation:", error);
      toast.error(error.message || error);
    } finally {
      setLoading(false); // ✅ Stop loading
      setDescription("");
      setAmount("");
      setCategory("");
      setIsContract(false);
      console.log("Form reset after save operation");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* {loading && <DataLoader />} */}
        {/* {loading && <CombinedLoader />} */}
        <DialogHeader>
          <DialogTitle>
            {expense ? t("editExpense") : t("addExpense")}
            {/* Highlight date and show 'today', 'yesterday', 'tomorrow' */}
            {/* Date Display */}
            <DateDisplay date={date} />
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
            <SelectContent className="bg-transparent backdrop-blur-lg border border-yellow-200  rounded-md shadow-lg">
              {categories.map((cat) => (
                <SelectItem
                  key={cat._id || cat.code}
                  value={categoryValueOf(cat)}
                  className="hover:bg-blue-500 hover:text-white"
                >
                  {cat.name}
                  {cat.code ? ` (${cat.code})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* New checkbox for isContract */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isContract"
              name="isContract"
              checked={isContract}
              onChange={() => setIsContract((prev) => !prev)} // Toggle the value
            />
            <label htmlFor="isContract" className="ml-2">
              {t("isContract")}
            </label>
          </div>
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
