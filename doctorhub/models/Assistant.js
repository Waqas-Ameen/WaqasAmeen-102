const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assistant = sequelize.define('Assistant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
  tableName: 'assistants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Assistant;
