/* eslint-disable max-len */
const httpStatus = require('http-status');
const config = require('../../src/config/config');
const app = require('../../src/app');
const request = require('supertest');
const setupTestDB = require('../../src/utils/setupTestDB');
const generateToken = require('../fixtures/token.fixture');

setupTestDB();

describe('Cab Routes', () => {
  describe('GET v1/cabs', () => {
    const currentLocation = {
      latitude: 20,
      longitude: 70,
    };

    test('Should return unauthorized code if Authorization is not provided', async () => {
      const res = await request(app)
          .get('/v1/cabs')
          .query(currentLocation)
          .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        errors: [{
          code: 401,
          message: 'Unauthorized',
        }],
      });
    });

    test('Should return nearby cabs', async () => {
      const token = await generateToken();
      const res = await request(app)
          .get('/v1/cabs')
          .query(currentLocation)
          .set('Authorization', token)
          .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        data: expect.any(Array),
      });
    });
  });

  describe('POST v1/cabs/book', () => {
    test('Should return unauthorized code if Authorization header not provided', async () => {
      const res = await request(app)
          .post('/v1/cabs/book')
          .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        errors: [{
          code: 401,
          message: 'Unauthorized',
        }],
      });
    });

    test('Should return status 200 on successful booking', async () => {
      const token = await generateToken();

      const data = await request(app)
          .get('/v1/cabs')
          .query({
            latitude: 20,
            longitude: 70,
          })
          .expect(httpStatus.OK)
          .set('Authorization', token);

      if (data.length && data[0]) {
        const cabId = data[0].id;
        const res = await request(app)
            .post('/v1/cabs/book')
            .set('Authorization', token)
            .send({cabId: cabId})
            .expect(httpStatus.OK);


        expect(res.body).toEqual({
          'bookingStatus': 'success',
        });
      }
    });
  });
});
