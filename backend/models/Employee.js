const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'], required: true },
  isAdminAccess: { type: Boolean, default: false },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
