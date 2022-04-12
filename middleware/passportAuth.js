import passport from 'passport';

import User from '../models/userModel.js';
import local from './strategies/localStragegy.js';
import facebook from './strategies/facebookStrategy.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(local);
passport.use(facebook);

export default passport;
