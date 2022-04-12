import User from '../models/userModel.js';
import Comment from '../models/commentModel.js';

import { body, validationResult } from 'express-validator';

// Get User Profile 
const user_profile_get = (req, res, next) => {
  User.findOne({ username: req.params.username}, 'name username bio profilePicture userSince')
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          model: Comment,
          populate: {
            path: 'user_id',
            select: 'username profilePicture'
          }
        }
      })
      .populate({
        path: 'friends',
        populate: {
          path: 'friend',
          select: 'username profilePicture'
        }
      })
      .populate({
        path: 'friendshipRequests', 
        populate: {
          path: 'userRequest',
          select: 'username profilePicture'
        }
      })
      .exec((err, profile) => {
        if (err) res.status(400).json({
          success: false,
          message: 'Something goes wrong...', 
          error: err
        });
        if (!profile) {
          res.status(400).json({
            success: false,
            message: 'No user profile.',
            error: err
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'Found user profile.',
            payload: profile
          });
        }
      })
};

// User settings post
const user_settings_post = [
  body('bio', 'User bio')
    .trim()
    .isLength({min: 1, max: 50})
    .withMessage('Your bio must have between 1 and 50 characters.')
    .matches(/^[A-Za-z0-9 .,'?@#%$"!&]+$/)
    .withMessage('Your bio must have only alphanumeric characters.')
    .escape(),
  body('profilePicture', 'User Pic')
    .trim()
    .isLength(31),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      return next(errors);
    } else {
      const updatedProfile = {
        bio: req.body.bio, 
        profilePicture: req.body.profilePicture
      };

      User.findByIdAndUpdate(req.body.userId, updatedProfile, {new: true}, (err, updated) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'Something goes wrong...', 
            error: err
          });
        } else {
          const user = {
            username: updated.username,
            bio: updated.bio,
            profilePicture: updated.profilePicture,
            userId: updated._id,
            friends: updated.friends
          };
          res.status(200).json({
            success: true,
            message: 'Settings updated!',
            payload: user
          });
        }
      })
    }
  }
];

// Friend request
const friend_request_post = (req, res, next) => {
  User.findByIdAndUpdate(req.body.friendId,
    {$push: {'friendshipRequests': {'userRequest': req.body.userId}}}, {new: true}, (err, saved) => {
      if (err || !saved) {
        res.status(400).json({
          success: false,
          message: 'Friend request not saved!', 
          error: err
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Friend request saved!',
          payload: null
        });
      }
    });
};

// Accept friend request
const accept_friend_request_post = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId,
    {$pull: {'friendshipRequests': {'userRequest': req.body.friendId}},
      $push: {'friends': {'friend': req.body.friendId}}}, (err, saved) => {
        if (err || !saved) {
          res.status(400).json({
            success: false,
            message: 'Accept friend not saved!',
            error: err
          });
        } else {
          User.findByIdAndUpdate(req.body.friendId,
            {$push: {'friends': {'friend': req.body.userId}}}, (error, friendSaved) => {
              if (error || !friendSaved) {
                res.status(400).json({
                  success: false,
                  message: 'Accept friend not saved!',
                  error: error
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Friend accepted!',
                  payload: null
                });
              }
          });
        }
    });
};

const profileController = {
  user_profile_get,
  user_settings_post,
  friend_request_post,
  accept_friend_request_post
};

export default profileController;
