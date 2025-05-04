import axios from 'axios';

// Troque pelo IP real da sua máquina
const HOST_IP = '192.XXX.X.XX';

const api = axios.create({
  baseURL: `http://${HOST_IP}:3000`,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;