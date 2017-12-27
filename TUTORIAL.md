# Tutorial

You've built a new Todos application using Redux,
but are nervous that new functionality you're building might corrupt the store
and lose your customers' todos.
Luckily you've come to the right place!

## Grab the Redux Todos example

Clone the [Redux repository](https://github.com/reactjs/redux) and navigate to
the `examples/todos` directory.

```shell
cd examples/todos
npm install
```

Take a look around and make sure you're happy with how it works.
In particular, make sure you can get the application running in a browser
(`npm start`; see https://github.com/reactjs/redux/tree/master/examples/todos).

## Install `redux-json-schema-middleware`

Install using `npm`.
We install as a development dependency as the project uses webpack to bundle
dependencies.

```shell
npm install --save-dev redux-json-schema-middleware
```

Then modify `src/index.js` to add the middleware to the store:

```diff
--- a/examples/todos/src/index.js
+++ b/examples/todos/src/index.js
@@ -1,11 +1,14 @@
 import React from 'react'
 import { render } from 'react-dom'
-import { createStore } from 'redux'
+import { createStore, applyMiddleware } from 'redux'
 import { Provider } from 'react-redux'
 import App from './components/App'
 import reducer from './reducers'
+import createMiddleware from 'redux-json-schema-middleware'

-const store = createStore(reducer)
+const middleware = createMiddleware()
+
+const store = createStore(reducer, applyMiddleware(middleware))

 render(
   <Provider store={store}>
```

The app should still be working correctly. Hurrah!

For reference, `src/index.js` should now look as follows:

```javascript
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import createMiddleware from 'redux-json-schema-middleware'

const middleware = createMiddleware()

const store = createStore(reducer, applyMiddleware(middleware))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Add a schema for the store

The store should contain a `visibilityFilter` showing what items are visible,
and a list of `todos`.
Modify the call to `createMiddleware()` in `src/index.js` to specify the schema:

```diff
--- a/examples/todos/src/index.js
+++ b/examples/todos/src/index.js
@@ -6,7 +6,32 @@ import App from './components/App'
 import reducer from './reducers'
 import createMiddleware from 'redux-json-schema-middleware'

-const middleware = createMiddleware()
+const middleware = createMiddleware({
+  storeSchema: {
+    type: 'object',
+    required: ['visibilityFilter', 'todos'],
+    properties: {
+      visibilityFilter: {
+        type: 'string',
+        enum: ['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED']
+      },
+      todos: {
+        type: 'array',
+        items: {
+          type: 'object',
+          required: ['id', 'text', 'completed'],
+          properties: {
+            id: { type: 'integer', minimum: 0 },
+            text: { type: 'string', minLength: 1 },
+            completed: { type: 'boolean' }
+          },
+          additionalProperties: false
+        }
+      }
+    },
+    additionalProperties: false
+  }
+})
```

Now the store will be validated any time an action is dispatched,
thereby ensuring that any reducers leave the store in a consistent state.

The app should still be working correctly - all we've done is validate that the
store is correct.

## Add schemas for actions

Validating the store means we can detect issues much more quickly,
but we can also validate incoming actions.
As well as detecting problems, schemas assert that actions have the right fields
in the right places and we can avoid having to do this in code.

Update `src/index.js` again:

```diff
--- a/examples/todos/src/index.js
+++ b/examples/todos/src/index.js
@@ -7,6 +7,38 @@ import reducer from './reducers'
 import createMiddleware from 'redux-json-schema-middleware'

 const middleware = createMiddleware({
+  perActionSchemas: {
+    ADD_TODO: {
+      type: 'object',
+      required: ['type', 'id', 'text'],
+      properties: {
+        type: { type: 'string', const: 'ADD_TODO' },
+        id: { type: 'integer', minimum: 0 },
+        text: { type: 'string', minLength: 1 }
+      },
+      additionalProperties: false
+    },
+    TOGGLE_TODO: {
+      type: 'object',
+      required: ['type', 'id'],
+      properties: {
+        type: { type: 'string', const: 'TOGGLE_TODO' },
+        id: { type: 'integer', minimum: 0 }
+      },
+      additionalProperties: false
+    },
+    SET_VISIBILITY_FILTER: {
+      type: 'object',
+      required: ['type', 'filter'],
+      properties: {
+        type: { type: 'string', const: 'SET_VISIBILITY_FILTER' },
+        filter: {
+          type: 'string',
+          enum: ['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED']
+        }
+      }
+    }
+  },
   storeSchema: {
     type: 'object',
     required: ['visibilityFilter', 'todos'],
```
