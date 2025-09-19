import authHeader from './auth-header';
import axiosInstance from '../api/axiosConfig';

const API_URL = '/categories/';

const getCategories = () => {
  return axiosInstance.get(API_URL, { headers: authHeader() });
};

const getCategory = (id) => {
  return axiosInstance.get(API_URL + id, { headers: authHeader() });
};

const createCategory = (name) => {
  return axiosInstance.post(API_URL, { name }, { headers: authHeader() });
};

const updateCategory = (id, name) => {
  return axiosInstance.put(API_URL + id, { name }, { headers: authHeader() });
};

const deleteCategory = (id) => {
  return axiosInstance.delete(API_URL + id, { headers: authHeader() });
};

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;