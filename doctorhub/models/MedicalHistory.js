const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalHistory = sequelize.define('MedicalHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  diagnosis: { type: DataTypes.TEXT, allowNull: false },
  notes: { type: DataTypes.TEXT },
  report_file: { type: DataTypes.STRING(255) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'medical_history',
  timestamps: false // Requirement: NO updated_at, immutable
});

module.exports = MedicalHistory;
