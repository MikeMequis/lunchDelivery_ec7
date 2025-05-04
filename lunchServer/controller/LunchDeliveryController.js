const LunchDeliveryModel = require('../model/LunchDeliveryModel');
const StudentModel = require('../model/StudentModel');

class LunchDeliveryController {
    async createDelivery(req, res) {
        // Primeiro verificar se já existe uma entrega para esta autorização
        try {
            const existingDelivery = await LunchDeliveryModel.findOne({
                authId: req.body.authId
            });

            if (existingDelivery) {
                return res.status(400).json({
                    error: 'Já existe uma entrega registrada para esta autorização'
                });
            }

            // Continuar com a criação normal
            const delivery = new LunchDeliveryModel(req.body);
            const response = await delivery.save();
            return res.status(200).json(response);
        } catch (error) {
            if (error.code === 11000) { // MongoDB duplicate key error
                return res.status(400).json({
                    error: 'Já existe uma entrega registrada para esta autorização'
                });
            }
            return res.status(500).json(error);
        }
    }

    async getDeliveryByDate(req, res) {
        const date = new Date(req.params.date);

        const startDate = new Date(date.setHours(0, 0, 0, 0));

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        try {
            const deliveries = await LunchDeliveryModel.find({
                deliveryDate: { $gte: startDate, $lte: endDate }
            }).lean();

            const result = await Promise.all(deliveries.map(async (delivery) => {
                const student = await StudentModel.findOne({ studentRA: delivery.studentRA }).lean();
                return { ...delivery, student };
            }));

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new LunchDeliveryController();