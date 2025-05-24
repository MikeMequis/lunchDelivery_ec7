import axios from 'axios';

// Current IP address of the machine (USB tethering interface)
const HOST_IP = '192.XXX.XXX.XXX';

console.log('API Base URL:', `http://${HOST_IP}:3000`);

const api = axios.create({
  baseURL: `http://${HOST_IP}:3000`,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', {
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
      } : 'No config available',
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response available'
    });
    return Promise.reject(error);
  }
);

export default api;