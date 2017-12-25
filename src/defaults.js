export const standardActionSchema = {
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      type: 'string'
    }
  }
};

export const fluxStandardActionSchema = {
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      type: 'string',
    },
    error: { },
    payload: { },
    meta: { }
  },
  additionalProperties: false
};
