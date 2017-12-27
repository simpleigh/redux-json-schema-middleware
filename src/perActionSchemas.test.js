import createMiddleware from '.';
import { catchError, emptyStore, noopNext } from './testUtils';

const middleware = createMiddleware({
  perActionSchemas: {
    valid: { },
    invalid: {
      type: 'object',
      required: ['test']
    }
  }
});

describe('per-action schemas', () => {
  it('allows valid actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'valid' });
    }).not.toThrow();
  });

  it('throws an error for invalid actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).toThrow();
  });

  it('provides validation information', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).errorText).toBe("data should have required property '.test'");
  });

  it('provides the failed object', () => {
    const action = { type: 'invalid' };
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(action);
    }).object).toBe(action);
  });

  it('provides the failed object type (action)', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).objectType).toBe('action');
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).schema).toHaveProperty('type', 'object');
  });

  it('allows unknown actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'unknown' });
    }).not.toThrow();
  });
});
