import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const { user } = useAuthStore.getState();
  if (user) {
    config.headers.Authorization = `Bearer ${user.id}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;