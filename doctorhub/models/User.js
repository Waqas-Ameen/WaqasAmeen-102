const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { 
    type: DataTypes.ENUM('patient', 'doctor', 'assistant', 'admin', 'super_admin'), 
    defaultValue: 'patient' 
  },
  phone: { type: DataTypes.STRING(20) },
  profile_image: { type: DataTypes.STRING(255) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  reset_password_token: { type: DataTypes.STRING(255) },
  reset_password_expires: { type: DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
