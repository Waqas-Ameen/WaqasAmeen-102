const { MedicalHistory, Patient, Doctor, Prescription } = require('../models');

exports.getHistory = async (req, res) => {
  try {
    let whereCls = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });
      whereCls.patient_id = patient.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      whereCls.doctor_id = doctor.id;
    }
    
    const history = await MedicalHistory.findAll({ 
      where: whereCls,
      include: [Prescription]
    });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const { patient_id, appointment_id, diagnosis, notes } = req.body;
    
    const history = await MedicalHistory.create({
      patient_id, doctor_id: doctor.id, appointment_id, diagnosis, notes
    });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findByPk(req.params.id, { include: [Prescription] });
    if (!history) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadReport = async (req, res) => {
  try {
    const { history_id } = req.body;
    const report_file = req.file ? req.file.filename : null;
    if (!report_file) return res.status(400).json({ success: false, message: 'Report requires file' });
    
    const history = await MedicalHistory.findByPk(history_id);
    if (!history) return res.status(404).json({ success: false, message: 'Not found' });
    
    await history.update({ report_file }, { hooks: false });
    res.json({ success: true, message: 'Report uploaded', data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
