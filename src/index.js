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

  const validate = (schema, data) => {
    if (!ajv.validate(schema, data)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }
  };

  return store => next => action => {
    if (config.fluxStandardAction) {
      validate('fluxStandardAction', action);
    } else {
      validate('standardAction', action);
    }

    config.actionSchema && validate('action', action);
    config.perActionSchemas[action.type] &&
      validate(`action/${action.type}`, action);
    config.storeSchema && validate('store', store.getState());

    return next(action);
  };
};
