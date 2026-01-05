import api from './api';

export const login = async (credentials) => {
  return api.post('/admin/login', credentials);
};

export const logout = async () => {
  return api.post('/admin/logout');
};

export const getCurrentUser = async () => {
  return api.get('/admin/me');
};