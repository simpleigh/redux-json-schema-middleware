import Ajv from 'ajv';

const middlewareConfig = {
  actionsSchema: {
    type: 'object',
    required: ['type'],
    properties: {
      type: {
        type: 'string'
      }
    }
  }
};

export default (config = { }) => {
  const ajv = new Ajv();
  ajv.addSchema(middlewareConfig.actionsSchema, 'actions');

  return store => next => action => {
    if (!ajv.validate('actions', action)) {
      throw new Error(ajv.errorsText(ajv.errors));
    }

    return next(action);
  };
};
