const express = require('express');
const router = express.Router();
const patController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/profile', auth, patController.getProfile);
router.put('/profile', auth, patController.updateProfile);
router.get('/:id', auth, roleCheck('doctor'), patController.getPatientById);

module.exports = router;
