const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String },
  author: { type: String, required: true },
  imageBase64: { type: String }, // base64 string
  pinned: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Post', postSchema);
