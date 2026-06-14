const { Clinic, Doctor } = require('../models');

exports.createClinic = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const clinic = await Clinic.create({ ...req.body, doctor_id: doctor.id });
    res.status(201).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getClinics = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const clinics = await Clinic.findAll({ where: { doctor_id: doctor.id } });
    res.json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) return res.status(404).json({ success: false, message: 'Not found' });
    await clinic.update(req.body);
    res.json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) return res.status(404).json({ success: false, message: 'Not found' });
    await clinic.destroy();
    res.json({ success: true, message: 'Clinic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
