const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.DECIMAL(10, 2) },
  payment_screenshot: { type: DataTypes.STRING(255) },
  payment_method: { type: DataTypes.STRING(50) },
  status: { 
    type: DataTypes.ENUM('pending','verified','rejected'), 
    defaultValue: 'pending' 
  },
  verified_at: { type: DataTypes.DATE }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;
