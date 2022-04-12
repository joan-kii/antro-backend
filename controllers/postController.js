import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';

import { body, validationResult } from 'express-validator';

// Home posts feed
const home_posts_list_get = (req, res, next) => {
  Post.find({}, null, {sort: {timestamp: -1}})
      .populate('user_id', 'username profilePicture')
      .populate({
        path: 'comments',
        model: Comment,
        populate: {
          path: 'user_id',
          select: 'username profilePicture'
        }
      })
      .exec((err, feed) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Something goes wrong...', 
            error: err
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Feed!',
            payload: feed
          });
        }
  })
};

// Create new post
const create_post = [
  body('body', 'Post content')
    .trim()
    .isLength({min: 3, max: 1000})
    .withMessage('The post must have beetwen 3 and 1000 caharacters.')
    .matches(/^[A-Za-z0-9 .,'?@#%$"!&]+$/)
    .withMessage('The post must have only alphanumeric characters.')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Something goes wrong...',
        error: errors.array({onlyFirstError: true})
      })
    } else {
      const post = new Post({
        body: req.body.body,
        user_id: req.body.userId
      }).save((err, post) => {
        if (err || !post) {
          res.status(400).json({
            success: false,
            message: 'Post not saved!',
            error: err
          });
        } else {
          User.findByIdAndUpdate(req.body.userId, 
            {$push: {posts: post._id}}, (error, saved) => {
            if (error || !saved) {
              res.status(400).json({
                success: false,
                message: 'Post not saved!',
                error: error
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Post saved!', 
                payload: null
              });
            }
          })
        }
      })
    }
  }
];

// Delete post and comments
const delete_post = (req, res, next) => {
  Post.findByIdAndDelete(req.body.postId, (err, postDeleted) => {
    if (err) res.status(400).json({
      success: false,
      message: 'Something goes wrong...',
      error: err
    });
    if (!postDeleted) {
      res.status(400).json({
        success: false,
        message: 'Post not deleted!', 
        error: err
      });
    } else {
      Comment.deleteMany({_id: {$in: req.body.comments}}, (error, result) => {
        if (error) res.status(400).json({
          success: false,
          message: 'Something goes wrong...',
          error: error
        });
        if (!result) {
          res.status(400).json({
            success: false,
            message: 'Comments not deleted!', 
            error: error
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'Post and comments deleted', 
            payload: null
          });
        }
      })
    }
  })
};

// Add comment
const add_comment_post = [
  body('comment', 'Comment')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('The post must have beetwen 1 and 100 caharacters.')
    .matches(/^[A-Za-z0-9 .,'?@#%$"!&]+$/)
    .withMessage('The comment must have only alphanumeric characters.')
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
      const comment = new Comment({
        body: req.body.comment,
        user_id: req.body.userId,
        post_id: req.body.postId
      }).save((err, saved) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Comment not saved!',
            error: err
        });
        } else {
          Post.findByIdAndUpdate(req.body.postId, 
            {$push: {"comments": saved}}, 
            {new: true}, (error, post) => {
              if (error || !post) {
                res.status(400).json({
                  success: false,
                  message: 'Comment not added to post!',
                  error: error
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Comment added to post!',
                  payload: null
                });
              }
            });
        }
      })
    }
  }
];

// Add like
const add_like_post = (req, res, next) => {
  Post.findByIdAndUpdate(req.body.postId,
    {$push: {"likes": req.body.userId}}, (err, saved) => {
      if (err || !saved) {
        res.status(400).json({
          success: false,
          message: 'Like not added!',
          error: err
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Like added!',
          payload: null
        });
      }
    });
};

// Remove like
const remove_like_post = (req, res, next) => {
  Post.findByIdAndUpdate(req.body.postId,
    {$pull: {"likes": req.body.userId}}, (err, saved) => {
      if (err || !saved) {
        res.status(400).json({
          success: false,
          message: 'Like not removed!',
          error: err
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Like removed!',
          payload: null
        });
      }
    });
};

const postController = {
  home_posts_list_get,
  create_post,
  add_comment_post,
  add_like_post,
  remove_like_post,
  delete_post
};

export default postController;
