const express = require('express');
const cabController = require('../../controllers/cab.controller');
const validator = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, validator('nearByCabsSchema', 'query'), cabController.getCabs);
router.post('/book', auth, validator('bookCabSchema'), cabController.bookCab);

module.exports = router;
