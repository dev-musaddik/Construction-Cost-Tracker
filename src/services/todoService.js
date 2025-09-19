import axios from 'axios';
import authHeader from './auth-header';
import axiosInstance from '../api/axiosConfig';

const API_URL = '/todos/';
// const API_URL = 'http://localhost:5000/api/todos/';

const getTodos = () => {
  return axiosInstance.get(API_URL, { headers: authHeader() });
};

const getTodo = (id) => {
  return axiosInstance.get(API_URL + id, { headers: authHeader() });
};

const createTodo = (description, category, dueDate) => {
  return axiosInstance.post(API_URL, { description, category, dueDate }, { headers: authHeader() });
};

const updateTodo = (id, description, category, dueDate, completed) => {
  return axiosInstance.put(API_URL + id, { description, category, dueDate, completed }, { headers: authHeader() });
};

const deleteTodo = (id) => {
  return axiosInstance.delete(API_URL + id, { headers: authHeader() });
};

const todoService = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};

export default todoService;