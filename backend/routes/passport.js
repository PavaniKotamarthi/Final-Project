const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// ✅ GitHub OAuth Strategy Setup
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  // try {
  //   const email = profile.emails[0].value;
  //   let user = await User.findOne({ email });

  //   if (!user) {
  //     user = await User.create({
  //       email,
  //       name: profile.username,
  //       provider: 'github'
  //     });
  //   }

  //   return done(null, user);
  // } catch (err) {
  //   return done(err, null);
  // }
  return done(null, profile)
}));

// ✅ GitHub login route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// ✅ GitHub callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Redirect to frontend with JWT in query string
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
