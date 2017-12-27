import Ajv from 'ajv';

import fsaSchema from './fsaSchema';

export default (config = { }) => {
  config.perActionSchemas = config.perActionSchemas || { };

  const ajv = new Ajv();
  config.fluxStandardAction && ajv.addSchema(fsaSchema, 'FSA');
  config.actionSchema && ajv.addSchema(config.actionSchema, 'action');
  config.storeSchema && ajv.addSchema(config.storeSchema, 'store');
  Object.keys(config.perActionSchemas).forEach(type => {
    ajv.addSchema(config.perActionSchemas[type], `action/${type}`);
  });

  const validate = (schema, data, objectType) => {
    const isValid = ajv.getSchema(schema);
    if (isValid && !isValid(data)) {
      const error = new Error(
        `redux-json-schema-middleware: ${objectType} did not validate`
      );
      error.errorText = ajv.errorsText(isValid.errors);
      error.object = data;
      error.objectType = objectType;
      error.schema = isValid.schema;
      throw error;
    }
  };

  const validateAction = (schema, data) => validate(schema, data, 'action');
  const validateStore = (schema, data) => validate(schema, data, 'store');

  return store => next => action => {
    validateAction('FSA', action);
    validateAction('action', action);
    validateAction(`action/${action.type}`, action);
    validateStore('store', store.getState());
    return next(action);
  };
};
