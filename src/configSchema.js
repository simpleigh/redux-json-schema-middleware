export default {
  type: 'object',
  properties: {
    ajv: { type: 'object' },
    actionSchema: { type: 'object' },
    fluxStandardAction: {
      type: 'boolean',
      default: false
    },
    perActionSchemas: {
      type: 'object',
      additionalProperties: { type: 'object' }
    },
    storeSchema: { type: 'object' }
  },
  additionalProperties: false
}
