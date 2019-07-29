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

URL Parameters -> `tour/:id` --> `req.params` --> `{ id: '' }`. when optional --> `tour/:id?`

## Refactoring Routes
`app.routes('').get(handler).post(handler)...` chain

## REQ-RES CYCLE
**Middleware Stack**. execute order as defined in the code. 'pipeline'