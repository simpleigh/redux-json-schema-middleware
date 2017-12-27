import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

export class ValidationError extends Error {
  constructor(data, schemaObject, errors, ...params) {
    super(Ajv.prototype.errorsText(errors), ...params);
    Error.captureStackTrace && Error.captureStackTrace(this, ValidationError);
    this.object = data;
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

  const validate = (schemaName, schemaObject, data) => {
    if (!ajv.validate(schemaName, data)) {
      throw new ValidationError(data, schemaObject, ajv.errors);
    }
  };

  return store => next => action => {
    if (config.fluxStandardAction) {
      validate('fluxStandardAction', fluxStandardActionSchema, action);
    } else {
      validate('standardAction', standardActionSchema, action);
    }

    config.actionSchema && validate('action', config.actionSchema, action);

    config.perActionSchemas[action.type] && validate(
      `action/${action.type}`,
      config.perActionSchemas[action.type],
      action
    );

    config.storeSchema && validate(
      'store',
      config.storeSchema,
      store.getState()
    );

    return next(action);
  };
};
