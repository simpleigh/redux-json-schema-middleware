import createMiddleware from '.';
import { emptyStore, testAction } from './testUtils';

describe('middleware', () => {
  it('exists', () => {
    expect(createMiddleware()).toBeDefined();
  });

  it('calls next with the provided action', () => {
    const next = jest.fn();

    createMiddleware()(emptyStore)(next)(testAction);

    expect(next.mock.calls.length).toBe(1);
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0]).toBe(testAction);
  });

  it('returns the result of calling next with the provided action', () => {
    const next = jest.fn();
    const result = { };
    next.mockReturnValue(result);

    expect(createMiddleware()(emptyStore)(next)(testAction)).toBe(result);
  });
});
