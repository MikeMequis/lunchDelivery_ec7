const express = require('express');
const router = express.Router();
const LunchDeliveryController = require('../controller/LunchDeliveryController');
const LunchDeliveryValidation = require('../middlewares/LunchDeliveryValidation');

router.post('/', LunchDeliveryValidation, LunchDeliveryController.createDelivery);
router.get('/date/:date', LunchDeliveryController.getDeliveryByDate); // Updated to use param for date

module.exports = router;