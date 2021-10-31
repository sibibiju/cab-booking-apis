/* eslint-disable max-len */
const distance = require('../../../src/utils/distance');

describe('Calculate distance between 2 coordinates', () => {
  const source = {
    latitude: 20,
    longitude: 70,
  };

  const destination = {
    latitude: 20.5,
    longitude: 71,
  };

  const kms = distance(source, destination);

  test('Should return KMs', () => {
    expect(kms).toBeGreaterThan(118);
  });
});
