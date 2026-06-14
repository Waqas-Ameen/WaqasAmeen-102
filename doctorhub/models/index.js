const sequelize = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Clinic = require('./Clinic');
const Appointment = require('./Appointment');
const Payment = require('./Payment');
const Assistant = require('./Assistant');
const MedicalHistory = require('./MedicalHistory');
const Prescription = require('./Prescription');

// Doctor -> User
Doctor.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Doctor, { foreignKey: 'user_id' });

// Patient -> User
Patient.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Patient, { foreignKey: 'user_id' });

// Assistant -> User
Assistant.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Assistant, { foreignKey: 'user_id' });

// Assistant -> Doctor
Assistant.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(Assistant, { foreignKey: 'doctor_id' });

// Clinic -> Doctor
Clinic.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(Clinic, { foreignKey: 'doctor_id' });

// Appointment Associations
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });

Appointment.belongsTo(Clinic, { foreignKey: 'clinic_id' });
Clinic.hasMany(Appointment, { foreignKey: 'clinic_id' });

// Payment Associations
Payment.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasOne(Payment, { foreignKey: 'appointment_id' });

Payment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Payment, { foreignKey: 'patient_id' });

Payment.belongsTo(Assistant, { foreignKey: 'verified_by' });
Assistant.hasMany(Payment, { foreignKey: 'verified_by' });

// Medical History Associations
MedicalHistory.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(MedicalHistory, { foreignKey: 'patient_id' });

MedicalHistory.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(MedicalHistory, { foreignKey: 'doctor_id' });

MedicalHistory.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasOne(MedicalHistory, { foreignKey: 'appointment_id' });

MedicalHistory.hasMany(Prescription, { foreignKey: 'medical_history_id' });
Prescription.belongsTo(MedicalHistory, { foreignKey: 'medical_history_id' });

// Prescription Associations
Prescription.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Doctor.hasMany(Prescription, { foreignKey: 'doctor_id' });

Prescription.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Prescription, { foreignKey: 'patient_id' });

module.exports = {
  sequelize,
  User,
  Doctor,
  Patient,
  Clinic,
  Appointment,
  Payment,
  Assistant,
  MedicalHistory,
  Prescription
};
