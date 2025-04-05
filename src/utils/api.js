// src/utils/api.js
import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = 'http://localhost:8000';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper functions for common API operations
export const fetchFromAPI = async (endpoint) => {
  try {
    const response = await api.get(`/api${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const postToAPI = async (endpoint, data) => {
  try {
    const response = await api.post(`/api${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

export const putToAPI = async (endpoint, data) => {
  try {
    const response = await api.put(`/api${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteFromAPI = async (endpoint) => {
  try {
    const response = await api.delete(`/api${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${endpoint}:`, error);
    throw error;
  }
};

export default api;