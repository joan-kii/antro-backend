import 'babel-polyfill';
import requestTest from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../app';
import { mongoDBOn, mongoDBOff } from '../middleware/mongoConfig.js';

beforeAll(async () => await mongoDBOn());

afterAll(async () => await mongoDBOff());

// CAUTION: Write to mongoDB directly 
xdescribe('Create post', () => {
  const mockUser = requestTest.agent(app);
  it('Create post POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/post/create')
        .set('Accept', /application\/json/)
        .send({body: 'Wow... There are a lot of beautiful people here!'})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200);
          expect(res.body.message).toEqual('Post saved!');
          done();
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Add comment to post', () => {
  const mockUser = requestTest.agent(app);
  it('Add comment POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/post/add-comment')
        .set('Accept', /application\/json/)
        .query({post_id: process.env.EXAMPLE_USER_POST_ID})
        .send({body: 'Great post!'})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200)
          done();
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Add like to post', () => {
  const mockUser = requestTest.agent(app);
  it('Add like POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/post/add-like')
        .set('Accept', /application\/json/)
        .query({post_id: process.env.EXAMPLE_USER_POST_ID})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200)
          done();
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});

// CAUTION: Write to mongoDB directly 
xdescribe('Remove like from post', () => {
  const mockUser = requestTest.agent(app);
  it('Remove like POST', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.post('/post/remove-like')
        .set('Accept', /application\/json/)
        .query({post_id: process.env.EXAMPLE_USER_POST_ID})
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(200)
          done();
        }).catch((err) => {
          if (err) return done(err);
        })
      })
  });
});
