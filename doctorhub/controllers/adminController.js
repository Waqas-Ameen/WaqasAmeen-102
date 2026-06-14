const { User, Doctor, Appointment, Payment } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.update({ is_active: !user.is_active });
    res.json({ success: true, message: 'Status updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ include: [{ model: User, attributes: ['name', 'email'] }] });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    
    await doctor.update({ is_verified: !doctor.is_verified });
    res.json({ success: true, message: 'Doctor verification toggled', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const usersCount = await User.count();
    const doctorsCount = await Doctor.count();
    const appointmentsCount = await Appointment.count();
    const pendingPaymentsCount = await Payment.count({ where: { status: 'pending' } });
    
    res.json({ success: true, data: { usersCount, doctorsCount, appointmentsCount, pendingPaymentsCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
