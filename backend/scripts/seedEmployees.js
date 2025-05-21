const mongoose = require('mongoose');
require('dotenv').config();
const Employee = require('../models/Employee');

const roles = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

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

    await Employee.create({
      empId: 'EMP009', // changed from number to string to match pattern
      name: 'Pavani',
      email: 'pavani.kotamarthi2310@gmail.com',
      role: roles[7],
      isAdminAccess: true
    });

    console.log('Employees seeded');
  } catch (error) {
    console.error('Error seeding employees:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedEmployees();
