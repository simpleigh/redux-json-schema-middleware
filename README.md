# redux-json-schema-middleware

[![Build Status](https://travis-ci.org/simpleigh/redux-json-schema-middleware.svg?branch=master)](https://travis-ci.org/simpleigh/redux-json-schema-middleware)
[![Codecov](https://img.shields.io/codecov/c/github/simpleigh/redux-json-schema-middleware.svg)](https://codecov.io/gh/simpleigh/redux-json-schema-middleware)
[![Issues](https://img.shields.io/github/issues/simpleigh/redux-json-schema-middleware.svg)](https://github.com/simpleigh/redux-json-schema-middleware/issues)

[JSON Schema](http://json-schema.org/) middleware for [Redux](https://redux.js.org/).

## Usage

### Configuration

Provide a configuration object when creating the middleware:

```javascript
import createMiddleware from 'redux-json-schema-middleware';
const middleware = createMiddleware({
  actionSchema: { },
  fluxStandardAction: false,
  perActionSchemas: { },
  storeSchema: { }
});
```

#### `actionSchema`

A JSON schema that will be used to validate all actions dispatched to the store.

```javascript
{
  actionSchema: {
    type: 'object',
    required: ['type', 'timestamp'],
    properties: {
      type: { type: 'string' },
      timestamp: { type: 'integer' }
    },
    additionalProperties: false
  }
}
```

#### `fluxStandardAction`

Whether actions should be checked for
[FSA](https://github.com/acdlite/flux-standard-action) compliance.

```javascript
{
  fluxStandardAction: true
}
```

#### `perActionSchemas`

Schemas to be used to validate different types of actions, e.g.:

```javascript
{
  perActionSchemas: {
    ADD_TODO: {
      type: 'object',
      required: ['text'],
      properties: {
        text: {
          type: 'string',
          minLength: 1
        }
      },
      additionalProperties: false
    },
    TOGGLE_TODO: {
      type: 'object',
      required: ['index'],
      properties: {
        index: {
          type: 'integer',
          minimum: 1
        }
      },
      additionalProperties: false
    },
    SET_VISIBILITY_FILTER: {
      type: 'object',
      required: ['filter'],
      properties: {
        filter: {
          type: 'string',
          enum: ['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED']
        }
      }
    }
  }
}
```

#### `storeSchema`

A schema that will be used to validate the store itself.

```javascript
{
  storeSchema: {
    type: 'object',
    required: ['visibilityFilter', 'todos'],
    properties: {
      visibilityFilter: {
        type: 'string',
        enum: ['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED']
      },
      todos: {
        type: 'array',
        items: {
          type: 'object',
          required: ['text', 'completed'],
          properties: {
            text: {
              type: 'string',
              minLength: 1
            },
            completed: {
              type: 'boolean'
            }
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  }
}
```

### Error API

Any validation errors are thrown as `ValidationError` objects.
These contain additional information about the error that occurred:

```javascript
try {
  store.dispatch({ type: 'test' });
} catch (e) {
  // Message describing the validation error
  e.message;  // "data should have required property '.test'"

  // Text describing the validation error
  e.errorText;  // "data should have required property '.test'"

  // Object that failed validation
  e.object;  // { type: 'test' }

  // Type of the object that failed validation (action or store)
  e.objectType;  // 'action'

  // Schema used to validate the object
  e.schema;  // { type: 'object', required: [ 'type', 'test' ]. }
}
```
