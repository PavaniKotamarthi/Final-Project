import React from 'react';
import Posts from './Posts';

interface User {
  name: string;
  email: string;
  role: string;
}

const PostsPage = () => {
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <>
      {user && user.role && <Posts user={user} />}
    </>
  );
};

export default PostsPage;
