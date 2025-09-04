import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://construction-cost-tracker-server-g2.vercel.app/api/users/';

const getUsers = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getUserById = (id) => {
  return axios.get(API_URL + id, { headers: authHeader() });
};

const updateUser = (id, userData) => {
  return axios.put(API_URL + id, userData, { headers: authHeader() });
};

const deleteUser = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;