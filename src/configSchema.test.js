import createMiddleware from '.';
import { catchError } from './testUtils';

describe('config schema', () => {
  it('throws an error for invalid config', () => {
    expect(() => {
      createMiddleware('notobject');
    }).toThrow(
      "redux-json-schema-middleware: config error using schema 'config'"
    );
  });

  it('provides validation information', () => {
    expect(catchError(() => {
      createMiddleware('notobject');
    }).errorText).toBe('data should be object');
  });

  it('provides the failed object', () => {
    const config = 'notobject';
    expect(catchError(() => {
      createMiddleware(config);
    }).object).toBe(config);
  });

  it('provides the failed object type (config)', () => {
    expect(catchError(() => {
      createMiddleware('notobject');
    }).objectType).toBe('config');
  });

  it('provides the failed schema', () => {
    expect(catchError(() => {
      createMiddleware('notobject');
    }).schema).toHaveProperty('type', 'object');
  });

  it('expects actionSchema to be an object', () => {
    expect(() => {
      createMiddleware({ actionSchema: 'notobject' });
    }).toThrow();
  });

  it('expects fluxStandardAction to be a boolean', () => {
    expect(() => {
      createMiddleware({ fluxStandardAction: 'notboolean' });
    }).toThrow();
  });

  it('expects perActionSchemas to be an object', () => {
    expect(() => {
      createMiddleware({ perActionSchemas: 'notobject' });
    }).toThrow();
  });

  it('expects perActionSchemas properties to be objects', () => {
    expect(() => {
      createMiddleware({ perActionSchemas: { schema: 'notobject' } });
    }).toThrow();
  });

  it('expects storeSchema to be an object', () => {
    expect(() => {
      createMiddleware({ storeSchema: 'notobject' });
    }).toThrow();
  });
});
