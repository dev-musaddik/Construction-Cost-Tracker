import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://construction-cost-tracker-server-g2.vercel.app/api',  // Set your base URL here
  baseURL: (import.meta?.env?.VITE_API_URL || 'http://localhost:5000') + '/api',
});

export default axiosInstance;
