const { Appointment, Patient, Doctor, Clinic, Payment } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { user_id: req.user.id } });
    if (!patient) return res.status(403).json({ success: false, message: 'Only patients can book' });

    const { doctor_id, clinic_id, appointment_date, appointment_time, reason } = req.body;
    const appointment = await Appointment.create({
      patient_id: patient.id, doctor_id, clinic_id, appointment_date, appointment_time, reason, status: 'pending'
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let whereCls = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });
      whereCls.patient_id = patient.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      whereCls.doctor_id = doctor.id;
    }
    
    // Use string aliases to prevent sequelize include errors if missing explicitly
    const appointments = await Appointment.findAll({ 
      where: whereCls,
      include: [ Doctor, Patient, Clinic ]
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [Doctor, Patient, Clinic, Payment]
    });
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    
    if (appointment.status !== 'pending' && appointment.status !== 'payment_uploaded') {
      return res.status(400).json({ success: false, message: 'Cannot cancel at this stage' });
    }
    
    await appointment.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Only confirmed appointments can be completed' });
    }
    
    await appointment.update({ status: 'completed' });
    res.json({ success: true, message: 'Appointment completed', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
