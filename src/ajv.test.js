import Ajv from 'ajv';
import createMiddleware from '.';

describe('ajv option', () => {
  it('allows the Ajv instance to be overridden', () => {
    const ajv = new Ajv();
    jest.spyOn(ajv, 'getSchema');
    createMiddleware({ ajv });
    expect(ajv.getSchema).toHaveBeenCalled();
  });
});
