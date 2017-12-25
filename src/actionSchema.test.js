import createMiddleware from '.';

describe('action schema', () => {
  it('can be added to the middleware', () => {
    const config = { actionSchema: { type: 'object', required: ['required'] } };
    const action = { type: 'test' };

    expect(() => {
      createMiddleware(config)(undefined)(undefined)(action);
    }).toThrow(/data should have required property '\.required'/);
  });
});
