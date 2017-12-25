import createMiddleware from '.';

const middleware = createMiddleware({ fluxStandardAction: true });

describe('flux standard action schema', () => {
  it('raises an error for invalid actions', () => {
    expect(() => {
      middleware(undefined)(undefined)(undefined);
    }).toThrow();
  });

  it('expects actions to be objects', () => {
    expect(() => {
      middleware(undefined)(undefined)('notaction');
    }).toThrow(/data should be object/);
  });

  it('expects actions to have a type', () => {
    expect(() => {
      middleware(undefined)(undefined)({ });
    }).toThrow(/data should have required property 'type'/);
  });

  it('expects the type to be a string', () => {
    expect(() => {
      middleware(undefined)(undefined)({ type: { } });
    }).toThrow(/data\.type should be string/);
  });

  it('allows actions to have certain additional properties', () => {
    const next = () => { };
    const action = { type: 'test', error: { }, payload: { }, meta: { } };
    expect(() => {
      middleware(undefined)(next)(action);
    }).not.toThrow();
  });

  it('raises an error for unknown additional properties', () => {
    expect(() => {
      middleware(undefined)(undefined)({ unknown: { } });
    }).toThrow(/data should NOT have additional properties/);
  });
});
