const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');
const validator = require('../../middlewares/validate');

// eslint-disable-next-line max-len
router.get('/booking-history', auth, userController.getBookingHistory);
router.post('/login', validator('loginSchema'), userController.login);

module.exports = router;
