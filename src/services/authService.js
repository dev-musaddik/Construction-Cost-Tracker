import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/users/';

const register = (name, email, password) => {
  return axios.post(API_URL + 'register', {
    name,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + 'login', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const updateProfile = (userData) => {
  return axios.put(API_URL + 'profile', userData, { headers: authHeader() });
};
const scheduleDailyReport = () => {
  return axios.post('http://localhost:5000/api/reports/schedule', {}, { headers: authHeader() });
};
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  scheduleDailyReport,
};

export default authService;

