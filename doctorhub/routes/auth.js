const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], validate, authController.register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], validate, authController.login);

router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], validate, authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.get('/me', auth, authController.getMe);

module.exports = router;
