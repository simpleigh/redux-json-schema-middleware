import createMiddleware from '.';

const middleware = createMiddleware();

describe('actions schema', () => {
  it('calls next with valid actions', () => {
    const next = jest.fn();
    const action = { type: 'action' };

    middleware(undefined)(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0]).toBe(action);
  });

  it('raises an error for invalid actions', () => {
    expect(() => { middleware(undefined)(undefined)('notaction') }).toThrow();
  });

  it('includes validation information in the error', () => {
    expect(() => { middleware(undefined)(undefined)('notaction') }).toThrow(
      /data should be object/
    );
  });
});
