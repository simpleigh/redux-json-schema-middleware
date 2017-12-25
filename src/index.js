import Ajv from 'ajv';

import { standardActionSchema } from './defaults';

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
  ajv.addSchema(middlewareConfig.actionSchema, 'actionSchema');

  return store => next => action => {
    if (!ajv.validate('standardActionSchema', action)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }
    if (!ajv.validate('actionSchema', action)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }

    return next(action);
  };
};
