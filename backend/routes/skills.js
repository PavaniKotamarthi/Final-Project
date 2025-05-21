const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// GET /api/skills?search=optional
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let skills;

    if (search) {
      skills = await Skill.find({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      skills = await Skill.find();
    }

    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/skills
router.post('/', async (req, res) => {
  const { userEmail, skill } = req.body;

  if (!userEmail || !skill) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let userSkills = await Skill.findOne({ userEmail });

    if (userSkills) {
      if (!userSkills.skills.includes(skill)) {
        userSkills.skills.push(skill);
        await userSkills.save();
      }
    } else {
      userSkills = new Skill({
        userEmail,
        username: userEmail.split('@')[0],
        skills: [skill]
      });
      await userSkills.save();
    }

    res.status(200).json(userSkills);
  } catch (err) {
    res.status(500).json({ error: 'Could not add skill' });
  }
});

module.exports = router;
