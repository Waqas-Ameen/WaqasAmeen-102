const express = require('express');
const router = express.Router();
const assistController = require('../controllers/assistantController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth, roleCheck('doctor'));
router.post('/', assistController.assignAssistant);
router.get('/', assistController.getAssistants);
router.delete('/:id', assistController.removeAssistant);

module.exports = router;
