import { api } from './api';

class ApiService {
  async get(url: string, config?: any) {
    try {
      const response = await api.get(url, config);
      return response;
    } catch (error) {
      console.error(`Error in GET ${url}:`, error);
      throw error;
    }
  }

  async post(url: string, data?: any, config?: any) {
    try {
      const response = await api.post(url, data, config);
      return response;
    } catch (error) {
      console.error(`Error in POST ${url}:`, error);
      throw error;
    }
  }

  async put(url: string, data?: any, config?: any) {
    try {
      const response = await api.put(url, data, config);
      return response;
    } catch (error) {
      console.error(`Error in PUT ${url}:`, error);
      throw error;
    }
  }

  async delete(url: string, config?: any) {
    try {
      const response = await api.delete(url, config);
      return response;
    } catch (error) {
      console.error(`Error in DELETE ${url}:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;