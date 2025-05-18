import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PostActions from './PostActions';
import PostComments from './PostComments';
import { FaTimes } from 'react-icons/fa';

interface Reply {
  _id: string;
  text: string;
  author: string;
  username: string;
  likes: string[];
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  author: string;
  username: string;
  likes: string[];
  createdAt: string;
  replies: Reply[];
}

interface Post {
  _id: string;
  content: string;
  imageBase64?: string;
  author: string;
  pinned: boolean;
  likes: string[];
  views: number;
  comments: Comment[];
  createdAt: string;
  username: string;
}

interface User {
  name: string;
  email: string;
  role: string;
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
};

const Posts: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pinned' | 'mostLiked'>('all');

  const fetchPosts = async () => {
    let url = 'http://localhost:5000/getPosts';

    if (filter === 'pinned') {
      url = 'http://localhost:5000/getPosts/pinned';
    } else if (filter === 'mostLiked') {
      url = 'http://localhost:5000/getPosts/mostLiked';
    }

    const res = await axios.get(url);
    setPosts(res.data);
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/api/posts', {
      content,
      imageBase64: image,
      username: user.name,
      author: user.email,
    });
    setContent('');
    setImage(null);
    setShowModal(false);
    fetchPosts();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLikePost = async (postId: string) => {
    await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {
      userEmail: user.email,
      username: user.name
    });
    fetchPosts();
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    await axios.post(`http://localhost:5000/api/posts/${postId}/comments/${commentId}/like`, {
      userEmail: user.email,
      username: user.name
    });
    fetchPosts();
  };

  const handleLikeReply = async (postId: string, commentId: string, replyId: string) => {
    await axios.post(`http://localhost:5000/api/posts/${postId}/comments/${commentId}/replies/${replyId}/like`, {
      userEmail: user.email,
      username: user.name
    });
    fetchPosts();
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text) return;
    await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
      text,
      author: user.email,
      username: user.name
    });
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    fetchPosts();
  };

  const handleReplyComment = async (postId: string, commentId: string) => {
    const text = replyInputs[commentId];
    if (!text) return;
    await axios.post(`http://localhost:5000/api/posts/${postId}/comments/${commentId}/reply`, {
      text,
      author: user.email,
      username: user.name
    });
    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    fetchPosts();
  };

  const handlePin = async (postId: string) => {
    await axios.post(`http://localhost:5000/api/posts/${postId}/pin`);
    fetchPosts();
  };

  const handleDelete = async (postId: string) => {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    fetchPosts();
  };

  const isAdmin = () => {
    return (user.role === 'G7' || user.role === 'G8');
  }

  useEffect(() => {
    isAdmin();
    fetchPosts();
  }, [filter]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <div className="flex gap-4 mb-4 items-center">
        <button
          onClick={() => setFilter('pinned')}
          className={`px-4 py-2 rounded ${filter === 'pinned' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Pinned
        </button>
        <button
          onClick={() => setFilter('mostLiked')}
          className={`px-4 py-2 rounded ${filter === 'mostLiked' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Most Liked
        </button>

        {filter !== 'all' && (
          <button
            onClick={() => setFilter('all')}
            className="flex items-center text-sm bg-red-100 text-red-500 px-3 py-1 rounded hover:bg-red-200"
          >
            <FaTimes className="mr-1" />
            Clear Filter
          </button>
        )}
      </div>


      {isAdmin && (
        <>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            + New Post
          </button>
          {showModal && (
            <div style={modalOverlayStyle}>
              <div style={modalStyle}>
                <ReactQuill value={content} onChange={setContent} />
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-1 rounded">
                    Post
                  </button>
                  <button onClick={() => setShowModal(false)} className="bg-red-400 text-white px-4 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {[...posts]
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
        .map((post) => (
          <div key={post._id} className="relative w-full max-w-xl mx-auto mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="text-sm text-gray-500 mt-2">Author: {post.username}</div>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageBase64 && (
              <img
                src={post.imageBase64}
                alt="Post"
                className="w-full max-h-[400px] object-contain mt-3 rounded-md"
              />
            )}

            <PostActions
              postId={post._id}
              likesCount={post.likes.length}
              commentsCount={post.comments.length}
              isAdmin={isAdmin}
              pinned={post.pinned}
              onLike={() => handleLikePost(post._id)}
              onPin={() => handlePin(post._id)}
              onDelete={() => handleDelete(post._id)}
              onToggleComments={() => setShowComments(prev => !prev)}
            />

            {showComments && (
              <PostComments
                postId={post._id}
                comments={post.comments}
                commentInputs={commentInputs}
                replyInputs={replyInputs}
                setCommentInputs={setCommentInputs}
                setReplyInputs={setReplyInputs}
                handleAddComment={handleAddComment}
                handleReplyComment={handleReplyComment}
                handleLikeComment={handleLikeComment}
                handleLikeReply={handleLikeReply} />
            )}

          </div>
        ))}
    </div>
  );
};

export default Posts;
