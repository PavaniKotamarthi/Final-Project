const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: String,
  author: String,
  username: String,
  likes: [String],
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
  username: String,
  likes: [String],
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

const postSchema = new mongoose.Schema({
  content: String,
  imageBase64: String,
  author: String,
  username: String,
  pinned: { type: Boolean, default: false },
  likes: [
    {
      email: String,
      username: String
    }
  ],
  views: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  reactions: [
    {
      type: { type: String, enum: ['like', 'love', 'laugh', 'wow'] },
      email: String,
      username: String,
    }
  ],
  reactionCounts: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
    wow: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Post', postSchema);
