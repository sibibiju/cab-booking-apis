const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router.get('/booking-history', userController.getBookingHistory);

module.exports = router;
