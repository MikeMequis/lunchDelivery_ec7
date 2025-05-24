const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/lunch_system';

mongoose.connect(url)
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

mongoose.set('strictQuery', true);

module.exports = mongoose;