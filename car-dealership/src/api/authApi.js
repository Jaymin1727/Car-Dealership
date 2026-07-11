import apiClient from './apiClient';

export const authApi = {
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (name, email, password) => {
    return apiClient.post('/auth/register', { name, email, password });
  },
};

export default authApi;
