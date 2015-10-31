/*  eslint no-unused-vars:0 */
import { expect } from 'chai';

export function handleErrors(error, request, response, next) {
  expect(error).to.be.an('error');
  response.status(400).send({
    message: error.message,
    stack: error.stack,
  });
}

export function wrap(asyncHandler) {
  return async (request, response, next) => {
    try {
      return await asyncHandler(request, response, next);
    } catch (ex) {
      next(ex);
    }
  };
}
