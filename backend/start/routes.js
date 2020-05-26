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
Route.get('/getUserId', 'AuthController.getUserId')

Route.post('/users', 'UserController.store').middleware(["auth", "isAuthAndActive","isAdmin"]).validator('StoreUser')
Route.get('/users', 'UserController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users/search', 'UserController.search').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/users/:id', 'UserController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users/:id', 'UserController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/setores', 'SetorController.store').middleware(["auth", "isAuthAndActive","isAdmin"]).validator('StoreSetor')
Route.get('/setores', 'SetorController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/search', 'SetorController.search').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/setores/:id', 'SetorController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/:id', 'SetorController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/consumo', 'ConsumoController.store').middleware(["auth", "isAuthAndActive", "isSupplier"])
Route.get('/consumo', 'ConsumoController.index').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/consumeAllTime', 'ConsumoController.consumeAllTime').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/consumePerPeriod', 'ConsumoController.consumePerPeriod').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/consumePerYear', 'ConsumoController.consumePerYear').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/consumePerMonth', 'ConsumoController.consumePerMonth').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/consumePerDay', 'ConsumoController.consumePerDay').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorConsumeAllTime/:id', 'ConsumoController.sectorConsumeAllTime').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorConsumePerPeriod/:id', 'ConsumoController.sectorConsumePerPeriod').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorConsumePerYear/:id', 'ConsumoController.sectorConsumePerYear').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorConsumePerMonth/:id', 'ConsumoController.sectorConsumePerMonth').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorConsumePerDay/:id', 'ConsumoController.sectorConsumePerDay').middleware(["auth", "isAuthAndActive"])