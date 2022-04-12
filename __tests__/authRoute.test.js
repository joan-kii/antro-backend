import 'babel-polyfill';
import requestTest from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../app';
import { mongoDBOn, mongoDBOff } from '../middleware/mongoConfig.js';

beforeAll(async () => await mongoDBOn());

afterAll(async () => await mongoDBOff());

// Test User login
xdescribe('User login works fine', () => {
  it('Correct username and password login', (done) => {
    requestTest(app)
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      })
      .set('Accept', /application\/json/)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ 
        message: 'User logged!',
        username: process.env.EXAMPLE_USER_USERNAME,
        userId: process.env.EXAMPLE_USER_ID
      }, done)
  });
});

// Test Facebook login
xdescribe('Facebook login redirect to facebook login page', () => {
  it('Redirect properly', (done) => {
    requestTest(app)
      .get('/auth/facebook-login')
      .expect(302)
      .expect('Location', /^https:\/\/www.facebook.com/)
      .end(done)
  })
});

// Test change password
xdescribe('Change password works fine', () => {
  it('Correct user email input', (done) => {
    requestTest(app)
      .post('/auth/change-password')
      .type('form')
      .send({
        email: process.env.EXAMPLE_USER_EMAIL
      })
      .set('Accept', /application\/json/)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ message: 'This is just a fake feature...' }, done)
  });
});

// User logout
xdescribe('User logout works properly', () => {
  it('GET auth/logout', (done) => {
    requestTest(app)
      .get('/auth/logout')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ message: 'User already logged out!'}, done)
  });
});
