import createMiddleware from '.';

const middleware = createMiddleware({
  storeSchema: {
    type: 'object'
  }
});

describe('store schema', () => {
  it('allows valid stores', () => {
    const store = { getState: () => ({ }) };
    const next = () => { };
    expect(() => {
      middleware(store)(next)({ type: 'test' });
    }).not.toThrow();
  });

  it('raises an error for invalid stores', () => {
    const store = { getState: () => 'notobject' };
    const next = () => { };
    expect(() => {
      middleware(store)(next)({ type: 'test' });
    }).toThrow(/data should be object/);
  });
});
