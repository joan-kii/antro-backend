import 'babel-polyfill';
import requestTest from 'supertest';

import app from '../app';
import { mongoDBOn, mongoDBOff } from '../middleware/mongoConfig.js';

beforeAll(async () => await mongoDBOn());

afterAll(async () => await mongoDBOff());

// Test user feed
xdescribe('User feed works fine', () => {
  const mockUser = requestTest.agent(app);
  it('user fedd GET', (done) => {
    mockUser
      .post('/auth/login')
      .type('form')
      .send({
        username: process.env.EXAMPLE_USER_USERNAME,
        password: process.env.EXAMPLE_USER_PASSWORD
      }).then(async () => {
        return mockUser.get('/')
        .set('Accept', /application\/json/)
        .expect('Content-Type', /json/)
        .then((res) => {
          console.log(res.body)
          expect(200)
          expect(res.body).toEqual(
            expect.any(Object));
            done();
        }).catch((err) => {
          return done(err);
        })
      })
  })
});
