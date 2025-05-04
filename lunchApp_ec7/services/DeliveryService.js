import api from './api';

class DeliveryService {
  // Create a new lunch delivery
  async createDelivery(data) {
    try {
      const response = await api.post('/deliveries', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get deliveries by date
  async getDeliveriesByDate(date) {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await api.get(`/deliveries/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get delivery statistics/summary
  // This would be used for the DeliverySummaryScreen
  async getDeliverySummary(startDate, endDate) {
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      const response = await api.get(`/deliveries/summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
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

export default new DeliveryService();