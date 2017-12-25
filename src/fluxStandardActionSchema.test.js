import createMiddleware from '.';
import { emptyStore, noopNext } from './testUtils';

const middleware = createMiddleware({ fluxStandardAction: true });

describe('flux standard action schema', () => {
  it('raises an error for invalid actions', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)(undefined);
    }).toThrow();
  });

  it('expects actions to be objects', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)('notaction');
    }).toThrow(/data should be object/);
  });

  it('expects actions to have a type', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ });
    }).toThrow(/data should have required property 'type'/);
  });

  it('expects the type to be a string', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ type: { } });
    }).toThrow(/data\.type should be string/);
  });

  it('allows actions to have certain additional properties', () => {
    const action = { type: 'test', error: { }, payload: { }, meta: { } };
    expect(() => {
      middleware(emptyStore)(noopNext)(action);
    }).not.toThrow();
  });

  it('raises an error for unknown additional properties', () => {
    expect(() => {
      middleware(emptyStore)(noopNext)({ unknown: { } });
    }).toThrow(/data should NOT have additional properties/);
  });
});
