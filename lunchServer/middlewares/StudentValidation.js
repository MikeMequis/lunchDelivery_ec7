const StudentModel = require('../model/StudentModel');

async function StudentValidation(req, res, next) {
    const { studentRA, nome, photoUrl } = req.body;
    let isUpdate = req.params.ra != null;

    if (!studentRA || studentRA.length < 5)
        return res.status(400).json({ error: 'O RA deve ter pelo menos 5 caracteres' });

    if (!nome || nome.length < 3)
        return res.status(400).json({ error: 'O nome deve ter pelo menos 3 caracteres' });

    if (!photoUrl)
        return res.status(400).json({ error: 'A foto é obrigatória' });

    if (isUpdate) {
        if (studentRA && req.params.ra !== studentRA)
            return res.status(400).json({ error: 'O RA informado no parâmetro está diferente do RA informado no JSON' });

        let exists = (await StudentModel.countDocuments({ "studentRA": req.params.ra })) >= 1;
        if (!exists)
            return res.status(400).json({ error: 'Não há registro para o RA informado' });
    }
    else {
        let exists = (await StudentModel.countDocuments({ "studentRA": studentRA })) >= 1;
        if (exists)
            return res.status(400).json({ error: 'Já existe um aluno cadastrado com este RA' });
    }

    return next();
}

module.exports = StudentValidation;