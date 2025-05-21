const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const passportRoutes = require('./routes/passport');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const Employee = require('./models/Employee');
const User = require('./models/User');
const skillsRoutes = require('./routes/skills');


dotenv.config();

const app = express();

// ✅ Create HTTP server instance
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // allow both ports
  credentials: true
}));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Handle user logic
  try {
    // If emails are available, use them. If not, fail.
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;;

    if (!email) {
      console.error('No email returned from GitHub profile:', profile);
      return done(new Error('No email associated with this GitHub account.'));
    }

    let employee = await Employee.findOne({ email });

    if (!employee) {
      return
    }
    else {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          name: profile.username,
          password: 'oauth-no-password',
          provider: 'github'
        });
      }
      return done(null, user);
    }

  } catch (err) {
    return done(err, null);
  }
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Redirect to frontend with token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Redirect to frontend with JWT in query string
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

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
app.use('/auth', passportRoutes);
app.use('/api/skills', skillsRoutes);

// ✅ Integrate WebSocket
require('./routes/messages')(server); // changed path if needed

// ✅ Start server once
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
