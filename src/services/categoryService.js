import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://construction-cost-tracker-server-g2.vercel.app/api/categories/';

const getCategories = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getCategory = (id) => {
  return axios.get(API_URL + id, { headers: authHeader() });
};

const createCategory = (name) => {
  return axios.post(API_URL, { name }, { headers: authHeader() });
};

const updateCategory = (id, name) => {
  return axios.put(API_URL + id, { name }, { headers: authHeader() });
};

const deleteCategory = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;