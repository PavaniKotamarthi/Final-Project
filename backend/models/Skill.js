const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  username: { type: String, required: true },
  skills: { type: [String], default: [] }
});

module.exports = mongoose.model('Skill', SkillSchema);
