import authHeader from './auth-header';
import { toast } from 'react-toastify'; // Import toastify
import axiosInstance from '../api/axiosConfig';

const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/users/register', { name, email, password });
    return response;
  } catch (error) {
    if (!error.response) {
      // Handle network error (e.g., no internet connection)
      toast.error('No internet connection. Please check your network.');
    } else {
      toast.error('An error occurred during registration.');
    }
    throw error; // Optionally re-throw the error if needed
  }
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    if (!error.response) {
      // Handle network error (e.g., no internet connection)
      toast.error('No internet connection. Please check your network.');
    } else {
      toast.error('An error occurred during login.');
    }
    throw error; // Optionally re-throw the error if needed
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put('/users/profile', userData, { headers: authHeader() });
    return response;
  } catch (error) {
    if (!error.response) {
      // Handle network error (e.g., no internet connection)
      toast.error('No internet connection. Please check your network.');
    } else {
      toast.error('An error occurred while updating your profile.');
    }
    throw error; // Optionally re-throw the error if needed
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
};

export default authService;
