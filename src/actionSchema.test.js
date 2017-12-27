import createMiddleware, { ValidationError } from '.';
import { catchError, emptyStore, noopNext, testAction } from './testUtils';

const middleware = createMiddleware({
  actionSchema: {
    type: 'object',
    required: ['required']
  }
});

describe('action schema', () => {
  it('raises an error for invalid actions', () => {
    expect(() => { middleware(emptyStore)(noopNext)(testAction); }).toThrow();
  });

  it('throws a ValidationError', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(testAction);
    })).toBeInstanceOf(ValidationError);
  });

  it('provides validation information', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)(testAction);
    }).toThrow("data should have required property '.required'");
  });

  it('provides the failed object', () => {
    const action = 'notaction';
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(action);
    }).object).toBe(action);
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(testAction);
    }).schema).toHaveProperty('type', 'object');
  });
});
