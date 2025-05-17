const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: String,
  author: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);

