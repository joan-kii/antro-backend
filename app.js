import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import createError from 'http-errors';
import cors from 'cors';
import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import profileRouter from './routes/profile.js';
import expressSession from './middleware/expressSession.js';

const app = express();

app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true}));

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);

// Errors
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status);
  res.json(err);
});

export default app;
