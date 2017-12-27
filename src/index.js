import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

export default (config = { }) => {
  config.perActionSchemas = config.perActionSchemas || { };

  const ajv = new Ajv();
  ajv.addSchema(standardActionSchema, 'standardAction');
  ajv.addSchema(fluxStandardActionSchema, 'fluxStandardAction');
  config.actionSchema && ajv.addSchema(config.actionSchema, 'action');
  config.storeSchema && ajv.addSchema(config.storeSchema, 'store');
  Object.keys(config.perActionSchemas).forEach(type => {
    ajv.addSchema(config.perActionSchemas[type], `action/${type}`);
  });

  const validate = (schemaName, schemaObject, objectType, data) => {
    if (schemaObject && !ajv.validate(schemaName, data)) {
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

    validate(
      'action',
      config.actionSchema,
      'action',
      action
    );

    validate(
      `action/${action.type}`,
      config.perActionSchemas[action.type],
      'action',
      action
    );

    validate(
      'store',
      config.storeSchema,
      'store',
      store.getState()
    );

    return next(action);
  };
};
