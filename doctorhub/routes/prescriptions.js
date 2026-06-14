const express = require('express');
const router = express.Router();
const prescController = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);

router.post('/', roleCheck('doctor'), prescController.addPrescription);
router.get('/:historyId', prescController.getPrescriptionByHistoryId);

module.exports = router;
