import Skills from './Skills';

interface User {
  name: string;
  email: string;
  role: string;
}

const SkillsPage = () => {
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <>
      {user && user.email && <Skills user={user} />}
    </>
  );
};

export default SkillsPage;
