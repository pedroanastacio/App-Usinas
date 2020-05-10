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

Route.post('/authenticate', 'AuthController.authenticate').middleware(["isActive"]).validator('AuthValidator')

Route.post('/users', 'UserController.store').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users', 'UserController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/users/:id', 'UserController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users/:id', 'UserController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/setores', 'SetorController.store').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores', 'SetorController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/setores/:id', 'SetorController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/:id', 'SetorController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/consumo', 'ConsumoController.store').middleware(["auth", "isAuthAndActive", "isSupplier"])
Route.get('/consumo', 'ConsumoController.index').middleware(["auth", "isAuthAndActive"])
