import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillsData from './SkillsData';

interface Skill {
  _id: string;
  userEmail: string;
  username: string;
  skills: string[];
}

interface User {
  email: string;
  name: string;
  role: string;
}

const Skills: React.FC<{ user: User }> = ({ user }) => {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');

  const isAdmin = user.role === 'G7' || user.role === 'G8';

  const fetchSkills = async () => {
    let url = 'http://localhost:5000/api/skills';
    if (isAdmin && search) {
      url += `?search=${search}`;
    }

    const res = await axios.get(url);
    const data = res.data;

    if (!isAdmin) {
      const userSkill = data.find((s: Skill) => s.userEmail === user.email);
      setAllSkills(userSkill ? [userSkill] : []);
    } else {
      // Show current user at top
      const sorted = data.sort((a: Skill, b: Skill) => 
        a.userEmail === user.email ? -1 : b.userEmail === user.email ? 1 : 0
      );
      setAllSkills(sorted);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [search]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Skills</h2>

      {isAdmin && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full max-w-sm"
          />
        </div>
      )}

      <SkillsData
        isAdmin={isAdmin}
        skillsData={allSkills}
        currentUserEmail={user.email}
        onRefresh={fetchSkills}
      />
    </div>
  );
};

export default Skills;
