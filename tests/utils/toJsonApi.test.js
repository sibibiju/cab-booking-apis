/* eslint-disable max-len */
const toJsonApi = require('../../src/utils/toJsonApi');

describe('JSON API converter', () => {
  describe('convert response to JSON API spec', () => {
    test('should convert object to valid format', () => {
      const response = {
        _id: 1,
        name: 'ABC',
        age: 25,
      };

      const type = 'user';
      const result = toJsonApi(response, type);
      expect(result).toMatchObject({
        data: [
          {
            type: type,
            id: response._id,
          },
        ],
      });
    });

    test('should convert array of objects', () => {
      const response = [{
        _id: 1,
        name: 'ABC',
        age: 25,
      },
      {
        _id: 1,
        name: 'ABC',
        age: 25,
      },
      ];

      const type = 'user';
      const result = toJsonApi(response, type);
      console.log(result);

      expect(result).toMatchObject({
        data: [
          {
            type: type,
            id: response[0]._id,
          },
          {
            type: type,
            id: response[1]._id,
          },
        ],
      });
    });
  });
});
