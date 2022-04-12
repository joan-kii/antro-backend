import FacebookStrategy from 'passport-facebook';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../../models/userModel.js';

const randomNumber = () => {
  return Math.floor(Math.random() * 70) + 1;
};

const facebook = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CB_URL,
  profileFields: ['id', 'email', 'displayName']
  },
  (accesToken, refreshToken, profile, done) => {
    bcrypt.hash(profile.displayName, 10, (err, password) => {
      if (err) return done(err);
      const newUser = new User({
        name: profile.displayName,
        username: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: process.env.AVATAR_API + randomNumber(),
        password
      });
      User.findOne({email: newUser.email})
          .exec((err, user) => {
            if (err) return done(err);
            if (user) {
              return done(null, user);
            } else {
              User.create(newUser, (err, userCreated) => {
                if (err) return done(err);
                return done(null, userCreated);
              })
            }
          })
    });
  }
);

export default facebook;
