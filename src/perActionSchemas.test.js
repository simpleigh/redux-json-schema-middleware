import createMiddleware from '.';

const middleware = createMiddleware({
  perActionSchemas: {
    valid: { },
    invalid: {
      type: 'object',
      required: ['test']
    }
  }
});

const next = () => { };

describe('per-action schemas', () => {
  it('allows valid actions', () => {
    expect(() => {
      middleware(undefined)(next)({ type: 'valid' });
    }).not.toThrow();
  });

  it('raises an error for invalid actions', () => {
    expect(() => {
      middleware(undefined)(undefined)({ type: 'invalid' });
    }).toThrow(/data should have required property '\.test'/);
  });

  it('allows unknown actions', () => {
    expect(() => {
      middleware(undefined)(next)({ type: 'unknown' });
    }).not.toThrow();
  });
});
