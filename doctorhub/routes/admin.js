const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);

router.get('/users', roleCheck('admin', 'super_admin'), adminController.getUsers);
router.put('/users/:id/status', roleCheck('admin', 'super_admin'), adminController.updateUserStatus);
router.get('/doctors', roleCheck('admin', 'super_admin'), adminController.getDoctors);
router.put('/doctors/:id/verify', roleCheck('admin', 'super_admin'), adminController.verifyDoctor);
router.delete('/users/:id', roleCheck('super_admin'), adminController.deleteUser);
router.get('/stats', roleCheck('admin', 'super_admin'), adminController.getStats);

module.exports = router;
