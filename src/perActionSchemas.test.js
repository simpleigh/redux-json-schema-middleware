import createMiddleware from '.';
import { emptyStore, noopNext } from './testUtils';

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

  it('raises an error for invalid actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'invalid' });
    }).toThrow(/data should have required property '\.test'/);
  });

  it('allows unknown actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: 'unknown' });
    }).not.toThrow();
  });
});
