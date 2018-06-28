import * as index from '../src/index';

test('Should have Error available', () => {
  expect(index.handleError).toBeTruthy();
  expect(index.Boom).toBeTruthy();
});
