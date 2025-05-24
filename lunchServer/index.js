require('./config/database');

const express = require('express');
const cors = require('cors');
const server = express();

// Add request logging middleware
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Client IP:', req.ip);
  next();
});

server.use(express.json());
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

const studentRoutes = require('./routes/StudentRoutes');
const authRoutes = require('./routes/LunchAuthorizationRoutes');
const deliveryRoutes = require('./routes/LunchDeliveryRoutes');

server.use('/students', studentRoutes);
server.use('/authorizations', authRoutes);
server.use('/deliveries', deliveryRoutes);

server.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

server.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;

// Try to get the network interfaces
const networkInterfaces = require('os').networkInterfaces();
console.log('\nAvailable network interfaces:');
Object.keys(networkInterfaces).forEach((interfaceName) => {
  networkInterfaces[interfaceName].forEach((interface) => {
    if (interface.family === 'IPv4') {
      console.log(`${interfaceName}: ${interface.address}`);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nAPI rodando nas seguintes URLs:`);
  console.log(`- Local: http://localhost:${PORT}`);
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4') {
        console.log(`- ${interfaceName}: http://${interface.address}:${PORT}`);
      }
    });
  });
});