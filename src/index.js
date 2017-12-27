import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

export class ValidationError extends Error {
  constructor(object, objectType, schemaObject, errors, ...params) {
    super(Ajv.prototype.errorsText(errors), ...params);
    Error.captureStackTrace && Error.captureStackTrace(this, ValidationError);
    this.object = object;
    this.objectType = objectType;
    this.schema = schemaObject;
  }
}

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
      throw new ValidationError(data, objectType, schemaObject, ajv.errors);
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
