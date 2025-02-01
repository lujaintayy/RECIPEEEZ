const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
require('dotenv').config();

// Use Google strategy for Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback' // Change to your production URL if needed
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user in your database
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (err) return done(err);
      if (user) {
        return done(null, user); // User found
      } else {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });
        newUser.save((err) => {
          if (err) return done(err);
          return done(null, newUser);
        });
      }
    });
  }
));

// Serialize and deserialize user (for session management)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
