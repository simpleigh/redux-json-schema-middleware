import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

export default (config = { }) => {
  const ajv = new Ajv();

  ajv.addSchema(standardActionSchema, 'standardActionSchema');
  ajv.addSchema(fluxStandardActionSchema, 'fluxStandardActionSchema');
  ajv.addSchema(config.actionSchema || { }, 'actionSchema');
  ajv.addSchema(config.storeSchema || { }, 'storeSchema');

  for (let type in config.perActionSchemas) {
    ajv.addSchema(config.perActionSchemas[type], `action/${type}`);
  }

  return store => next => action => {
    if (config.fluxStandardAction) {
      if (!ajv.validate('fluxStandardActionSchema', action)) {
        throw new Error(ajv.errorsText(ajv.errors));
      }
    } else {
      if (!ajv.validate('standardActionSchema', action)) {
        throw new Error(ajv.errorsText(ajv.errors));
      }
    }

    if (config.actionSchema && !ajv.validate('actionSchema', action)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }

    if (config.perActionSchemas && config.perActionSchemas[action.type]) {
      if (!ajv.validate(`action/${action.type}`, action)) {
        throw new Error(ajv.errorsText(ajv.errors));
      }
    }

    if (config.storeSchema && !ajv.validate('storeSchema', store.getState())) {
      throw new Error(ajv.errorsText(ajv.errors));
    }

    return next(action);
  };
};
