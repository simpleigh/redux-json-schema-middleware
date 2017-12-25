import createMiddleware from '.';
import { createStore, noopNext, testAction } from './testUtils';

const middleware = createMiddleware({
  storeSchema: {
    type: 'object'
  }
});

describe('store schema', () => {
  it('allows valid stores', () => {
    expect(() => {
      middleware(createStore({ }))(noopNext)(testAction);
    }).not.toThrow();
  });

  it('raises an error for invalid stores', () => {
    expect(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).toThrow(/data should be object/);
  });
});
