const mongoose = require('mongoose');
require('dotenv').config();
const Employee = require('../models/Employee');

const roles = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];

const seedEmployees = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Employee.deleteMany();

  const employees = Array.from({ length: 8 }, (_, i) => {
    const role = roles[i];
    return {
      empId: `EMP00${i + 1}`,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      role,
      isAdminAccess: ['G7', 'G8'].includes(role),
    };
  });

  await Employee.insertMany(employees);
  console.log('Employees seeded');
  mongoose.disconnect();
};

seedEmployees();
