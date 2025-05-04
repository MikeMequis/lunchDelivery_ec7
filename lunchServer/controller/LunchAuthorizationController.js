const LunchAuthorizationModel = require('../model/LunchAuthorizationModel');
const StudentModel = require('../model/StudentModel');

class LunchAuthorizationController {
    async createAuth(req, res) {
        const authorization = new LunchAuthorizationModel(req.body);
        await authorization
            .save()
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                if (error.code === 11000) { // MongoDB duplicate key error
                    return res.status(400).json({ error: 'Já existe uma autorização para este aluno nesta data' });
                }
                return res.status(500).json(error);
            });
    }

    async getAuthByDate(req, res) {
        const date = new Date(req.params.date);
        
        const startDate = new Date(date.setHours(0, 0, 0, 0));
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        try {
            // Find authorizations for the given date
            const authorizations = await LunchAuthorizationModel.find({
                dataLiberation: { $gte: startDate, $lte: endDate }
            }).lean();

            // Get student details for each authorization
            const result = await Promise.all(authorizations.map(async (auth) => {
                const student = await StudentModel.findOne({ studentRA: auth.studentRA }).lean();
                return { ...auth._doc || auth, student };
            }));

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getAuthById(req, res) {
        await LunchAuthorizationModel.findById(req.params.id)
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async updateAuth(req, res) {
        try {
            // Verificar se a autorização já foi usada em alguma entrega
            const authId = req.params.id;
            const deliveryExists = await require('../model/LunchDeliveryModel').findOne({ authId });
            
            if (deliveryExists) {
                return res.status(400).json({ 
                    error: 'Não é possível editar uma autorização que já foi utilizada para entrega' 
                });
            }
            
            // Continuar com a atualização se não foi usada
            const response = await LunchAuthorizationModel.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { new: true }
            );
            
            return res.status(200).json(response);
        } catch (error) {
            if (error.code === 11000) { // MongoDB duplicate key error
                return res.status(400).json({ error: 'Já existe uma autorização para este aluno nesta data' });
            }
            return res.status(500).json(error);
        }
    }

    async deleteAuth(req, res) {
        try {
            // Verificar se a autorização já foi usada em alguma entrega
            const authId = req.params.id;
            const deliveryExists = await require('../model/LunchDeliveryModel').findOne({ authId });
            
            if (deliveryExists) {
                return res.status(400).json({ 
                    error: 'Não é possível excluir uma autorização que já foi utilizada para entrega' 
                });
            }
            
            // Continuar com a exclusão se não foi usada
            const response = await LunchAuthorizationModel.findByIdAndDelete(req.params.id);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new LunchAuthorizationController();