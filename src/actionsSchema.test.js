import createMiddleware from '.';

describe('actions schema', () => {
  it('calls next with valid actions', () => {
    const next = jest.fn();
    const action = { type: 'action' };

    createMiddleware()(undefined)(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0]).toBe(action);
  });

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

  it('allows the schema to be overridden', () => {
    const config = {
      actionsSchema: {
        type: 'object',
        required: ['type', 'required']
      }
    };
    const action = { type: 'test' };

    expect(() => {
      createMiddleware(config)(undefined)(undefined)(action);
    }).toThrow(/data should have required property '\.required'/);
  });
});
