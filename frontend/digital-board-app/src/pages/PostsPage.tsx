import React from 'react';
import Posts from './Posts';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const PostsPage = () => {
  return <Posts user={user} />;
};

export default PostsPage;
