const express = require('express');
const router = express.Router();
const apptController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);

router.post('/', roleCheck('patient'), apptController.createAppointment);
router.get('/', roleCheck('patient', 'doctor', 'admin', 'super_admin'), apptController.getAppointments);
router.get('/:id', apptController.getAppointmentById);
router.put('/:id/cancel', roleCheck('patient'), apptController.cancelAppointment);
router.put('/:id/complete', roleCheck('doctor'), apptController.completeAppointment);

module.exports = router;
