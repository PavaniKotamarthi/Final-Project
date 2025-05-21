import React from 'react';

interface Skill {
  _id: string;
  userEmail: string;
  username: string;
  skills: string[];
}

interface Props {
  isAdmin: boolean;
  skillsData: Skill[];
  currentUserEmail: string;
  onRefresh: () => void;
}

const SkillsData: React.FC<Props> = ({ isAdmin, skillsData, currentUserEmail, onRefresh }) => {
  const handleAddSkill = async (userEmail: string) => {
    const skill = prompt("Enter a skill:");
    if (skill) {
      await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, skill }),
      });
      onRefresh();
    }
  };

  // Split current user and other users
  const currentUserSkill = skillsData.find(user => user.userEmail === currentUserEmail);
  const otherUsersSkills = skillsData.filter(user => user.userEmail !== currentUserEmail);

  const renderCard = (skillUser: Skill, isCurrentUser: boolean) => (
    <div key={skillUser._id} className="border p-4 rounded shadow bg-white">
      <h3 className="text-lg font-semibold">
        {skillUser.username} ({isCurrentUser ? 'You' : skillUser.userEmail})
      </h3>

      {skillUser.skills.length === 0 ? (
        <p className="text-gray-500 italic mt-2">
          None{" "}
          {isCurrentUser && (
            <button className="text-blue-500 underline ml-2" onClick={() => handleAddSkill(skillUser.userEmail)}>
              Add
            </button>
          )}
        </p>
      ) : (
        <ul className="list-disc list-inside mt-2">
          {skillUser.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      {/* Always show Add for current user */}
      {isCurrentUser && skillUser.skills.length > 0 && (
        <button
          onClick={() => handleAddSkill(skillUser.userEmail)}
          className="mt-2 text-sm text-blue-600 underline"
        >
          Add Skill
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {currentUserSkill && renderCard(currentUserSkill, true)}
      {isAdmin && otherUsersSkills.map(user => renderCard(user, false))}
    </div>
  );
};

export default SkillsData;
