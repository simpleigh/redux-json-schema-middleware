# redux-json-schema-middleware

[![npm](https://img.shields.io/npm/v/redux-json-schema-middleware.svg)](https://www.npmjs.com/package/redux-json-schema-middleware)
[![Build Status](https://travis-ci.org/simpleigh/redux-json-schema-middleware.svg?branch=master)](https://travis-ci.org/simpleigh/redux-json-schema-middleware)
[![Codecov](https://img.shields.io/codecov/c/github/simpleigh/redux-json-schema-middleware.svg)](https://codecov.io/gh/simpleigh/redux-json-schema-middleware)
[![Downloads](https://img.shields.io/npm/dt/redux-json-schema-middleware.svg)](https://www.npmjs.com/package/dotjs-loader)
[![Issues](https://img.shields.io/github/issues/simpleigh/redux-json-schema-middleware.svg)](https://github.com/simpleigh/redux-json-schema-middleware/issues)

[JSON Schema](http://json-schema.org/) middleware for [Redux](https://redux.js.org/).

Redux centralises all application state into a central store.
A small bug in a reducer could easily corrupt that store.
This corruption might go unnoticed for some time,
leading to strange application behaviour or (worse) loss of data.

This middleware makes it easy to detect store corruption by validating the shape
of the store every time an action is dispatched,
allowing the application to fail fast if something goes wrong.
The middleware also supports validation of actions.

## Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Creating the store](#creating-the-store)
* [API](#api)
  * [Configuration options](#configuration-options)
  * [Error objects](#error-objects)
* [Similar projects](#similar-projects)

## Usage

See also the [tutorial](TUTORIAL.md) for a fuller introduction.

### Installation

Install using `npm` or [`yarn`](https://yarnpkg.com/).

```shell
npm install --save-dev redux-json-schema-middleware
```

### Configuration

Provide a configuration object when creating the middleware:

```javascript
import createMiddleware from 'redux-json-schema-middleware';
const middleware = createMiddleware({
  actionSchema: { },          // schema for all actions
  fluxStandardAction: false,  // validate actions as FSA-compliant
  perActionSchemas: { },      // schemas for individual actions
  storeSchema: { }            // schema for the store
});
```

All properties are optional; full documentation [below](#configuration-options).

### Creating the store

When you create your Redux store include the middleware in the call to
`createStore()`.

```javascript
import { createStore, applyMiddleware } from 'redux';
let store = createStore(
  reducer,                     // your reducer function
  applyMiddleware(middleware)  // middleware created as above
);
```

See the Redux documentation for more information:
* [Middleware](https://redux.js.org/docs/advanced/Middleware.html)
* [`createStore`](https://redux.js.org/docs/api/createStore.html)
* [`applyMiddleware`](https://redux.js.org/docs/api/applyMiddleware.html)

## API

### Configuration options

Pass configuration options when creating the middleware.
An [error](#error-objects) will be thrown if the supplied configuration is
invalid.

#### `actionSchema`

A JSON schema that will be used to validate all actions dispatched to the store.
For example, you may wish to ensure that all actions provide a timestamp:

```javascript
const middleware = createMiddleware({
  actionSchema: {
    type: 'object',
    required: ['type', 'timestamp'],
    properties: {
      type: { type: 'string' },
      timestamp: { type: 'integer' }
    }
  }
});
```

An [error](#error-objects) will be thrown if an action doesn't validate against
the schema.

#### `fluxStandardAction`

Whether actions should be checked for
[FSA](https://github.com/acdlite/flux-standard-action) compliance.

```javascript
const middleware = createMiddleware({
  fluxStandardAction: true
});
```

An [error](#error-objects) will be thrown if an action doesn't validate against
the built-in schema for FSA actions.

#### `perActionSchemas`

Schemas to be used to validate different types of actions.
Provide a dictionary mapping types to their schemas.
The following example defines schemas for two types of action:

```javascript
const middleware = createMiddleware({
  ADD_ITEM: {
    type: 'object',
    required: ['type', 'key', 'value'],
    properties: {
      type: { type: 'string', const: 'ADD_ITEM' },
      key: { type: 'string', minLength: 1 },
      value: { }
    }
  },
  REMOVE_ITEM: {
    type: 'object',
    required: ['type', 'key'],
    properties: {
      type: { type: 'string', const: 'REMOVE_ITEM' },
      key: { type: 'string', minLength: 1 },
    }
  }
});
```

An [error](#error-objects) will be thrown if an action doesn't validate against
its schema.
If a schema hasn't been defined for an action then the action will be processed
anyway.

#### `storeSchema`

A schema that will be used to validate the store itself.
The following example checks that the store has a couple of required properties:

```javascript
const middleware = createMiddleware({
  type: 'object',
  required: ['objects', 'count'],
  properties: {
    objects: { type: 'object' },
    count: { type: 'integer' }
  }
});
```

An [error](#error-objects) will be thrown if the store doesn't validate against
its schema.

### Error objects

Any validation errors cause an error to be thrown.
These contain additional information about the error that occurred:

```javascript
try {
  store.dispatch({ type: 'test' });
} catch (e) {
  // Message describing the validation error
  e.message;  // "redux-json-schema-middleware: action error using schema 'action'"

  // Text describing the validation error
  e.errorText;  // "data should have required property '.test'"

  // Object that failed validation
  e.object;  // { type: 'test' }

  // Type of the object that failed validation (action, config or store)
  e.objectType;  // 'action'

  // Schema used to validate the object
  e.schema;  // { type: 'object', required: [ 'type', 'test' ]. }
}
```

## Similar projects

[`redux-json-schema`](https://www.npmjs.com/package/redux-json-schema) is a
similar project that allows a Redux store to be validated using a JSON schema.
This project provides the following improvements:
* it extends Redux in the standard fashion (as middleware) rather than by
  wrapping the reducer
* it also allows validation of incoming actions
