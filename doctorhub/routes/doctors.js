const express = require('express');
const router = express.Router();
const docController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/search', docController.searchDoctors);
router.get('/', docController.getDoctors);
router.get('/:id', docController.getDoctorById);

router.put('/profile', auth, roleCheck('doctor'), docController.updateProfile);
router.get('/:id/schedule', docController.getSchedule);
router.post('/:id/schedule', auth, roleCheck('doctor'), docController.setSchedule);

module.exports = router;
