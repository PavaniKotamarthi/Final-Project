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

router.post('/api/posts/:id/like', async (req, res) => {
  const { email } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(email)) post.likes.push(email);
  await post.save();
  res.sendStatus(200);
});

router.post('/api/posts/:id/pin', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.pinned = !post.pinned;
  await post.save();
  res.sendStatus(200);
});

router.delete('/api/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.post('/api/posts/:id/comments', async (req, res) => {
  const { user, text, username } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments.push({ user, text, username });
  await post.save();
  res.sendStatus(201);
});

router.post('/api/posts/:id/comments/:commentId/replies', async (req, res) => {
  const { user, text } = req.body;
  const post = await Post.findById(req.params.id);
  const comment = post.comments.id(req.params.commentId);
  comment.replies.push({ user, text });
  await post.save();
  res.sendStatus(201);
});

// Reply to a comment
router.post('/api/posts/:postId/comments/:commentId/reply', async (req, res) => {
  const { postId, commentId } = req.params;
  const { text, author, username } = req.body;

  try {
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.replies.push({ text, author, username, likes: [] });
    await post.save();

    res.status(200).json({ message: 'Reply added successfully', comment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply', details: err.message });
  }
});

// Like a comment
router.post('/api/posts/:postId/comments/:commentId/like', async (req, res) => {
  const { postId, commentId } = req.params;
  const { userEmail } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (!comment.likes.includes(userEmail)) {
      comment.likes.push(userEmail);
      await post.save();
    }

    res.status(200).json({ message: 'Comment liked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like comment', details: err.message });
  }
});


// Like a reply
router.post('/api/posts/:postId/comments/:commentId/replies/:replyId/like', async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  const { userEmail } = req.body;

  try {
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    const reply = comment?.replies.id(replyId);

    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    if (!reply.likes.includes(userEmail)) {
      reply.likes.push(userEmail);
      await post.save();
    }

    res.status(200).json({ message: 'Reply liked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like reply', details: err.message });
  }
});


// Set up multer for image storage (optional: you can also handle custom storage)
const storage = multer.memoryStorage(); // or diskStorage if saving locally
const upload = multer({ storage });

router.post('/api/posts', async (req, res) => {
  const { content, imageBase64, username, author } = req.body;

  if (!content && !imageBase64) {
    return res.status(400).json({ message: 'Post must contain text or image.' });
  }

  const post = new Post({
    content,
    imageBase64,
    username,
    author
  });

  await post.save();
  res.status(201).json(post);
});


module.exports = router;
