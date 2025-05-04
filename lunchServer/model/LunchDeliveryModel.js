const mongoose = require('../config/database');

const LunchDeliverySchema = new mongoose.Schema(
    {
        authId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LunchAuthorization' },
        studentRA: { type: String, required: true, ref: 'Student' },
        deliveryDate: { type: Date, required: true }
    }
)

LunchDeliverySchema.index(
    { authId: 1, studentRA: 1, deliveryDate: 1 },
    { unique: true }
);

module.exports = mongoose.model('LunchDelivery', LunchDeliverySchema);