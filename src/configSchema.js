export default {
  type: 'object',
  properties: {
    actionSchema: { type: 'object' },
    ajv: { type: 'object' },
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
