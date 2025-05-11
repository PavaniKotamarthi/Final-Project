const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const Employee = require("../models/Employee");

// Sign Up Route (User Registration)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if employee email exists in Employee table
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ error: "This email is not associated with a company employee." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    // 3. Hash and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 4. Create token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ redirect: "/register" });
  const empRole = await Employee.findOne({email});

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
  { email: user.email, name: empRole.name, role: empRole.role }, // Include necessary fields
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
  res.json({ token, user });
});

// Protected Route (Example)
router.get('/protected', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader){
    return res.status(401).json({ message: 'Unauthorized' });
  } 

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }); // fetch from DB
    if (!user) return res.status(404).json({ message: 'User not found' });
    const employee = await Employee.findOne({ email: decoded.email }); 

    // Return relevant data
    res.json({
      name: employee.name,
      email: user.email,
      role: employee.role,
    });
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
});

module.exports = router;
