import createMiddleware from './index';

describe('middleware', () => {
  it('exists', () => {
    expect(createMiddleware()).toBeDefined();
  });

  it('calls next with the provided action', () => {
    const next = jest.fn();
    const action = { };

    createMiddleware()(undefined)(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0]).toBe(action);
  });

  it('returns the result of calling next with the provided action', () => {
    const next = jest.fn();
    const result = { };
    next.mockReturnValue(result);

    expect(createMiddleware()(undefined)(next)(undefined)).toBe(result);
  });
});
