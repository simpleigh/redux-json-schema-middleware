import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

export default (config = { }) => {
  config.actionSchema = config.actionSchema || { };
  config.perActionSchemas = config.perActionSchemas || { };
  config.storeSchema = config.storeSchema || { };

  const ajv = new Ajv();
  ajv.addSchema(standardActionSchema, 'standardAction');
  ajv.addSchema(fluxStandardActionSchema, 'fluxStandardAction');
  ajv.addSchema(config.actionSchema, 'action');
  Object.keys(config.perActionSchemas).forEach(type => {
    ajv.addSchema(config.perActionSchemas[type], `action/${type}`);
  });
  ajv.addSchema(config.storeSchema, 'store');

  const validate = (schemaName, schemaObject, objectType, data) => {
    if (!ajv.validate(schemaName, data)) {
      const error = new Error(
        `redux-json-schema-middleware: ${objectType} did not validate`
      );
      error.errorText = ajv.errorsText(ajv.errors);
      error.object = data;
      error.objectType = objectType;
      error.schema = schemaObject;
      throw error;
    }
  };

  return store => next => action => {
    if (config.fluxStandardAction) {
      validate(
        'fluxStandardAction',
        fluxStandardActionSchema,
        'action',
        action
      );
    } else {
      validate(
        'standardAction',
        standardActionSchema,
        'action',
        action
      );
    }

    config.actionSchema && validate(
      'action',
      config.actionSchema,
      'action',
      action
    );

    config.perActionSchemas[action.type] && validate(
      `action/${action.type}`,
      config.perActionSchemas[action.type],
      'action',
      action
    );

    config.storeSchema && validate(
      'store',
      config.storeSchema,
      'store',
      store.getState()
    );

    return next(action);
  };
};
