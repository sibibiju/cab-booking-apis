/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/**
 * Convert the response according to JSONAPI specification
 * @param {result} object The response object or array of objects
 * @param {type} string type of the resource
 * @return {object} response object according to JSONAPI specification
 */
const toJsonApi = (result, type) => {
  datajson = [];
  if (Array.isArray(result)) {
    result.forEach(function(item) {
      datajson.push({
        'type': type,
        'id': item._id,
        'attributes': item,
      });
    });
  } else if (typeof result === 'object') {
    datajson.push({
      'type': type,
      'id': result._id,
      'attributes': result,
    });
  } else {
    datajson.push({
      'type': type,
    });
  }
  return {
    'data': datajson,
  };
};

module.exports = toJsonApi;
