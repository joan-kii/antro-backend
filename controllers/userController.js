import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/userModel.js';

// Email user signup
const signup_user_post = [
  body('name', 'User name required.')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Enter your complete name. Max. 30 characters.')
    .matches(/^[a-z ]+$/i)
    .withMessage('User name must have only alphanumeric characters')
    .escape(),
  body('username', 'Username required')
    .trim()
    .isLength({min: 1, max: 12})
    .withMessage('Choose a username. Max. 10 characters.')
    .isAlphanumeric()
    .withMessage('User name must have only alphanumeric characters')
    .custom(async (username) => {
      const checkUsername = await User.findOne({username});
      if (checkUsername) return Promise.reject('Username already in use.');
      return Promise.resolve();
    })
    .withMessage('This username is already in use. Please, choose another username.')
    .escape(),
  body('email', 'User email required.')
    .trim()
    .isLength({min: 8, max: 30})
    .withMessage('Enter your email. Max. 30 characters.')
    .isEmail()
    .withMessage('User email must have email format.')
    .normalizeEmail({gmail_remove_dots: false})
    .custom(async (email) => {
      const checkEmail = await User.findOne({email});
      if (checkEmail) return Promise.reject('Email already in use.');
      return Promise.resolve();
    })
    .withMessage('This email is already in use. Please, enter another email.')
    .escape(),
  body('password', 'Password required')
    .trim()
    .isLength({min: 5, max: 15})
    .withMessage('Enter a password. Between 5 and 15 characters.')
    .isAlphanumeric()
    .withMessage('Password must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Something goes wrong...',
        error: errors.array({onlyFirstError: true})
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Encryption error.',
            error: err
          })
        } else {
          const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.profilePicture
          }).save((err, user) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'User not created', 
                error: err});
            } else {
              const payloadUser = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
              };
              res.status(200).json({
                success: true,
                message: 'User created', 
                payload: payloadUser
              });
            }
          })
        }
      })
    }
  }
];

// User login
const login_user_post = (req, res, next) => {
  const user = {
    username: req.user.username,
    bio: req.user.bio,
    profilePicture: req.user.profilePicture,
    userId: req.user._id
  };
  res.status(200).json({
    success: true,
    message: 'User logged!',
    payload: user
  });
};

// Logout user
const logout_user_get = (req, res, next) => {
  req.logout();
  res.status(200).json({
    success: true, 
    message: 'User already logged out!',
    payload: null
  });
};
 
// Change user password
const changePassword_post = [
  body('email', 'User email required.')
    .trim()
    .isLength({min: 8, max: 30})
    .withMessage('Enter your email. Max. 30 characters.')
    .isEmail()
    .withMessage('User email must have email format.')
    .normalizeEmail({gmail_remove_dots: false})
    .custom(async (email) => {
      const checkEmail = await User.findOne({email});
      if (!checkEmail) return Promise.reject('There is no user with this email.');
      return Promise.resolve();
    })
    .withMessage('There is no user with this email. Please, enter another email.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        suucess: false,
        message: errors.array({onlyFirstError: true}),
        payload: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'This is just a fake feature...',
        payload: null
      })
    }
  }
];

// Facebook user login
const facebook_user_login_get = (req, res, next) => {
  let param1 = encodeURIComponent(req.user.username);
  const url = process.env.CLIENT_URL + '/access' + '/?name=' + param1;
  res.redirect(url);
};

const userController = { 
  signup_user_post, 
  login_user_post, 
  changePassword_post,
  facebook_user_login_get,
  logout_user_get
};

export default userController;
