const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const multer = require('multer');

// Create Post
router.post('/create', async (req, res) => {
  const { content, author } = req.body;
  const post = new Post({ content, author });
  await post.save();
  res.json(post);
});

// Get All Posts (sorted with pinned first)
router.get('/getPosts', async (req, res) => {
  const posts = await Post.find().sort({ pinned: -1, createdAt: -1 });
  res.json(posts);
});

// Like Post
router.patch('/like/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(post);
});

// Comment
router.patch('/comment/:id', async (req, res) => {
  const { text } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: { text, createdAt: new Date() } }
  }, { new: true });
  res.json(post);
});

// Pin Post
router.patch('/pin/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { pinned: true }, { new: true });
  res.json(post);
});

// Delete Post
router.delete('delete/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
});

// Set up multer for image storage (optional: you can also handle custom storage)
const storage = multer.memoryStorage(); // or diskStorage if saving locally
const upload = multer({ storage });

router.post('/api/posts', async (req, res) => {
  const { content, imageBase64, author } = req.body;

  if (!content && !imageBase64) {
    return res.status(400).json({ message: 'Post must contain text or image.' });
  }

  const post = new Post({
    content,
    imageBase64,
    author
  });

  await post.save();
  res.status(201).json(post);
});


module.exports = router;
