## RESTful API (Representational State Transfer)
- noun.
- plural.
- http method(verb)
   - GET - read
   - POST - create
   - PUT & PATCH - update
   - DELETE - delete

## Handle Req
`req.body` --middleware--> `app.use(express.json())`

URL Parameters -> `tour/:id` --> `req.params` --> `{ id: '' }`. optional --> `tour/:id?`

## Refactoring Routes
`app.route('').get(handler).post(handler)...` chain

## REQ-RES CYCLE
**Middleware Stack**. execute order as defined in the code. 'pipeline'

## Middleware
```javascript
app.use((req, res, next) => {
  ...
  ...
  next()
})
```

## Separate Router. (small sub app for each of these resources)
```javascript
const someRouter = express.Router()

someRouter.route('/subpath/').get(handler).post(handler)...

app.use('/path/', someRouter)
```

## File Structure
[routes folder]. [controllers folder]. [server.js file]

## Param Middleware

```javascript
router.param('id', (req, res, next, val) => {
  ...
  next()
})
```

## Chaining Middleware

## Static File Serving
```express.static(`${__dirname}/...path...`)```

## Environment Variables
`npm -i dotenv`. `config.env` file

## Eslint + Prettier

```
npm -i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-node eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

`.prettierrc` file
```json
{
  "singleQuote": true
}
```

`.eslintrc.json` file
```json
{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
  }
}
```

## What is Mongoose?
Mongoose is an Object Data Modeling(ODM) library for MongoDB and Node.js, a layer of abstraction over the regular MongoDB driver, a higher level of abstraction.

Features: schemas to model data and relationships, easy data validation, simple query API, middleware, etc.

Schema: model data, by describing the structure of the data, default values, and validation.

Model: a wrapper for the Schema, providing an interface to the database for CRUD operations.

## Intro to Back-End Architecture.

- Controller: application logic, application implementation, managing req & res, technical aspects, bridge.
- Model: business logic, how the business works, and business needs. 
- view: presentation logic

###### fat modal, thin controller.

## process.argv
option



## MongoDB CRUD
[MONGODB MANUAL](https://docs.mongodb.com/manual/)

`Mongoose`

`req.query`

`create()`. `find()`. `sort()`. `select()`. `skip()`. `limit()`.

## Aggregation Pipeline
`$match`. `$group`. `$sort`...

## Virtual Properties

## Document Middleware
`Schema.pre(...)`. `Schema.post(...)` 'save'. working on `save` & `create`. not working on `update`

`this` -> current document

`next()`

## Query Middleware
`Schema.pre(...)`. `Schema.post(...)` 'find'

`this` -> current query

## Aggregation Middleware
`Schema.pre(...)`. `Schema.post(...)` 'aggregate'

`this` -> current aggregate --- `this.pipeline()`

## Data Validation
validate fields:

required.

- String: maxlength. minlength. enum
- Number & Date: min. max.

##### custom validator:
```javascript
{
  validate: {
	validator: function(val) { // val -> current field value
	  return val < this.price; // this -> only points to current doc on NEW document creation. 
    },
    message: '...'
  }
}
```