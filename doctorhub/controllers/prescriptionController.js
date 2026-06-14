const { Prescription, Doctor } = require('../models');

exports.addPrescription = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    const { medical_history_id, patient_id, medications, instructions } = req.body;

    const prescription = await Prescription.create({
      medical_history_id, doctor_id: doctor.id, patient_id, medications, instructions
    });
    
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPrescriptionByHistoryId = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({ where: { medical_history_id: req.params.historyId } });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
