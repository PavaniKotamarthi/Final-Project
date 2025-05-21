// seedSkills.js or inside a route/controller
const mongoose = require('mongoose');
require('dotenv').config();
const Skill = require('../models/Skill'); // Adjust path based on your file structure

const seedSkills = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const data = [
            {
                userEmail: 'employee5@company.com',
                username: 'Employee 5',
                skills: ['React', 'Node.js', 'MongoDB'],
            },
            {
                userEmail: 'employee7@company.com',
                username: 'Employee 7',
                skills: ['Python', 'Django', 'PostgreSQL'],
            },
        ];

        for (const entry of data) {
            await Skill.findOneAndUpdate(
                { userEmail: entry.userEmail },
                { $set: { username: entry.username }, $addToSet: { skills: { $each: entry.skills } } },
                { upsert: true }
            );
        }

        console.log('Seeding complete');
    }
    catch (error) {
        console.error('Error seeding employees:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seedSkills();
