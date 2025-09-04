import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/users/';

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