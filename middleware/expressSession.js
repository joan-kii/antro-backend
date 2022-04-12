import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const expressSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
});

export default expressSession;
