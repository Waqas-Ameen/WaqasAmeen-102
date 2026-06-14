const { Payment, Appointment, Patient } = require('../models');

exports.uploadPayment = async (req, res) => {
  try {
    const { appointment_id, amount, payment_method } = req.body;
    const payment_screenshot = req.file ? req.file.filename : null;
    
    if (!payment_screenshot) return res.status(400).json({ success: false, message: 'Screenshot required' });

    const patient = await Patient.findOne({ where: { user_id: req.user.id } });
    const appointment = await Appointment.findByPk(appointment_id);
    if (!appointment || appointment.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Invalid appointment or status' });
    }
    
    const payment = await Payment.create({ appointment_id, patient_id: patient.id, amount, payment_method, payment_screenshot, status: 'pending' });
    await appointment.update({ status: 'payment_uploaded' });
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: [Appointment, Patient] });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });

    await payment.update({ status: 'verified', verified_at: new Date() });
    
    const appointment = await Appointment.findByPk(payment.appointment_id);
    await appointment.update({ status: 'confirmed' });
    
    res.json({ success: true, message: 'Payment verified', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });

    await payment.update({ status: 'rejected' });
    
    const appointment = await Appointment.findByPk(payment.appointment_id);
    await appointment.update({ status: 'cancelled' });
    
    res.json({ success: true, message: 'Payment rejected', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
