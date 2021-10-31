/* eslint-disable max-len */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const {errorConverter, errorHandler} = require('../../src/middlewares/error');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const logger = require('../../src/config/logger');

describe('Error handling middlewares', () => {
  describe('Error converter', () => {
    test('should return the same ApiError status & message it was called with', () => {
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Random error generated');
      const next = jest.fn();
      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('should convert an Error to ApiError', () => {
      const error = new Error('Random error generated');
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();
      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.BAD_REQUEST,
            message: expect.any(String),
          }),
      );
    });

    test('should convert an Error without status to ApiError with status 500', () => {
      const error = new Error('Any error');
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
          }),
      );
    });

    test('should convert a Mongoose error to ApiError with status 400 and preserve its message', () => {
      const error = new mongoose.Error('Any mongoose error');
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.BAD_REQUEST,
            message: error.message,
          }),
      );
    });

    test('should convert any other object to ApiError with status 500 and its message', () => {
      const error = {};
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
            isOperational: false,
          }),
      );
    });

    describe('Error handler', () => {
      beforeEach(() => {
        jest.spyOn(logger, 'error').mockImplementation(() => {});
      });

      test('should send proper error response', () => {
        const error = new ApiError(httpStatus.BAD_REQUEST, 'Random error');
        const res = httpMocks.createResponse();
        const sendSpy = jest.spyOn(res, 'send');

        errorHandler(error, httpMocks.createRequest(), res);
        const expectedResponse = {
          errors: [{
            code: error.statusCode,
            message: error.message,
          }],
        };

        expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining(expectedResponse));
      });

      test('should put the error stack in the response if in development mode', () => {
        config.env = 'development';
        const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
        const res = httpMocks.createResponse();
        const sendSpy = jest.spyOn(res, 'send');

        errorHandler(error, httpMocks.createRequest(), res);
        const expectedResponse = {
          errors: [{
            code: error.statusCode,
            message: error.message,
            stack: error.stack,
          }],
        };
        expect(sendSpy).toHaveBeenCalledWith(
            expect.objectContaining(expectedResponse),
        );
        config.env = process.env.NODE_ENV;
      });

      test('should send internal server error status and message if in production mode', () => {
        config.env = 'production';
        const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error', false);
        const res = httpMocks.createResponse();
        const sendSpy = jest.spyOn(res, 'send');

        errorHandler(error, httpMocks.createRequest(), res);
        const expectedResponse = {
          errors: [{
            code: httpStatus.INTERNAL_SERVER_ERROR,
            message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
          }],
        };
        expect(sendSpy).toHaveBeenCalledWith(expectedResponse);
        config.env = process.env.NODE_ENV;
      });
    });
  });
});
