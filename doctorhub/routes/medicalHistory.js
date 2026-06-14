const express = require('express');
const router = express.Router();
const historyController = require('../controllers/medicalHistoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.use(auth);

router.get('/', roleCheck('patient', 'doctor'), historyController.getHistory);
router.post('/', roleCheck('doctor'), historyController.addHistory);
router.get('/:id', roleCheck('patient', 'doctor'), historyController.getHistoryById);
router.post('/upload-report', roleCheck('patient'), upload.single('report_file'), historyController.uploadReport);

module.exports = router;
