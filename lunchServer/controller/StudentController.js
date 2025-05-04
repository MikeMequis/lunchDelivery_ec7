const StudentModel = require('../model/StudentModel');

class StudentController {
    async createStudent(req, res) {
        const student = new StudentModel(req.body);
        await student.save()
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                if (error.code === 11000) { // MongoDB duplicate key error
                    return res.status(400).json({ error: 'Já existe um aluno com este RA' });
                }
                return res.status(500).json(error);
            });
    }

    async getAllStudents(req, res) {
        await StudentModel.find().sort('studentRA')
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async getStudentsById(req, res) {
        await StudentModel.findOne({ "studentRA": req.params.ra })
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async updateStudent(req, res) {
        await StudentModel.findOneAndUpdate(
                { "studentRA": req.params.ra }, 
                req.body, 
                { new: true }
             )
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async deleteStudent(req, res) {
        await StudentModel.findOneAndDelete({ "studentRA": req.params.ra })
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }
}

module.exports = new StudentController();