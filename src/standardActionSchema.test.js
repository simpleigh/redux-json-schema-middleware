import createMiddleware from '.';
import { catchError, emptyStore, noopNext } from './testUtils';

const middleware = createMiddleware();

describe('standard action schema', () => {
  it('throws an error for invalid actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)(undefined);
    }).toThrow();
  });

  it('provides validation information', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(undefined);
    }).errorText).toBe('data should be object');
  });

  it('provides the failed object', () => {
    const action = 'notaction';
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(action);
    }).object).toBe(action);
  });

  it('provides the failed object type (action)', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(undefined);
    }).objectType).toBe('action');
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(undefined);
    }).schema).toHaveProperty('type', 'object');
  });

  it('expects actions to be objects', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)('notaction');
    }).errorText).toBe('data should be object');
  });

  it('expects actions to have a type', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ });
    }).errorText).toBe("data should have required property 'type'");
  });

  it('expects the type to be a string', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ type: { } });
    }).errorText).toBe('data.type should be string');
  });
});
