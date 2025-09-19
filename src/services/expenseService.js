// services/expenseService.js
import axios from "axios";
import authHeader from "./auth-header";
import axiosInstance from "../api/axiosConfig";

const API_URL = "/expenses"; // <- no trailing slash (we'll add it per call)
// const API_URL = "http://localhost:5000/api/expenses"; // <- no trailing slash (we'll add it per call)

// Build query params, skipping empty/undefined
const buildParams = (paramsObj = {}) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

// ✅ Main list w/ filters
const getExpenses = async (
  keyword,
  category, // id or code; pass 'all' to omit
  startDate,
  endDate,
  sortBy = "createdAt",
  sortOrder,
  pageNumber,
  pageSize = 10
) => {
  console.log(category,startDate,endDate,sortBy,sortOrder,pageNumber,pageSize)

  const qs = buildParams({
    keyword: keyword?.trim(),
    category: category && category !== "all" ? category : undefined,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
  });
  const url = `${API_URL}${qs}`;
  console.log("[expenseService] GET expenses:", url);
  try {
    const res = await  axiosInstance.get(url, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error("[expenseService] Error in getExpenses:", {
      status,
      data,
      url,
    });
    throw error;
  }
};

const getExpense = async (id) => {
  const url = `${API_URL}/${id}`;
  console.log("[expenseService] GET expense by ID:", id, "->", url);
  try {
    const res = await  axiosInstance.get(url, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error(`[expenseService] Error in getExpense(${id}):`, {
      status,
      data,
      url,
    });
    throw error;
  }
};

const createExpense = async (description, amount, category, date ,isContract) => {
  const payload = { description, amount, category, date ,isContract};
  const url = `${API_URL}`;
  console.log("[expenseService] CREATE expense:", payload, "->", url);
  try {
    const res = await  axiosInstance.post(url, payload, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error("[expenseService] Error in createExpense:", {
      status,
      data,
      url,
      payload,
    });
    throw error;
  }
};

const updateExpense = async (id, description, amount, category, date , isContract) => {
  const url = `${API_URL}/${id}`;
  const payload = { description, amount, category, date ,isContract};
  console.log(
    "[expenseService] UPDATE expense:",
    { id, ...payload },
    "->",
    url
  );
  try {
    const res = await  axiosInstance.put(url, payload, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error(`[expenseService] Error in updateExpense(${id}):`, {
      status,
      data,
      url,
      payload,
    });
    throw error;
  }
};

const deleteExpense = async (id) => {
  const url = `${API_URL}/${id}`;
  console.log("[expenseService] DELETE expense ID:", id, "->", url);
  try {
    const res = await  axiosInstance.delete(url, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error(`[expenseService] Error in deleteExpense(${id}):`, {
      status,
      data,
      url,
    });
    throw error;
  }
};

// Optional helper for the /by-date endpoint (kept from your draft)
const getExpensesByDate = async (date, from, to) => {
  let url = `${API_URL}/by-date`;
  const params = new URLSearchParams();
  if (date) params.append("date", date);
  else {
    if (from) params.append("from", from);
    if (to) params.append("to", to);
  }
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  try {
    const res = await  axiosInstance.get(url, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("[getExpensesByDate] error:", err);
    throw err;
  }
};

const expenseService = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByDate,
};

export default expenseService;
