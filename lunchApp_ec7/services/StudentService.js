import api from './api';

class StudentService {
  async createStudent(data) {
    try {
      const response = await api.post('/students', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllStudents() {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentByRA(studentRA) {
    try {
      const response = await api.get(`/students/${studentRA}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStudent(studentRA, data) {
    try {
      const response = await api.put(`/students/${studentRA}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteStudent(studentRA) {
    try {
      const response = await api.delete(`/students/${studentRA}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return error.response.data.error || 'Erro ao processar solicitação';
    } else if (error.request) {
      return 'Sem resposta do servidor. Verifique sua conexão.';
    } else {
      return 'Erro ao realizar solicitação.';
    }
  }
}

export default new StudentService();