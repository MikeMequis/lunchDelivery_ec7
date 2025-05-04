import api from './api';

class AuthorizationService {
  // Create a new lunch authorization
  async createAuthorization(data) {
    try {
      const response = await api.post('/authorizations', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get authorizations by date
  async getAuthorizationsByDate(date) {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await api.get(`/authorizations/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get authorization by ID
  async getAuthorizationById(id) {
    try {
      const response = await api.get(`/authorizations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update authorization
  async updateAuthorization(id, data) {
    try {
      const response = await api.put(`/authorizations/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete authorization
  async deleteAuthorization(id) {
    try {
      const response = await api.delete(`/authorizations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling helper
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response.data.error || 'Erro ao processar solicitação';
    } else if (error.request) {
      // The request was made but no response was received
      return 'Sem resposta do servidor. Verifique sua conexão.';
    } else {
      // Something happened in setting up the request that triggered an Error
      return 'Erro ao realizar solicitação.';
    }
  }
}

export default new AuthorizationService();