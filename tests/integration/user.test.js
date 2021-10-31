/* eslint-disable max-len */
const httpStatus = require('http-status');
const config = require('../../src/config/config');
const app = require('../../src/app');
const request = require('supertest');
const setupTestDB = require('../../src/utils/setupTestDB');
const generateToken = require('../fixtures/token.fixture');

setupTestDB();

describe('User routes', () => {
  describe('POST v1/users/login', () => {
    const validUser = {
      email: 'terrill71@yahoo.com',
      password: 'Random@123',
    };

    const invalidUser = {
      email: 'abc@rxample.com',
      password: 'Random@123',
    };

    test('Should return unauthorized code for invalid credentials', async () => {
      const res = await request(app)
          .post('/v1/users/login')
          .send(invalidUser)
          .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        errors: [{
          code: 401,
          message: 'Incorrect email or password',
        }],
      });
    });

    test('Should return user & accesstoken for authorized users', async () => {
      const res = await request(app)
          .post('/v1/users/login')
          .send(validUser)
          .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        data: [{
          attributes: {
            user: expect.any(Object),
            tokens: expect.any(Object),
          },
        }],
      });
    });
  });

  describe('GET v1/users/booking-history', () => {
    test('Should return unauthorized code if Authorization header not provided', async () => {
      const res = await request(app)
          .get('/v1/users/booking-history')
          .expect(httpStatus.UNAUTHORIZED);
    });

    test('Should return booking history', async () => {
      const token = await generateToken();

      const res = await request(app)
          .get('/v1/users/booking-history')
          .expect(httpStatus.OK)
          .set('Authorization', token);

      expect(res.body).toMatchObject({
        data: expect.any(Array),
      });
    });
  });
});
