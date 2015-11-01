/*  eslint no-unused-vars:0 */
import { expect } from 'chai';

export function handleErrors(error, request, response, next) {
  expect(error).to.be.an('error');
  const status = error.response ? error.response.status : 418;
  response.status(status).send({
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
