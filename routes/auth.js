import express from 'express';
import passport from '../middleware/passportAuth.js';

import user_controller from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Wake up server
router.get('/wakeup', (req, res, next) => res.status(200).json({
  success: true,
  message: 'Ready!', 
  payload: null
  })
);

// User Log In
router.post('/login', passport.authenticate('local'), user_controller.login_user_post);

// User Email Sign Up
router.post('/signup', user_controller.signup_user_post);

// Facebook User Login
router.get('/facebook-login', passport.authenticate('facebook'));

router.get('/facebook-redirect', passport.authenticate('facebook'), user_controller.facebook_user_login_get);

// Change User Password
router.post('/change-password', isAuthenticated, user_controller.changePassword_post);

// User Logout
router.get('/logout', isAuthenticated, user_controller.logout_user_get);

export default router;
