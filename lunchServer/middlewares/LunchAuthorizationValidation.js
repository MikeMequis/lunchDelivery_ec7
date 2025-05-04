// LunchAuthorizationValidation.js
const LunchAuthorizationModel = require('../model/LunchAuthorizationModel');
const StudentModel = require('../model/StudentModel');
const { isFuture } = require('date-fns');

async function LunchAuthorizationValidation(req, res, next) {
    const { studentRA, dataLiberation, qtdLunches } = req.body;
    let isUpdate = req.params.id != null;

    if (!studentRA)
        return res.status(400).json({ error: 'O RA do aluno é obrigatório' });

    const studentExists = (await StudentModel.countDocuments({ "studentRA": studentRA })) >= 1;
    if (!studentExists)
        return res.status(400).json({ error: 'Aluno não encontrado' });

    if (!dataLiberation)
        return res.status(400).json({ error: 'A data de liberação é obrigatória' });

    if (isFuture(new Date(dataLiberation)))
        return res.status(400).json({ error: 'A data de liberação não pode estar no futuro' });

    if (!qtdLunches || qtdLunches < 1 || qtdLunches > 3)
        return res.status(400).json({ error: 'A quantidade de lanches deve estar entre 1 e 3' });

    if (isUpdate) {
        const authExists = (await LunchAuthorizationModel.countDocuments({ "_id": req.params.id })) >= 1;
        if (!authExists)
            return res.status(400).json({ error: 'Autorização não encontrada' });
    }
    else {
        // Check if there's already an authorization for this student on this date
        const exists = (await LunchAuthorizationModel.countDocuments({ 
            "studentRA": studentRA, 
            "dataLiberation": new Date(dataLiberation)
        })) >= 1;
        
        if (exists)
            return res.status(400).json({ error: 'Já existe uma autorização para este aluno nesta data' });
    }

    return next();
}

module.exports = LunchAuthorizationValidation;