import createMiddleware from '.';

describe('standard action schema', () => {
  it('raises an error for invalid actions', () => {
    expect(() => {
      createMiddleware()(undefined)(undefined)(undefined);
    }).toThrow();
  });

  it('expects actions to be objects', () => {
    expect(() => {
      createMiddleware()(undefined)(undefined)('notaction');
    }).toThrow(/data should be object/);
  });

  it('expects actions to have a type', () => {
    expect(() => {
      createMiddleware()(undefined)(undefined)({ test: 'test' });
    }).toThrow(/data should have required property 'type'/);
  });

  it('expects the type to be a string', () => {
    expect(() => {
      createMiddleware()(undefined)(undefined)({ type: { } });
    }).toThrow(/data\.type should be string/);
  });
});
