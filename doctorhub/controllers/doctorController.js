const { Doctor, User, Clinic } = require('../models');
const { Op } = require('sequelize');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: User, attributes: ['name', 'email', 'phone', 'profile_image'] }, { model: Clinic }]
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.searchDoctors = async (req, res) => {
  try {
    const { disease, type, city } = req.query;
    let doctorWhere = {};
    if (type) doctorWhere.treatment_type = type;
    if (disease) doctorWhere.diseases_treated = { [Op.like]: `%${disease}%` }; 

    let clinicWhere = {};
    if (city) clinicWhere.city = { [Op.like]: `%${city}%` };

    const doctors = await Doctor.findAll({
      where: doctorWhere,
      include: [
        { model: User, attributes: ['name', 'profile_image', 'email', 'phone'] },
        { model: Clinic, where: clinicWhere, required: city ? true : false }
      ]
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email', 'phone', 'profile_image'] }, { model: Clinic }]
    });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { specialization, treatment_type, diseases_treated, experience_years, consultation_fee, bio } = req.body;
    let doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    await doctor.update({ specialization, treatment_type, diseases_treated, experience_years, consultation_fee, bio });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSchedule = async (req, res) => {
  res.json({ success: true, message: 'Schedule fetched' });
};

exports.setSchedule = async (req, res) => {
  res.json({ success: true, message: 'Schedule updated' });
};
