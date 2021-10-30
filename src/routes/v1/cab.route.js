const express = require('express');
const cabController = require('../../controllers/cab.controller');
//const validate = require('../../middlewares/validate');
const cabValidation = require('../../validations/cab.validation');
const router = express.Router();

router.get('/', cabController.getCabs);
router.post('/book', cabController.bookCab);

module.exports = router;
