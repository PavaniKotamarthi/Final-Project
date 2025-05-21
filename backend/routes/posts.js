const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ <-- Add this line

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

// Get pinned posts
router.get('/getPosts/pinned', async (req, res) => {
  const posts = await Post.find({ pinned: true }).sort({ createdAt: -1 });
  res.json(posts);
});

// Get most liked posts
router.get('/getPosts/mostLiked', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          reactionsCount: { $size: '$reactions' }
        }
      },
      {
        $sort: { reactionsCount: -1, createdAt: -1 }
      },
      {
        $limit: 2
      }
    ]);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch most reacted posts' });
  }

});

// PUT route to update post content/image
router.put('/api/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content, imageBase64 } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content, imageBase64 },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

router.post('/api/posts/:id/like', async (req, res) => {
  const { email, username } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const existingLikeIndex = post.likes.findIndex(like => like?.username === username);

  console.log(post.likes);
  console.log(existingLikeIndex);

  if (existingLikeIndex === -1) {
    // Add like
    post.likes.push(req.body);
  } else {
    // Remove like
    post.likes.splice(existingLikeIndex, 1);
  }

  await post.save();
  res.status(200).json({ likes: post.likes.length });
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

// PATCH route to react to a post
router.patch('/api/posts/:postId/react', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body;
    const userEmail = req.user.email;
    const username = req.user.name;

    if (!reaction || !['like', 'love', 'laugh', 'wow'].includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Remove existing reaction by user if it exists
    post.reactions = post.reactions.filter(r => r.email !== userEmail);

    // Add new reaction
    post.reactions.push({ type: reaction, email: userEmail, name: username });

    // Recalculate reactionCounts
    const counts = { like: 0, love: 0, laugh: 0, wow: 0 };
    post.reactions.forEach(r => {
      if (counts[r.type] !== undefined) counts[r.type]++;
    });
    post.reactionCounts = counts;

    await post.save();

    res.status(200).json({
      success: true,
      reactionCounts: post.reactionCounts,
      userReaction: reaction
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// router.post('/api/posts/:postId/react', async (req, res) => {
//   const { postId } = req.params;
//   const { email, username, reaction } = req.body;

//   const post = await Post.findById(postId);
//   if (!post) return res.status(404).json({ error: 'Post not found' });

//   // Remove old reaction from this user
//   post.reactions = post.reactions.filter(r => r.email !== email);

//   // Add new one
//   post.reactions.push({ type: reaction, email, username });

//   // Compute counts
//   const reactionCounts = {
//     like: 0, love: 0, laugh: 0, wow: 0
//   };
//   for (const r of post.reactions) {
//     if (reactionCounts[r.type] !== undefined) {
//       reactionCounts[r.type]++;
//     }
//   }

//   post.reactionCounts = {...reactionCounts}

//   await post.save();

//   res.json({
//     success: true,
//     userReaction: reaction,
//     reactionCounts
//   });
// });

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
