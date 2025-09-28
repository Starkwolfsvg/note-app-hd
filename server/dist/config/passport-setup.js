import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        //if google doesn't return an email, stop the process.
        if (!email) {
            return done(new Error('Email not provided by Google'), false);
        }
        //user already exists 
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            // If user exists -next step
            return done(null, user);
        }
        else {
            // If user does not exist, check if the email is already in use
            user = await User.findOne({ email: email });
            if (user) {
                // If email is in use- return an error
                return done(new Error('This email is already registered. Please log in with your password.'), false);
            }
            // else create a new user
            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: email,
            });
            await newUser.save();
            return done(null, newUser);
        }
    }
    catch (error) {
        return done(error, false);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// ✅ Corrected Code
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
