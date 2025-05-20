import React from 'react';
import Questions from './Questions';

interface User {
  name: string;
  email: string;
  role: string;
}

const QuestionsPage = () => {
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <>
      {user && user.email && <Questions user={user} />}
    </>
  );
};

export default QuestionsPage;
