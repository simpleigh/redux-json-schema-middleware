export default {
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
