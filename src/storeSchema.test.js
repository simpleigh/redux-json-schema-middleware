import createMiddleware, { ValidationError } from '.';
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
    }).toThrow();
  });

  it('throws a ValidationError', () => {
    expect(catchError(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    })).toBeInstanceOf(ValidationError);
  });

  it('provides validation information', () => {
    expect(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).toThrow('data should be object');
  });

  it('provides the failed object', () => {
    const store = createStore('notobject');
    expect(catchError(() => {
      middleware(store)(noopNext)(testAction);
    }).object).toBe(store.getState());
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(createStore('notobject'))(noopNext)(testAction);
    }).schema).toHaveProperty('type', 'object');
  });
});
