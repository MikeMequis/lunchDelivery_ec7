const mongoose = require('../config/database');

const LunchAuthorizationSchema = new mongoose.Schema(
    {
        studentRA: { type: String, required: true, ref: 'Student' },
        dataLiberation: { type: Date, required: true },
        qtdLunches: { type: Number, required: true, min: 1, max: 3 }
    }
)

LunchAuthorizationSchema.index(
    { studentRA: 1, dataLiberation: 1 },
    { unique: true }
);

module.exports = mongoose.model('LunchAuthorization', LunchAuthorizationSchema);