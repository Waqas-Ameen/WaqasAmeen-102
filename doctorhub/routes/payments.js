const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.use(auth);

router.post('/', roleCheck('patient'), upload.single('payment_screenshot'), paymentController.uploadPayment);
router.get('/', roleCheck('assistant', 'admin', 'super_admin'), paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id/verify', roleCheck('assistant'), paymentController.verifyPayment);
router.put('/:id/reject', roleCheck('assistant'), paymentController.rejectPayment);

module.exports = router;
