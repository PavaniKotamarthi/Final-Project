import { useState, useMemo } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

// Toolbar configuration with image upload
const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

function imageHandler(this: any) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Replace with your backend endpoint
      const res = await axios.post('http://localhost:5000/api/posts/upload-image', formData);
      const imageUrl = res.data.url;

      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'image', imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };
}

const ChatInput = ({ onPost }: { onPost: () => void }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!content.trim()) return;

    await axios.post('http://localhost:5000/api/posts/create',
      { content },
      { headers: { Authorization: `Bearer ${token}` } });

    setContent('');
    onPost();
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="Write your post here..."
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit Post</button>
    </div>
  );
};

export default ChatInput;
