const express = require('express');
const router = express.Router();
const StudentController = require('../controller/StudentController');
const StudentValidation = require('../middlewares/StudentValidation');

router.post('/', StudentValidation, StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:ra', StudentController.getStudentsById);
router.put('/:ra', StudentValidation, StudentController.updateStudent);
router.delete('/:ra', StudentController.deleteStudent);

module.exports = router;