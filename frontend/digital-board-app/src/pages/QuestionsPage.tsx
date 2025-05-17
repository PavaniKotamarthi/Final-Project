import React from 'react';
import Questions from './Questions';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const QuestionsPage = () => {
  return <Questions user={user} />;
};

export default QuestionsPage;
