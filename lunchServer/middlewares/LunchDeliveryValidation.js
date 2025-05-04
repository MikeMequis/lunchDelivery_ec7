const LunchDeliveryModel = require('../model/LunchDeliveryModel');
const LunchAuthorizationModel = require('../model/LunchAuthorizationModel');

async function LunchDeliveryValidation(req, res, next) {
    const { authId, studentRA, deliveryDate } = req.body;

    if (!authId)
        return res.status(400).json({ error: 'O ID da autorização é obrigatório' });

    if (!studentRA)
        return res.status(400).json({ error: 'O RA do aluno é obrigatório' });

    if (!deliveryDate)
        return res.status(400).json({ error: 'A data de entrega é obrigatória' });

    // Check if the authorization exists
    const authorization = await LunchAuthorizationModel.findById(authId);
    if (!authorization)
        return res.status(400).json({ error: 'Autorização não encontrada' });

    // Check if the student RA matches the authorization
    if (authorization.studentRA !== studentRA)
        return res.status(400).json({ error: 'O RA do aluno não corresponde à autorização' });

    // Check if the delivery date matches the authorization date
    const authDate = new Date(authorization.dataLiberation);
    const deliveryDateObj = new Date(deliveryDate);

    const authDateNormalized = new Date(authDate).setHours(0, 0, 0, 0);
    const deliveryDateNormalized = new Date(deliveryDateObj).setHours(0, 0, 0, 0);

    if (authDateNormalized !== deliveryDateNormalized) {
        return res.status(400).json({ error: 'A data de entrega deve ser a mesma da autorização' });
    }

    // Check if a delivery for this authorization already exists
    const exists = await LunchDeliveryModel.findOne({
        authId: authId
    });

    if (exists) {
        return res.status(400).json({
            error: 'Já existe uma entrega registrada para esta autorização'
        });
    }

    // Check if delivery count has been exceeded for this authorization
    const deliveryCount = await LunchDeliveryModel.countDocuments({
        "authId": authId
    });

    if (deliveryCount >= authorization.qtdLunches) {
        return res.status(400).json({ error: `Limite de ${authorization.qtdLunches} entregas para esta autorização já foi atingido` });
    }

    return next();
}

module.exports = LunchDeliveryValidation;