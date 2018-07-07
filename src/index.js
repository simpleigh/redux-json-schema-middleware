import Ajv from 'ajv';

import configSchema from './configSchema';
import fsaSchema from './fsaSchema';

/**
 * A JSON schema
 * @typedef {Object} Schema
 */

/**
 * Middleware configuration
 * @typedef {Object} Config
 * @property {Schema}                  actionSchema
 * @property {boolean}                 fluxStandardAction
 * @property {Object.<string, Schema>} perActionSchemas
 * @property {Schema}                  storeSchema
 */

/**
 * Middleware factory
 * @param {Config} [config]
 * @returns {function(store)} Middleware
 */
export default (config = { }) => {
  /**
   * Ajv validation object
   * @type {Ajv}
   */
  const ajv = config.ajv || new Ajv();

  /**
   * Validate an object against a schema
   * @param {string} schema     - Key for schema to use to validate the object
   * @param {Object} data       - Object to validate
   * @param {string} objectType - Type of the object (action, config or store)
   * @throws {Error} if the object does not validate against the schema
   */
  const validate = (schema, data, objectType) => {
    const isValid = ajv.getSchema(schema);
    if (isValid && !isValid(data)) {
      const error = new Error('redux-json-schema-middleware: ' +
        `${objectType} error using schema '${schema}'`
      );
      error.errorText = ajv.errorsText(isValid.errors);
      error.object = data;
      error.objectType = objectType;
      error.schema = isValid.schema;
      throw error;
    }
  };

  /**
   * Validate an action
   * @param {string} schema - Key for schema to use to validate the object
   * @param {Object} data   - Object to validate
   */
  const validateAction = (schema, data) => validate(schema, data, 'action');

  /**
   * Validate the store
   * @param {string} schema - Key for schema to use to validate the object
   * @param {Object} data   - Object to validate
   */
  const validateStore = (schema, data) => validate(schema, data, 'store');

  // Validate configuration data
  ajv.addSchema(configSchema, 'config');
  validate('config', config, 'config');

  // Add remaining schemas
  config.fluxStandardAction && ajv.addSchema(fsaSchema,           'FSA');
  config.actionSchema       && ajv.addSchema(config.actionSchema, 'action');
  config.storeSchema        && ajv.addSchema(config.storeSchema,  'store');
  Object.keys(config.perActionSchemas || { }).forEach(type => {
    ajv.addSchema(config.perActionSchemas[type], `action/${type}`);
  });

  // Return the middleware
  return store => next => action => {
    validateAction('FSA',                   action);
    validateAction('action',                action);
    validateAction(`action/${action.type}`, action);
    const result = next(action)
    validateStore('store', store.getState());
    return result;
  };
};
