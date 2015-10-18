import {expect} from 'chai';
import {Router} from 'express';

export function handleError(response, {error}) {
  expect(error).to.be.an('error');
  response.status(400).send({
    message: error.message,
    stack: error.stack
  });
}

export function makeRouter() {
  return Router({ mergeParams: true });
}

export function trace(thing) {
  console.log(thing);
  return thing;
}
