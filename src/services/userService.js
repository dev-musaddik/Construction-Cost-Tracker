import axios from 'axios';
import authHeader from './auth-header';
import axiosInstance from '../api/axiosConfig';

const API_URL = '/users/';

const getUsers = () => {
  return axiosInstance.get(API_URL, { headers: authHeader() });
};

const getUserById = (id) => {
  return axiosInstance.get(API_URL + id, { headers: authHeader() });
};

const updateUser = (id, userData) => {
  return axiosInstance.put(API_URL + id, userData, { headers: authHeader() });
};

const deleteUser = (id) => {
  return axiosInstance.delete(API_URL + id, { headers: authHeader() });
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;