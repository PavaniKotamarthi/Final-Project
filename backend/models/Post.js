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
  likes: [String],
  views: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
