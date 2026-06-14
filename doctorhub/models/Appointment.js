const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  appointment_time: { type: DataTypes.TIME, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending','payment_uploaded','confirmed','completed','cancelled'), 
    defaultValue: 'pending' 
  },
  reason: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT }
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Appointment;
