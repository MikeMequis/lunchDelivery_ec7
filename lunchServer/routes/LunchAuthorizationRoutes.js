const express = require('express');
const router = express.Router();
const LunchAuthorizationController = require('../controller/LunchAuthorizationController');
const LunchAuthorizationValidation = require('../middlewares/LunchAuthorizationValidation');

router.post('/', LunchAuthorizationValidation, LunchAuthorizationController.createAuth);
router.get('/date/:date', LunchAuthorizationController.getAuthByDate);
router.get('/:id', LunchAuthorizationController.getAuthById);
router.put('/:id', LunchAuthorizationValidation, LunchAuthorizationController.updateAuth);
router.delete('/:id', LunchAuthorizationController.deleteAuth);

module.exports = router;