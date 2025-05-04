const mongoose = require('../config/database');

const StudentSchema = new mongoose.Schema(
    {
        studentRA: { type: String, required: true, unique: true },
        nome: { type: String, required: true },
        photoUrl: { type: String, required: true }
    }
)

module.exports = mongoose.model('Student', StudentSchema);