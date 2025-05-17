const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

dotenv.config();

const app = express();

// ✅ Create HTTP server instance
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/', postsRoutes); // prefixed route

// ✅ Integrate WebSocket
require('./routes/messages')(server); // changed path if needed

// ✅ Start server once
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
