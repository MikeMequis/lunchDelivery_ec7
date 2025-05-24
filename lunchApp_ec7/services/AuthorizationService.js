import api from './api';
import { format } from 'date-fns';

class AuthorizationService {
  // Create a new lunch authorization
  async createAuthorization(data) {
    try {
      const response = await api.post('/authorizations', {
        ...data,
        dataLiberation: format(data.dataLiberation, 'yyyy-MM-dd')
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get authorizations by date
  async getAuthorizationsByDate(date) {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
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
      const response = await api.put(`/authorizations/${id}`, {
        ...data,
        dataLiberation: format(data.dataLiberation, 'yyyy-MM-dd')
      });
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
    if (error.response && error.response.data && error.response.data.error) {
      return error.response.data.error;
    } else if (error.response) {
      return 'Erro ao processar solicitação';
    } else if (error.request) {
      return 'Sem resposta do servidor. Verifique sua conexão.';
    } else {
      return 'Erro ao realizar solicitação.';
    }
  }

  async getAvailableAuthorizations(date) {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Get authorizations for the date
      const authResponse = await api.get(`/authorizations/date/${formattedDate}`);
      const authorizations = authResponse.data;

      // Get deliveries for the date to filter out used authorizations
      const deliveriesResponse = await api.get(`/deliveries/date/${formattedDate}`);
      const deliveries = deliveriesResponse.data;

      // Filter out authorizations that have already been used
      const usedAuthIds = deliveries.map(delivery => String(delivery.authId));
      return authorizations.filter(auth => !usedAuthIds.includes(String(auth._id)));
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new AuthorizationService();