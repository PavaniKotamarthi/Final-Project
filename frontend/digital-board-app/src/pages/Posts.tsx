import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

interface Post {
  _id: string;
  content: string;
  imageBase64?: string; // changed from imageUrl
  author: string;
  pinned: boolean;
  likes: number;
  views: number;
  comments: { text: string; createdAt: string }[];
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  role: string; // e.g. G7, G8, etc.
}

const Posts: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const isAdmin = user.role === "G7" || user.role === "G8";

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/getPosts");
    setPosts(res.data);
  };

  const handleSubmit = async () => {
    const postData = {
        content,
        imageBase64: image, // renamed from imageUrl
        author: user.email,
    };

    await axios.post("http://localhost:5000/api/posts", postData);
    setContent("");
    setImage(null);
    fetchPosts();
  };


  const handleLike = async (postId: string) => {
    await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
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
 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setImage(reader.result as string); // base64 string
        };
        reader.readAsDataURL(file); // this converts image to base64
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>

      {isAdmin && (
        <div>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={handleSubmit}>Post</button>
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p>No Posts to view</p>
        ) : (
          [...posts]
            .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
            .map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.imageBase64 && <img src={post.imageBase64} alt="Post" style={{ maxWidth: "200px" }} />}
                <p>Author: {post.author}</p>
                <p>Likes: {post.likes} | Views: {post.views}</p>
                <button onClick={() => handleLike(post._id)}>Like</button>
                {isAdmin && (
                  <>
                    <button onClick={() => handlePin(post._id)}>Pin</button>
                    <button onClick={() => handleDelete(post._id)}>Delete</button>
                  </>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Posts;
