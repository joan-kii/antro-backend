import express from 'express';

import post_controller from '../controllers/postController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Create new post
router.post('/create', isAuthenticated, post_controller.create_post);

// Delete post
router.post('/delete', isAuthenticated, post_controller.delete_post);

// Add comment to post
router.post('/add-comment', isAuthenticated, post_controller.add_comment_post);

// Add like to post
router.post('/add-like', isAuthenticated, post_controller.add_like_post);

// Remove like from post
router.post('/remove-like', isAuthenticated, post_controller.remove_like_post);

export default router;
