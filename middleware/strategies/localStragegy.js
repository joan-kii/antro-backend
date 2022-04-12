import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

import User from '../../models/userModel.js';

const local = new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
  body('username', 'Username required')
    .trim()
    .isLength({min: 1, max: 12})
    .withMessage('Choose a username. Max. 10 characters.')
    .matches(/^[A-Za-z0-9 .,'?@#%$"!&]+$/)
    .withMessage('User name must have only alphanumeric characters')
    .escape(),
  body('password', 'Password required')
    .trim()
    .isLength({min: 5, max: 25})
    .withMessage('Enter a password. Between 5 and 25 characters.')
    .isAlphanumeric()
    .withMessage('Password must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError: true})});
    }
  },
  User.findOne({ username }, async (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(null, false);
    } else {
      const isUser = await bcrypt.compare(password, user.password);
      if (!isUser) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }

  });
});

export default local;
