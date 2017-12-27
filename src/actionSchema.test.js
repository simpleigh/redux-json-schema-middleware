import createMiddleware from '.';
import { catchError, emptyStore, noopNext, testAction } from './testUtils';

const middleware = createMiddleware({
  actionSchema: {
    type: 'object',
    required: ['required']
  }
});

describe('action schema', () => {
  it('raises an error for invalid actions', () => {
    expect(() => { middleware(emptyStore)(noopNext)(testAction); }).toThrow(
      "redux-json-schema-middleware: action error using schema 'action'"
    );
  });

  it('provides validation information', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(testAction);
    }).errorText).toBe("data should have required property '.required'");
  });

  it('provides the failed object', () => {
    const action = 'notaction';
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(action);
    }).object).toBe(action);
  });

  it('provides the failed object type (action)', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(testAction);
    }).objectType).toBe('action');
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      middleware(emptyStore)(noopNext)(testAction);
    }).schema).toHaveProperty('type', 'object');
  });
});
