import createMiddleware from '.';
import { emptyStore, noopNext, testAction } from './testUtils';

describe('action schema', () => {
  it('can be added to the middleware', () => {
    const config = { actionSchema: { type: 'object', required: ['required'] } };
    expect(() => {
      createMiddleware(config)(emptyStore)(noopNext)(testAction);
    }).toThrow(/data should have required property '\.required'/);
  });
});
