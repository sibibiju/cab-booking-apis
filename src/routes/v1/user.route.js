const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router
    .route('/booking/history')
    .get(userController.getBookingHistory);

module.exports = router;
