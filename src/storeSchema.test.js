import createMiddleware from '.';
import { catchError, createStore, noopNext, testAction } from './testUtils';

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

  it('throws an error for invalid stores', () => {
    expect(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).toThrow(
      "redux-json-schema-middleware: store error using schema 'store'"
    );
  });

  it('provides validation information', () => {
    expect(catchError(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).errorText).toBe('data should be object');
  });

  it('provides the failed object', () => {
    const store = createStore('notobject');
    expect(catchError(() => {
      middleware(store)(noopNext)(testAction);
    }).object).toBe(store.getState());
  });

  it('provides the failed object type (store)', () => {
    expect(catchError(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).objectType).toBe('store');
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).schema).toHaveProperty('type', 'object');
  });

  it('calls next() before calling getState()', () => {
    let nextCalled = false;
    const next = jest.fn(() => { nextCalled = true; });

    const getState = jest.fn(() => {
      if (!nextCalled) {
        fail();
      }
      return { };
    });
    const store = { getState };

    middleware(store)(next)(testAction);
  });
});
