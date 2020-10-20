'use strict'

const Setor = use('App/Models/Setor')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with setors
 */
class SetorController {
  /**
   * Show a list of all setors.
   * GET setors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({request, response} ) {
    const pagination = request.get()

    let page = pagination.page || 1
    let itemsPerPage = pagination.itemsPerPage || 10
    
    if(typeof pagination.orderBy === 'undefined' || pagination.orderBy == 'null')
        pagination.orderBy = 'nome'
    
    if(typeof pagination.sortDesc === 'undefined' || pagination.sortDesc == 'null' || pagination.sortDesc == 'false')
       pagination.sortDesc = 'asc'   
    else 
       pagination.sortDesc = 'desc'    

    try{
      const setores = await Database
        .from('setores')
        .orderBy(pagination.orderBy, pagination.sortDesc)
        .paginate(page, itemsPerPage)

      return response.status(200).json(setores)
    }
    catch(err){
      return response.status(500).json({ message: 'Ocorreu um erro interno', error: err })
    }    
  }


  async search ({ request, response }) {
    const search = request.get()

      let page = search.page || 1
      let itemsPerPage = search.itemsPerPage || 10
      
      if(typeof search.orderBy === 'undefined' || search.orderBy == 'null')
        search.orderBy = 'nome'
      
      if(typeof search.sortDesc === 'undefined' || search.sortDesc == 'null' || search.sortDesc == 'false')
        search.sortDesc = 'asc'   
      else 
        search.sortDesc = 'desc'  
          
      try{
          const setores = await Database
            .from('setores')
            .where('nome', 'ILIKE', '%'+search.term+'%')
            .orderBy(search.orderBy, search.sortDesc)
            .paginate(page, itemsPerPage)

          return response.status(200).json(setores)
      }
      catch(err){
          return response.status(500).json({ message: 'Ocorreu um erro interno', error: err})
      }  
  }


async list ({ request, response }) {
  const params = request.get()

  try{
    const setores = await Database
      .from('setores')
      .orderBy('nome', 'asc')
      .where('isActive', params.setorStatus)
      .paginate(params.page, 20)

    return response.status(200).json(setores)
  }
  catch(err){
    return response.status(500).json({ message: 'Ocorreu um erro interno', error: err })
  }    
}

  async searchSetores({ request, response }) {
    const search = request.get()

    try{
      const setores = await Database
        .from('setores')
        .orderBy('nome', 'desc')
        .where('isActive', search.setorStatus)
        .andWhere('nome', 'ILIKE', '%'+search.term+'%')
        .paginate(search.page, 20)

      return response.status(200).json(setores)
    }
    catch(err){
        return response.status(500).json({ message: 'Ocorreu um erro interno', error: err })
    }  
  }

  /**
   * Render a form to be used for creating a new setor.
   * GET setors/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view}) {
   
  }

  /**
   * Create/save a new setor.
   * POST setors
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['nome', 'isActive'])

    try{
      const setor = await Setor.create(data)
      return setor
    }
    catch(err){
      if(err.constraint == 'setores_nome_unique')
        return response.status(409).json({ message: 'Setor já existe'})
      else
        return response.status(500).json({ message: 'Ocorreu um erro interno', error: err})  
    }
  }

  /**
   * Display a single setor.
   * GET setors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request }) {
    const setor = await Setor.findOrFail(params.id)

    return setor
  }

  async getSectorName({params}) {
    const setor = await Setor.findByOrFail('slug', params.slug)

    return setor
  }

  /**
   * Render a form to update an existing setor.
   * GET setors/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update setor details.
   * PUT or PATCH setors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const setor = await Setor.findOrFail(params.id)

    const data = request.only(['nome', 'isActive' ])

    setor.merge(data)

    await setor.save()

    return setor
  }


  
  /**
   * Delete a setor with id.
   * DELETE setors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
}

module.exports = SetorController
