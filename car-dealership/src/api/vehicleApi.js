import apiClient from './apiClient';

export const vehicleApi = {
  getAllVehicles: async () => {
    return apiClient.get('/vehicles');
  },

  getVehicleById: async (id) => {
    return apiClient.get(`/vehicles/${id}`);
  },

  searchVehicles: async (query) => {
    return apiClient.get(`/vehicles/search?q=${encodeURIComponent(query)}`);
  },

  addVehicle: async (vehicleData) => {
    return apiClient.post('/vehicles', vehicleData);
  },

  updateVehicle: async (id, vehicleData) => {
    return apiClient.put(`/vehicles/${id}`, vehicleData);
  },

  deleteVehicle: async (id) => {
    return apiClient.delete(`/vehicles/${id}`);
  },

  purchaseVehicle: async (id, quantity) => {
    return apiClient.post(`/vehicles/${id}/purchase`, { quantity });
  },

  restockVehicle: async (id, amount) => {
    return apiClient.post(`/vehicles/${id}/restock`, { amount });
  },
};

export default vehicleApi;
