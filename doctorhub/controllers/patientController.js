const { Patient, User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { date_of_birth, gender, blood_group, emergency_contact, address } = req.body;
    let patient = await Patient.findOne({ where: { user_id: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    await patient.update({ date_of_birth, gender, blood_group, emergency_contact, address });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
