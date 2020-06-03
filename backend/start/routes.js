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

Route.post('/users', 'UserController.store')
    .middleware(["auth", "isAuthAndActive","isAdmin"]).validator('StoreUser')
Route.get('/users', 'UserController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users/search', 'UserController.search').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/users/:id', 'UserController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/users/:id', 'UserController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/setores', 'SetorController.store').middleware(["auth", "isAuthAndActive","isAdmin"]).validator('StoreSetor')
Route.get('/setores', 'SetorController.index').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/listSetores', 'SetorController.list').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/search', 'SetorController.search').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/searchSetores', 'SetorController.searchSetores').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.put('/setores/:id', 'SetorController.update').middleware(["auth", "isAuthAndActive","isAdmin"])
Route.get('/setores/:id', 'SetorController.show').middleware(["auth", "isAuthAndActive","isAdmin"])

Route.post('/consumo', 'ConsumoController.store').middleware(["auth", "isAuthAndActive", "isSupplier"])
Route.get('/consumo', 'ConsumoController.index').middleware(["auth", "isAuthAndActive"])

Route.get('/consumo/allTime', 'ConsumoController.consumeAllTime').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/perPeriod', 'ConsumoController.consumePerPeriod').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/perYear', 'ConsumoController.consumePerYear').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/perMonth', 'ConsumoController.consumePerMonth').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/perDay', 'ConsumoController.consumePerDay').middleware(["auth", "isAuthAndActive"])

Route.get('/consumo/sectorAllTime/:slug', 'ConsumoController.sectorConsumeAllTime').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorPerPeriod/:slug', 'ConsumoController.sectorConsumePerPeriod').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorPerYear/:slug', 'ConsumoController.sectorConsumePerYear').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorPerMonth/:slug', 'ConsumoController.sectorConsumePerMonth').middleware(["auth", "isAuthAndActive"])
Route.get('/consumo/sectorPerDay/:slug', 'ConsumoController.sectorConsumePerDay').middleware(["auth", "isAuthAndActive"])