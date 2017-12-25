import Ajv from 'ajv';

import { standardActionSchema, fluxStandardActionSchema } from './defaults';

const middlewareConfig = {
  actionSchema: { }
};

export default (config = { }) => {
  const ajv = new Ajv();

  ['actionSchema'].forEach(key => {
    if (config[key]) {
      middlewareConfig[key] = config[key];
    }
  });

  ajv.addSchema(standardActionSchema, 'standardActionSchema');
  ajv.addSchema(fluxStandardActionSchema, 'fluxStandardActionSchema');
  ajv.addSchema(middlewareConfig.actionSchema, 'actionSchema');

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

    if (!ajv.validate('actionSchema', action)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }

    return next(action);
  };
};
