import axios from 'axios';
import { API_CONFIG } from '../constants/config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

export const getUsers = async (username) => {
  try {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.USERS}?username=${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.EXPENSES);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const getExpense = async (id) => {
  try {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.EXPENSES, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};