require('./config/database');

const express = require('express');
const cors = require('cors');
const server = express();

server.use(express.json());
server.use(cors());

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
server.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));