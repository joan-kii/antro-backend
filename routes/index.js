import express from 'express';

import post_controller from '../controllers/postController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Home GET
router.get('/:userId', isAuthenticated,  post_controller.home_posts_list_get);

export default router;
