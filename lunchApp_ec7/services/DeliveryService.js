import api from './api';
import { format } from 'date-fns';

class DeliveryService {
  // Create a new lunch delivery
  async createDelivery(data) {
    try {
      const payload = {
        ...data,
        deliveryDate: format(data.deliveryDate, 'yyyy-MM-dd')
      };
      const response = await api.post('/deliveries', payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get deliveries by date
  async getDeliveriesByDate(date) {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await api.get(`/deliveries/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get delivery statistics/summary
  // This would be used for the DeliverySummaryScreen
  async getDeliverySummary(date) {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Load both deliveries and authorizations for comparison
      const [deliveriesResponse, authorizationsResponse] = await Promise.all([
        api.get(`/deliveries/date/${formattedDate}`),
        api.get(`/authorizations/date/${formattedDate}`)
      ]);

      const deliveries = deliveriesResponse.data;
      const authorizations = authorizationsResponse.data;

      // Calculate statistics
      const stats = {
        totalDeliveries: deliveries.length,
        totalAuthorizations: authorizations.length,
        completionRate: authorizations.length > 0
          ? Math.round((deliveries.length / authorizations.length) * 100)
          : 0,
        pendingDeliveries: [],
        // Include full data for the screen
        deliveries: deliveries,
        authorizations: authorizations
      };

      // Find authorizations that don't have corresponding deliveries
      if (authorizations.length > 0) {
        const deliveredRAs = deliveries.map(d => d.studentRA);
        stats.pendingDeliveries = authorizations
          .filter(auth => !deliveredRAs.includes(auth.studentRA))
          .map(auth => ({
            ...auth,
            student: auth.student
          }));
      }

      return stats;
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
}

export default new DeliveryService();