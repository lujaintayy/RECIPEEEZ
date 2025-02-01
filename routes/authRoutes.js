const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,   // Corrected field name
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Corrected field name
    callbackURL: "http://localhost:5000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    // Here, you would usually create or update a user in your database
    return done(null, profile);
}));

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

module.exports = router;