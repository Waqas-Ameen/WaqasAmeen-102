const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  specialization: { type: DataTypes.STRING(100) },
  treatment_type: { 
    type: DataTypes.ENUM('Allopathic', 'Homeopathic', 'Herbal') 
  },
  diseases_treated: { type: DataTypes.JSON },
  experience_years: { type: DataTypes.INTEGER },
  consultation_fee: { type: DataTypes.DECIMAL(10, 2) },
  bio: { type: DataTypes.TEXT },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'doctors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Doctor;
