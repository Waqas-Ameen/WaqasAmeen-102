const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  medications: { type: DataTypes.JSON },
  instructions: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'prescriptions',
  timestamps: false // Requirement: NO updated_at, immutable
});

module.exports = Prescription;
