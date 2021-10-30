const express = require('express');
const cabController = require('../../controllers/cab.controller');
//const validate = require('../../middlewares/validate');
const cabValidation = require('../../validations/cab.validation');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, cabController.getCabs);
router.post('/book', auth, cabController.bookCab);

module.exports = router;
