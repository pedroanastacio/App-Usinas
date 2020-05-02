'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/authenticate', 'AuthController.authenticate')
Route.post('/logout', 'AuthController.logout').middleware(["auth"])

Route.post('/users', 'UserController.store').middleware(["auth"])
Route.get('/users', 'UserController.index').middleware(["auth"])
Route.delete('/users/:id', 'UserController.destroy').middleware(["auth"])
Route.put('/users/:id', 'UserController.update').middleware(["auth"])
Route.get('/users/:id', 'UserController.show').middleware(["auth"])


Route.resource('setores', 'SetorController').apiOnly().middleware(["auth"])

Route.resource('consumo', 'ConsumoController').apiOnly().middleware(["auth"])