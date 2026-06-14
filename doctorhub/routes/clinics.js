const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth, roleCheck('doctor'));

router.post('/', clinicController.createClinic);
router.get('/', clinicController.getClinics);
router.put('/:id', clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

module.exports = router;
