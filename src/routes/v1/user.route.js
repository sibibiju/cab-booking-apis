const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

// eslint-disable-next-line max-len
router.get('/booking-history', auth, userController.getBookingHistory);
router.post('/login', userController.login);

module.exports = router;
