/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

/**
 * Get distance from coordinates
 * @param {source} object latitude & longitude of source
 * @param {destination} object latitude & longitude of destination
 * @return {distance} distance in KM
 */
const getDistance = (source, destination) => {
  const lat1 = source.latitude;
  const lon1 = source.longitude;
  const lat2 = destination.latitude;
  const lon2 = destination.longitude;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1); // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

module.exports = getDistance;
