import express from 'express';

import profile_controller from '../controllers/profileController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// User profile get
router.get('/user/:username', isAuthenticated, profile_controller.user_profile_get);

// User settings post
router.post('/settings', isAuthenticated, profile_controller.user_settings_post);

// Friend request post
router.post('/friend-request', isAuthenticated, profile_controller.friend_request_post);

// Accept friend request post
router.post('/accept-friend', isAuthenticated, profile_controller.accept_friend_request_post);

export default router;
