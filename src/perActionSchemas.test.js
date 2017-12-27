import createMiddleware, { ValidationError } from '.';
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

  it('throws a ValidationError', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    })).toBeInstanceOf(ValidationError);
  });

  it('provides validation information', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).toThrow("data should have required property '.test'");
  });

  it('provides the failed object', () => {
    const action = { type: 'invalid' };
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(action);
    }).object).toBe(action);
  });

  it('allows unknown actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'unknown' });
    }).not.toThrow();
  });
});
