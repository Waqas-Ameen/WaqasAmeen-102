const { Assistant, Doctor, User } = require('../models');

exports.assignAssistant = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const { assistant_user_id } = req.body; 
    
    const assistant = await Assistant.create({ user_id: assistant_user_id, doctor_id: doctor.id });
    res.status(201).json({ success: true, data: assistant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAssistants = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const assistants = await Assistant.findAll({ 
      where: { doctor_id: doctor.id },
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    res.json({ success: true, data: assistants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.removeAssistant = async (req, res) => {
  try {
    const assistant = await Assistant.findByPk(req.params.id);
    if (!assistant) return res.status(404).json({ success: false, message: 'Not found' });
    
    await assistant.destroy();
    res.json({ success: true, message: 'Assistant removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
