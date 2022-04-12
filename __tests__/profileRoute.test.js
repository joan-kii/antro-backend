import 'babel-polyfill';
import requestTest from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../app';
import { mongoDBOn, mongoDBOff } from '../middleware/mongoConfig.js';

beforeAll(async () => await mongoDBOn());

afterAll(async () => await mongoDBOff());

xdescribe('Get user data and posts', () => {
  it('user profile GET', (done) => {
    requestTest(app)
      .get('/profile/user/' + process.env.EXAMPLE_USER_USERNAME)
      .set('Accept', /application\/json/)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('posts')
        done()
      });
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Change authenticated user settings', () => {
  const mockUser = requestTest.agent(app);
  const newBio = 'Just an amazing bio!';
  it('change user bio POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/profile/settings')
        .set('Accept', /application\/json/)
        .send({bio: newBio})
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('bio')
          expect(res.body.bio).toEqual(newBio)
          done()
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Friend request', () => {
  const mockUser = requestTest.agent(app);
  it('friend request POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/profile/friend-request')
        .set('Accept', /application\/json/)
        .query({username: process.env.EXAMPLE_USER_USERNAME})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200)
          done()
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Accept friend request', () => {
  const mockUser = requestTest.agent(app);
  it('accept friend request POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/profile/accept-friend')
        .set('Accept', /application\/json/)
        .query({user_id: process.env.EXAMPLE_USER_ID})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200)
          done()
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});
